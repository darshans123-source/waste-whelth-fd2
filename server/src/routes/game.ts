import { Router, Response } from 'express';
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
