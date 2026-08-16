import { Router, Response } from 'express';
<<<<<<< HEAD
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
=======
import { db, initialWasteInventory, initialProductInventory, initialUpgrades, defaultMissions, defaultAchievements } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Helper to calculate total inventory storage weight
function getStorageWeight(inventory: Record<string, number>): number {
  return Object.values(inventory).reduce((acc, qty) => acc + (qty || 0), 0);
}

// Storage limits based on upgrade level
function getMaxStorage(storageLevel: number): number {
  switch (storageLevel) {
    case 1: return 500;
    case 2: return 1500;
    case 3: return 4000;
    default: return 500;
  }
}

// City level evaluator
function checkCityLevel(xp: number, totalRecycled: number, totalProfit: number): number {
  if (xp >= 1500 && totalRecycled >= 1500 && totalProfit >= 60000) return 5; // Green City
  if (xp >= 700 && totalRecycled >= 800 && totalProfit >= 25000) return 4;   // Smart City
  if (xp >= 300 && totalRecycled >= 300 && totalProfit >= 10000) return 3;   // City
  if (xp >= 100 && totalRecycled >= 100) return 2;                           // Town
  return 1;                                                                  // Village
}

// Mission progress updater
function updateMissions(missions: any[], actionType: string, amount: number, currentGreenScore: number) {
  return missions.map(m => {
    if (m.claimed) return m;
    let newCurrent = m.current;
    if (m.id === 'm1' && actionType === 'collect') newCurrent += amount;
    if (m.id === 'm2' && actionType === 'sort') newCurrent += amount;
    if (m.id === 'm3' && actionType === 'recycle') newCurrent += amount;
    if (m.id === 'm4' && actionType === 'sell') newCurrent += amount;
    if (m.id === 'm5') newCurrent = Math.max(m.current, currentGreenScore);

    const completed = newCurrent >= m.target;
    return { ...m, current: newCurrent, completed };
  });
}

// Achievement progress updater
function updateAchievements(achievements: any[], state: any) {
  return achievements.map(a => {
    let current = a.current;
    if (a.id === 'a1') current = state.total_waste_collected;
    if (a.id === 'a2') current = state.total_waste_recycled;
    if (a.id === 'a3') current = state.green_score;
    if (a.id === 'a4') current = state.total_profit;
    if (a.id === 'a5') current = state.city_level;
    if (a.id === 'a6') current = state.city_level;

    const unlocked = current >= a.target;
    return { ...a, current, unlocked };
  });
}

// GET /api/game
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    let state = db.prepare('SELECT * FROM game_states WHERE user_id = ?').get(userId) as any;

    if (!state) {
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO game_states (
          user_id, money, xp, green_score, city_level,
          total_waste_collected, total_waste_recycled, total_products_sold, total_profit,
          waste_inventory, product_inventory, upgrades, missions, achievements, active_event, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId, 5000, 0, 0, 1,
        0, 0, 0, 0,
        JSON.stringify(initialWasteInventory),
        JSON.stringify(initialProductInventory),
        JSON.stringify(initialUpgrades),
        JSON.stringify(defaultMissions),
        JSON.stringify(defaultAchievements),
        null,
        now
      );
      state = db.prepare('SELECT * FROM game_states WHERE user_id = ?').get(userId) as any;
    }

    res.json({
      money: state.money,
      xp: state.xp,
      greenScore: state.green_score,
      cityLevel: state.city_level,
      totalWasteCollected: state.total_waste_collected,
      totalWasteRecycled: state.total_waste_recycled,
      totalProductsSold: state.total_products_sold,
      totalProfit: state.total_profit,
      wasteInventory: JSON.parse(state.waste_inventory),
      productInventory: JSON.parse(state.product_inventory),
      upgrades: JSON.parse(state.upgrades),
      missions: JSON.parse(state.missions),
      achievements: JSON.parse(state.achievements),
      activeEvent: state.active_event ? JSON.parse(state.active_event) : null
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch game state: ' + err.message });
  }
});

