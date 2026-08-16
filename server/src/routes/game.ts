import { Router, Response } from 'express';
import { db } from '../db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { GameLogic } from '../services/gameLogic';
import { WasteType, ProductType, LocationId } from '../types';
import {
  PRODUCT_BASE_PRICES,
  UPGRADE_PRICES,
  STORAGE_LIMITS_BY_LEVEL,
  TRUCK_CAPACITY_BY_LEVEL,
} from '../services/defaultState';

export const gameRouter = Router();

// Apply auth middleware to all game routes
gameRouter.use(authMiddleware);

// Get current game state
gameRouter.get('/', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  let state = db.getGameState(user.id);
  state = GameLogic.refreshGameState(state);
  db.saveGameState(state);
  res.json({ state });
});

// Complete Tutorial
gameRouter.post('/tutorial/complete', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const state = db.getGameState(user.id);
  state.hasCompletedTutorial = true;
  db.saveGameState(state);
  res.json({ state, message: 'Tutorial completed' });
});

// Waste Collection
gameRouter.post('/collect', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const state = db.getGameState(user.id);
  GameLogic.refreshGameState(state);

  const { locationId, collectAll } = req.body;
  const storageCap = GameLogic.getStorageCapacity(state);
  const currentWeight = GameLogic.getCurrentCollectedWeight(state);

  if (currentWeight >= storageCap) {
    res.status(400).json({ error: 'Storage warehouse is full! Please sort or transport waste first, or upgrade storage.' });
    return;
  }

  let totalCollectedThisAction = 0;
  const collectedDetails: Record<string, number> = {};

  const processLocation = (loc: LocationId) => {
    const locWaste = state.uncollectedWaste[loc] || {};
    Object.entries(locWaste).forEach(([type, qty]) => {
      const wt = type as WasteType;
      const available = qty || 0;
      if (available <= 0) return;

      const spaceLeft = storageCap - (GameLogic.getCurrentCollectedWeight(state));
      if (spaceLeft <= 0) return;

      const toCollect = Math.min(available, spaceLeft);
      state.uncollectedWaste[loc][wt] = (state.uncollectedWaste[loc][wt] || 0) - toCollect;
      state.collectedWaste[wt] = (state.collectedWaste[wt] || 0) + toCollect;
      
      totalCollectedThisAction += toCollect;
      collectedDetails[wt] = (collectedDetails[wt] || 0) + toCollect;
    });
  };

  if (collectAll) {
    const locs: LocationId[] = ['houses', 'schools', 'offices', 'factories', 'parks', 'construction'];
    locs.forEach(processLocation);
  } else if (locationId) {
    processLocation(locationId as LocationId);
  } else {
    res.status(400).json({ error: 'Invalid location specified' });
    return;
  }

  if (totalCollectedThisAction > 0) {
    state.stats.totalWasteCollected += totalCollectedThisAction;
    state.xp += Math.max(5, Math.floor(totalCollectedThisAction * 0.5));
    GameLogic.updateMissionProgress(state, 'collect', totalCollectedThisAction);
  }

  GameLogic.refreshGameState(state);
  db.saveGameState(state);

  res.json({
    state,
    collectedAmount: totalCollectedThisAction,
    collectedDetails,
    message: totalCollectedThisAction > 0
      ? `Collected ${totalCollectedThisAction} kg of waste!`
      : 'No waste available at this location right now.',
  });
});

// Waste Sorting Mini-Game Result
gameRouter.post('/sort', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const state = db.getGameState(user.id);
  GameLogic.refreshGameState(state);

  const { isCorrect } = req.body;

  let xpDelta = 0;
  if (isCorrect) {
    state.stats.totalCorrectSorts += 1;
    // Sorter level multiplier
    const sorterLevel = state.upgrades.sorterLevel || 1;
    const bonus = sorterLevel === 3 ? 1.6 : sorterLevel === 2 ? 1.25 : 1.0;
    xpDelta = Math.round(10 * bonus);
    state.xp += xpDelta;
    GameLogic.updateMissionProgress(state, 'sort', 1);
  } else {
    state.stats.totalWrongSorts += 1;
    xpDelta = -5;
    state.xp = Math.max(0, state.xp + xpDelta);
  }

  GameLogic.refreshGameState(state);
  db.saveGameState(state);

  res.json({
    state,
    isCorrect,
    xpDelta,
    message: isCorrect ? `✅ Correct Sorting! +${xpDelta} XP` : `❌ Wrong Bin! ${xpDelta} XP`,
  });
});

// Waste Transport to Recycling Plants
gameRouter.post('/transport', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const state = db.getGameState(user.id);
  GameLogic.refreshGameState(state);

  const { wasteType, quantity } = req.body;
  const wt = wasteType as WasteType;
  const qty = parseInt(quantity, 10);

  if (!wt || isNaN(qty) || qty <= 0) {
    res.status(400).json({ error: 'Please specify a valid waste type and positive quantity' });
    return;
  }

  const available = state.collectedWaste[wt] || 0;
  if (available < qty) {
    res.status(400).json({ error: `Not enough ${wt} in storage (Available: ${available} kg)` });
    return;
  }

  const truckCap = GameLogic.getTruckCapacity(state);
  if (qty > truckCap) {
    res.status(400).json({ error: `Truck capacity exceeded! Max capacity: ${truckCap} kg. Upgrade your truck in the Shop!` });
    return;
  }

  // Calculate transport operating cost (₹0.5 per kg, discounted by Solar Power)
  const discount = state.upgrades.solarPowerLevel === 2 ? 0.6 : state.upgrades.solarPowerLevel === 1 ? 0.3 : 0;
  const baseCost = Math.ceil(qty * 0.5);
  const cost = Math.max(1, Math.round(baseCost * (1 - discount)));

  if (state.money < cost) {
    res.status(400).json({ error: `Insufficient funds for logistics fuel & maintenance (Cost: ₹${cost})` });
    return;
  }

  // Deduct cost and move waste
  state.money -= cost;
  state.collectedWaste[wt] -= qty;
  state.plantWaste[wt] = (state.plantWaste[wt] || 0) + qty;
  state.xp += Math.max(5, Math.floor(qty * 0.2));

  GameLogic.refreshGameState(state);
  db.saveGameState(state);

  res.json({
    state,
    transportedAmount: qty,
    cost,
    message: `🚛 Transported ${qty} kg ${wt} to recycling plant! (Operating Cost: ₹${cost})`,
  });
});