// POST /api/game/collect
router.post('/collect', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { location } = req.body; // e.g. 'houses', 'factories'

    const state = db.prepare('SELECT * FROM game_states WHERE user_id = ?').get(userId) as any;
    if (!state) return res.status(404).json({ error: 'Game state not found' });

    const wasteInv = JSON.parse(state.waste_inventory);
    const upgrades = JSON.parse(state.upgrades);
    const currentWeight = getStorageWeight(wasteInv);
    const maxStorage = getMaxStorage(upgrades.storage);

    if (currentWeight >= maxStorage) {
      return res.status(400).json({ error: 'Storage full! Upgrade storage capacity in the shop.' });
    }

    // Generate waste based on location
    const collected: Record<string, number> = {};
    let totalGenerated = 0;

    switch (location) {
      case 'houses':
        collected.organic = 20;
        collected.plastic = 15;
        collected.paper = 10;
        break;
      case 'schools':
        collected.paper = 25;
        collected.plastic = 15;
        collected.organic = 10;
        break;
      case 'offices':
        collected.paper = 30;
        collected.plastic = 15;
        collected.ewaste = 10;
        break;
      case 'factories':
        collected.metal = 25;
        collected.plastic = 20;
        collected.ewaste = 15;
        break;
      case 'parks':
        collected.organic = 35;
        collected.paper = 15;
        break;
      case 'construction':
        collected.construction = 40;
        collected.metal = 20;
        break;
      default:
        collected.organic = 15;
        collected.plastic = 15;
        break;
    }

    totalGenerated = Object.values(collected).reduce((a, b) => a + b, 0);
    
    // Check if adding exceeds capacity
    if (currentWeight + totalGenerated > maxStorage) {
      const scale = (maxStorage - currentWeight) / totalGenerated;
      for (const k in collected) {
        collected[k] = Math.floor(collected[k] * scale);
      }
      totalGenerated = Math.max(0, maxStorage - currentWeight);
    }

    for (const type in collected) {
      wasteInv[type] = (wasteInv[type] || 0) + collected[type];
    }

    const xpGained = Math.round(totalGenerated * 0.5);
    const newXP = state.xp + xpGained;
    const newTotalCollected = state.total_waste_collected + totalGenerated;
    const newGreenScore = Math.min(100, state.green_score + 1);

    const missions = updateMissions(JSON.parse(state.missions), 'collect', totalGenerated, newGreenScore);
    const achievements = updateAchievements(JSON.parse(state.achievements), {
      total_waste_collected: newTotalCollected,
      total_waste_recycled: state.total_waste_recycled,
      green_score: newGreenScore,
      total_profit: state.total_profit,
      city_level: state.city_level
    });

    const newCityLevel = checkCityLevel(newXP, state.total_waste_recycled, state.total_profit);

    db.prepare(`
      UPDATE game_states SET
        waste_inventory = ?, xp = ?, total_waste_collected = ?, green_score = ?, city_level = ?,
        missions = ?, achievements = ?, updated_at = ?
      WHERE user_id = ?
    `).run(
      JSON.stringify(wasteInv), newXP, newTotalCollected, newGreenScore, newCityLevel,
      JSON.stringify(missions), JSON.stringify(achievements), new Date().toISOString(), userId
    );

    res.json({
      success: true,
      collected,
      totalGenerated,
      xpGained,
      wasteInventory: wasteInv,
      xp: newXP,
      greenScore: newGreenScore,
      cityLevel: newCityLevel,
      missions,
      achievements
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Collection failed: ' + err.message });
  }
});