// Recycling Processing
gameRouter.post('/recycle', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const state = db.getGameState(user.id);
  GameLogic.refreshGameState(state);

  const { wasteType, quantity } = req.body;
  const wt = wasteType as WasteType;
  const inputQty = parseInt(quantity, 10);

  if (!wt || isNaN(inputQty) || inputQty <= 0) {
    res.status(400).json({ error: 'Invalid recycling input' });
    return;
  }

  const available = state.plantWaste[wt] || 0;
  if (available < inputQty) {
    res.status(400).json({ error: `Not enough ${wt} at plant. (Available: ${available} kg). Transport more first!` });
    return;
  }

  // Determine Yield Rate
  const plantLevel = state.upgrades.recyclingLevel || 1;
  let yieldRate = plantLevel === 3 ? 0.95 : plantLevel === 2 ? 0.85 : 0.75;
  if (state.activeEvent?.type === 'bonus') {
    yieldRate = Math.min(1.0, yieldRate * (state.activeEvent.multiplierRecycleBonus || 1.3));
  }

  // Deduct plant waste
  state.plantWaste[wt] -= inputQty;

  // Generate finished products according to circular recipes
  const producedSummary: Record<string, number> = {};

  switch (wt) {
    case 'organic': {
      // 50% Compost, 50% Biogas
      const yieldTotal = inputQty * yieldRate;
      const comp = Math.max(1, Math.round(yieldTotal * 0.6));
      const bio = Math.max(1, Math.round(yieldTotal * 0.4));
      state.products.compost = (state.products.compost || 0) + comp;
      state.products.biogas = (state.products.biogas || 0) + bio;
      producedSummary['compost'] = comp;
      producedSummary['biogas'] = bio;
      break;
    }
    case 'plastic': {
      const granules = Math.max(1, Math.round(inputQty * yieldRate));
      state.products.plasticGranules = (state.products.plasticGranules || 0) + granules;
      producedSummary['plasticGranules'] = granules;
      break;
    }
    case 'paper': {
      const cardboard = Math.max(1, Math.round(inputQty * yieldRate));
      state.products.cardboard = (state.products.cardboard || 0) + cardboard;
      producedSummary['cardboard'] = cardboard;
      break;
    }
    case 'glass': {
      const bottles = Math.max(1, Math.round(inputQty * yieldRate));
      state.products.glassBottles = (state.products.glassBottles || 0) + bottles;
      producedSummary['glassBottles'] = bottles;
      break;
    }
    case 'metal': {
      const ingots = Math.max(1, Math.round(inputQty * yieldRate));
      state.products.metalIngots = (state.products.metalIngots || 0) + ingots;
      producedSummary['metalIngots'] = ingots;
      break;
    }
    case 'ewaste': {
      const recovered = Math.max(1, Math.round(inputQty * yieldRate));
      state.products.recoveredMetals = (state.products.recoveredMetals || 0) + recovered;
      producedSummary['recoveredMetals'] = recovered;
      break;
    }
    case 'construction': {
      const yieldTotal = inputQty * yieldRate;
      const pavers = Math.max(1, Math.round(yieldTotal * 0.5));
      const agg = Math.max(1, Math.round(yieldTotal * 0.5));
      state.products.paverBlocks = (state.products.paverBlocks || 0) + pavers;
      state.products.aggregates = (state.products.aggregates || 0) + agg;
      producedSummary['paverBlocks'] = pavers;
      producedSummary['aggregates'] = agg;
      break;
    }
  }

  state.stats.totalWasteRecycled += inputQty;
  const xpGained = Math.round(inputQty * 1.5 * (state.activeEvent?.type === 'bonus' ? 1.3 : 1.0));
  state.xp += xpGained;

  GameLogic.updateMissionProgress(state, 'recycle', inputQty);
  GameLogic.refreshGameState(state);
  db.saveGameState(state);

  res.json({
    state,
    inputQuantity: inputQty,
    producedSummary,
    xpGained,
    message: `🏭 Recycled ${inputQty} kg ${wt} into valuable finished goods! (+${xpGained} XP)`,
  });
});

// Marketplace Selling
gameRouter.post('/sell', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const state = db.getGameState(user.id);
  GameLogic.refreshGameState(state);

  const { productType, quantity, sellAll } = req.body;
  let totalRevenue = 0;
  let totalItemsSold = 0;
  const soldSummary: Record<string, { qty: number; revenue: number }> = {};

  const marketMultiplier = (state.activeEvent?.type === 'high_demand')
    ? (state.activeEvent.multiplierMarketPrice || 1.4)
    : 1.0;

  const sellItem = (pt: ProductType, reqQty?: number) => {
    const available = state.products[pt] || 0;
    if (available <= 0) return;

    const qtyToSell = reqQty ? Math.min(available, reqQty) : available;
    if (qtyToSell <= 0) return;

    const unitPrice = Math.round((PRODUCT_BASE_PRICES[pt] || 500) * marketMultiplier);
    const revenue = unitPrice * qtyToSell;

    state.products[pt] -= qtyToSell;
    totalRevenue += revenue;
    totalItemsSold += qtyToSell;

    soldSummary[pt] = { qty: qtyToSell, revenue };
  };

  if (sellAll) {
    const allProducts: ProductType[] = [
      'compost',
      'biogas',
      'plasticGranules',
      'cardboard',
      'glassBottles',
      'metalIngots',
      'recoveredMetals',
      'paverBlocks',
      'aggregates',
    ];
    allProducts.forEach((pt) => sellItem(pt));
  } else if (productType) {
    sellItem(productType as ProductType, quantity ? parseInt(quantity, 10) : undefined);
  } else {
    res.status(400).json({ error: 'Please specify a product to sell or choose Sell All' });
    return;
  }

  if (totalRevenue <= 0) {
    res.status(400).json({ error: 'No products available to sell!' });
    return;
  }

  state.money += totalRevenue;
  state.stats.totalProfit += totalRevenue;
  state.stats.totalProductsSold += totalItemsSold;
  const xpReward = Math.round(totalItemsSold * 5);
  state.xp += xpReward;

  GameLogic.updateMissionProgress(state, 'sell', totalItemsSold);
  GameLogic.refreshGameState(state);
  db.saveGameState(state);

  res.json({
    state,
    totalRevenue,
    totalItemsSold,
    soldSummary,
    message: `💰 Sold ${totalItemsSold} products for ₹${totalRevenue.toLocaleString()}! (+${xpReward} XP)`,
  });
});

// Upgrade Purchase
gameRouter.post('/upgrade', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const state = db.getGameState(user.id);
  GameLogic.refreshGameState(state);

  const { upgradeType } = req.body;
  if (!upgradeType) {
    res.status(400).json({ error: 'Missing upgrade type' });
    return;
  }

  const currentLevel = (state.upgrades as any)[`${upgradeType}Level`] ?? (upgradeType === 'solarPower' ? 0 : 1);
  const nextLevel = currentLevel + 1;

  const upgradeConfig = (UPGRADE_PRICES as any)[upgradeType]?.[nextLevel];
  if (!upgradeConfig) {
    res.status(400).json({ error: 'Max upgrade level already reached for this item!' });
    return;
  }

  const cost = upgradeConfig.cost;
  if (state.money < cost) {
    res.status(400).json({ error: `Not enough money! Required: ₹${cost.toLocaleString()} (Available: ₹${state.money.toLocaleString()})` });
    return;
  }

  state.money -= cost;
  (state.upgrades as any)[`${upgradeType}Level`] = nextLevel;
  state.xp += 100;

  GameLogic.refreshGameState(state);
  db.saveGameState(state);

  res.json({
    state,
    upgradedTo: nextLevel,
    cost,
    message: `⬆️ Successfully upgraded ${upgradeConfig.name}! (-₹${cost.toLocaleString()})`,
  });
});

// Claim Mission Reward
gameRouter.post('/mission/claim', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const state = db.getGameState(user.id);
  const { missionId } = req.body;

  const mission = state.missions.find((m) => m.id === missionId);
  if (!mission) {
    res.status(404).json({ error: 'Mission not found' });
    return;
  }

  if (!mission.completed) {
    res.status(400).json({ error: 'Mission is not completed yet' });
    return;
  }

  if (mission.claimed) {
    res.status(400).json({ error: 'Mission reward has already been claimed' });
    return;
  }

  mission.claimed = true;
  state.money += mission.rewardMoney;
  state.xp += mission.rewardXP;
  
  GameLogic.refreshGameState(state);
  db.saveGameState(state);

  res.json({
    state,
    reward: {
      money: mission.rewardMoney,
      xp: mission.rewardXP,
      greenScore: mission.rewardGreenScore,
    },
    message: `🎉 Mission Completed: Claimed ₹${mission.rewardMoney} & ${mission.rewardXP} XP!`,
  });
});

// Trigger Random Event
gameRouter.post('/event/trigger', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const state = db.getGameState(user.id);
  const event = GameLogic.triggerRandomEvent(state);
  db.saveGameState(state);
  res.json({ state, event });
});

// Reset Game Progress (Requires Confirmation)
gameRouter.post('/reset', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const freshState = db.resetGameState(user.id);
  res.json({ state: freshState, message: 'Game has been reset to starting state.' });
});