// POST /api/game/sort
router.post('/sort', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { correctCount, wrongCount } = req.body;

    const state = db.prepare('SELECT * FROM game_states WHERE user_id = ?').get(userId) as any;
    if (!state) return res.status(404).json({ error: 'Game state not found' });

    const correct = Math.max(0, Number(correctCount) || 0);
    const wrong = Math.max(0, Number(wrongCount) || 0);

    const xpGained = Math.max(0, (correct * 10) - (wrong * 5));
    const greenScoreDelta = Math.floor(correct * 0.5) - Math.floor(wrong * 0.5);

    const newXP = state.xp + xpGained;
    const newGreenScore = Math.max(0, Math.min(100, state.green_score + greenScoreDelta));

    const missions = updateMissions(JSON.parse(state.missions), 'sort', correct, newGreenScore);
    const achievements = updateAchievements(JSON.parse(state.achievements), {
      total_waste_collected: state.total_waste_collected,
      total_waste_recycled: state.total_waste_recycled,
      green_score: newGreenScore,
      total_profit: state.total_profit,
      city_level: state.city_level
    });

    db.prepare(`
      UPDATE game_states SET xp = ?, green_score = ?, missions = ?, achievements = ?, updated_at = ? WHERE user_id = ?
    `).run(newXP, newGreenScore, JSON.stringify(missions), JSON.stringify(achievements), new Date().toISOString(), userId);

    res.json({
      success: true,
      correct,
      wrong,
      xpGained,
      greenScoreDelta,
      xp: newXP,
      greenScore: newGreenScore,
      missions,
      achievements
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Sorting score update failed: ' + err.message });
  }
});

// POST /api/game/recycle
router.post('/recycle', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { wasteType, amount } = req.body; // e.g. 'plastic', 50

    const state = db.prepare('SELECT * FROM game_states WHERE user_id = ?').get(userId) as any;
    if (!state) return res.status(404).json({ error: 'Game state not found' });

    const wasteInv = JSON.parse(state.waste_inventory);
    const prodInv = JSON.parse(state.product_inventory);
    const qty = Math.max(0, Number(amount) || 0);

    if (!wasteInv[wasteType] || wasteInv[wasteType] < qty || qty === 0) {
      return res.status(400).json({ error: `Not enough ${wasteType} waste to recycle.` });
    }

    // Processing conversion logic
    wasteInv[wasteType] -= qty;

    let outputProduct = '';
    let outputQty = 0;
    let bonusProduct = '';
    let bonusQty = 0;

    switch (wasteType) {
      case 'organic':
        outputProduct = 'compost';
        outputQty = Math.floor(qty * 0.8);
        bonusProduct = 'biogas';
        bonusQty = Math.floor(qty * 0.2);
        break;
      case 'plastic':
        outputProduct = 'plastic_granules';
        outputQty = Math.floor(qty * 0.8);
        break;
      case 'paper':
        outputProduct = 'cardboard';
        outputQty = Math.floor(qty * 0.8);
        break;
      case 'glass':
        outputProduct = 'glass_bottles';
        outputQty = Math.floor(qty * 0.8);
        break;
      case 'metal':
        outputProduct = 'metal_ingots';
        outputQty = Math.floor(qty * 0.8);
        break;
      case 'ewaste':
        outputProduct = 'recovered_metals';
        outputQty = Math.floor(qty * 0.7);
        break;
      case 'construction':
        outputProduct = 'aggregates';
        outputQty = Math.floor(qty * 0.6);
        bonusProduct = 'paver_blocks';
        bonusQty = Math.floor(qty * 0.3);
        break;
      default:
        return res.status(400).json({ error: 'Invalid waste type' });
    }

    prodInv[outputProduct] = (prodInv[outputProduct] || 0) + outputQty;
    if (bonusProduct && bonusQty > 0) {
      prodInv[bonusProduct] = (prodInv[bonusProduct] || 0) + bonusQty;
    }

    const xpGained = Math.round(qty * 1.2);
    const greenGained = Math.ceil(qty * 0.1);
    const newXP = state.xp + xpGained;
    const newGreenScore = Math.min(100, state.green_score + greenGained);
    const newTotalRecycled = state.total_waste_recycled + qty;

    const missions = updateMissions(JSON.parse(state.missions), 'recycle', qty, newGreenScore);
    const newCityLevel = checkCityLevel(newXP, newTotalRecycled, state.total_profit);
    const achievements = updateAchievements(JSON.parse(state.achievements), {
      total_waste_collected: state.total_waste_collected,
      total_waste_recycled: newTotalRecycled,
      green_score: newGreenScore,
      total_profit: state.total_profit,
      city_level: newCityLevel
    });

    db.prepare(`
      UPDATE game_states SET
        waste_inventory = ?, product_inventory = ?, xp = ?, green_score = ?, total_waste_recycled = ?,
        city_level = ?, missions = ?, achievements = ?, updated_at = ?
      WHERE user_id = ?
    `).run(
      JSON.stringify(wasteInv), JSON.stringify(prodInv), newXP, newGreenScore, newTotalRecycled,
      newCityLevel, JSON.stringify(missions), JSON.stringify(achievements), new Date().toISOString(), userId
    );

    res.json({
      success: true,
      wasteType,
      amountRecycled: qty,
      outputProduct,
      outputQty,
      bonusProduct,
      bonusQty,
      wasteInventory: wasteInv,
      productInventory: prodInv,
      xp: newXP,
      greenScore: newGreenScore,
      totalWasteRecycled: newTotalRecycled,
      cityLevel: newCityLevel,
      missions,
      achievements
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Recycling failed: ' + err.message });
  }
});

// Market prices map
const PRODUCT_PRICES: Record<string, number> = {
  compost: 500,
  biogas: 700,
  plastic_granules: 800,
  cardboard: 600,
  glass_bottles: 650,
  metal_ingots: 1000,
  recovered_metals: 1200,
  paver_blocks: 900,
  aggregates: 750
};

// POST /api/game/sell
router.post('/sell', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productKey, amount, sellAll } = req.body;

    const state = db.prepare('SELECT * FROM game_states WHERE user_id = ?').get(userId) as any;
    if (!state) return res.status(404).json({ error: 'Game state not found' });

    const prodInv = JSON.parse(state.product_inventory);

    let totalEarned = 0;
    let totalItemsSold = 0;

    if (sellAll) {
      for (const pKey in prodInv) {
        const qty = prodInv[pKey] || 0;
        if (qty > 0) {
          const price = PRODUCT_PRICES[pKey] || 500;
          totalEarned += qty * price;
          totalItemsSold += qty;
          prodInv[pKey] = 0;
        }
      }
    } else {
      const qty = Math.max(0, Number(amount) || 0);
      if (!prodInv[productKey] || prodInv[productKey] < qty || qty === 0) {
        return res.status(400).json({ error: `Not enough ${productKey} to sell.` });
      }
      const price = PRODUCT_PRICES[productKey] || 500;
      totalEarned = qty * price;
      totalItemsSold = qty;
      prodInv[productKey] -= qty;
    }

    const newMoney = state.money + totalEarned;
    const newProfit = state.total_profit + totalEarned;
    const newSold = state.total_products_sold + totalItemsSold;
    const xpGained = Math.round(totalEarned * 0.05);
    const newXP = state.xp + xpGained;

    const missions = updateMissions(JSON.parse(state.missions), 'sell', totalItemsSold, state.green_score);
    const newCityLevel = checkCityLevel(newXP, state.total_waste_recycled, newProfit);
    const achievements = updateAchievements(JSON.parse(state.achievements), {
      total_waste_collected: state.total_waste_collected,
      total_waste_recycled: state.total_waste_recycled,
      green_score: state.green_score,
      total_profit: newProfit,
      city_level: newCityLevel
    });

    db.prepare(`
      UPDATE game_states SET
        money = ?, total_profit = ?, total_products_sold = ?, product_inventory = ?, xp = ?, city_level = ?,
        missions = ?, achievements = ?, updated_at = ?
      WHERE user_id = ?
    `).run(
      newMoney, newProfit, newSold, JSON.stringify(prodInv), newXP, newCityLevel,
      JSON.stringify(missions), JSON.stringify(achievements), new Date().toISOString(), userId
    );

    res.json({
      success: true,
      totalEarned,
      totalItemsSold,
      money: newMoney,
      totalProfit: newProfit,
      productInventory: prodInv,
      xp: newXP,
      cityLevel: newCityLevel,
      missions,
      achievements
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Selling failed: ' + err.message });
  }
});

// Upgrade cost matrix
const UPGRADE_COSTS: Record<string, Record<number, number>> = {
  truck: { 2: 2000, 3: 6000 },
  sorter: { 2: 3000, 3: 8000 },
  plant: { 2: 5000, 3: 12000 },
  storage: { 2: 2500, 3: 7000 },
  solar: { 1: 4000, 2: 10000 }
};

// POST /api/game/upgrade
router.post('/upgrade', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { category } = req.body; // 'truck', 'sorter', 'plant', 'storage', 'solar'

    const state = db.prepare('SELECT * FROM game_states WHERE user_id = ?').get(userId) as any;
    if (!state) return res.status(404).json({ error: 'Game state not found' });

    const upgrades = JSON.parse(state.upgrades);
    const currentLevel = upgrades[category] || 0;
    const nextLevel = currentLevel + 1;

    const categoryCosts = UPGRADE_COSTS[category];
    if (!categoryCosts || !categoryCosts[nextLevel]) {
      return res.status(400).json({ error: 'Already at maximum level for this upgrade!' });
    }

    const cost = categoryCosts[nextLevel];
    if (state.money < cost) {
      return res.status(400).json({ error: `Not enough money! Required: ₹${cost.toLocaleString()}` });
    }

    upgrades[category] = nextLevel;
    const newMoney = state.money - cost;
    let newGreenScore = state.green_score;

    if (category === 'solar') {
      newGreenScore = Math.min(100, newGreenScore + (nextLevel === 1 ? 15 : 20));
    }

    const achievements = updateAchievements(JSON.parse(state.achievements), {
      total_waste_collected: state.total_waste_collected,
      total_waste_recycled: state.total_waste_recycled,
      green_score: newGreenScore,
      total_profit: state.total_profit,
      city_level: state.city_level
    });

    db.prepare(`
      UPDATE game_states SET money = ?, green_score = ?, upgrades = ?, achievements = ?, updated_at = ? WHERE user_id = ?
    `).run(newMoney, newGreenScore, JSON.stringify(upgrades), JSON.stringify(achievements), new Date().toISOString(), userId);

    res.json({
      success: true,
      category,
      newLevel: nextLevel,
      money: newMoney,
      greenScore: newGreenScore,
      upgrades,
      achievements
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Upgrade failed: ' + err.message });
  }
});

// POST /api/game/claim-mission
router.post('/claim-mission', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { missionId } = req.body;

    const state = db.prepare('SELECT * FROM game_states WHERE user_id = ?').get(userId) as any;
    if (!state) return res.status(404).json({ error: 'Game state not found' });

    const missions = JSON.parse(state.missions);
    const m = missions.find((item: any) => item.id === missionId);

    if (!m) return res.status(404).json({ error: 'Mission not found' });
    if (!m.completed) return res.status(400).json({ error: 'Mission is not completed yet' });
    if (m.claimed) return res.status(400).json({ error: 'Reward already claimed' });

    m.claimed = true;
    const newMoney = state.money + m.rewardMoney;
    const newXP = state.xp + m.rewardXP;
    const newGreenScore = Math.min(100, state.green_score + m.rewardGreen);

    db.prepare(`
      UPDATE game_states SET money = ?, xp = ?, green_score = ?, missions = ?, updated_at = ? WHERE user_id = ?
    `).run(newMoney, newXP, newGreenScore, JSON.stringify(missions), new Date().toISOString(), userId);

    res.json({
      success: true,
      missionId,
      rewardMoney: m.rewardMoney,
      rewardXP: m.rewardXP,
      rewardGreen: m.rewardGreen,
      money: newMoney,
      xp: newXP,
      greenScore: newGreenScore,
      missions
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Claim mission failed: ' + err.message });
  }
});

// POST /api/game/reset
router.post('/reset', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE game_states SET
        money = 5000, xp = 0, green_score = 0, city_level = 1,
        total_waste_collected = 0, total_waste_recycled = 0, total_products_sold = 0, total_profit = 0,
        waste_inventory = ?, product_inventory = ?, upgrades = ?, missions = ?, achievements = ?, active_event = null, updated_at = ?
      WHERE user_id = ?
    `).run(
      JSON.stringify(initialWasteInventory),
      JSON.stringify(initialProductInventory),
      JSON.stringify(initialUpgrades),
      JSON.stringify(defaultMissions),
      JSON.stringify(defaultAchievements),
      now,
      userId
    );

    res.json({ success: true, message: 'Game state reset successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Reset failed: ' + err.message });
  }
});

export default router;
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
