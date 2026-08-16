import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../../waste_to_wealth.json');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export interface UserRow {
  id: string;
  google_id: string | null;
  email: string;
  name: string;
  picture?: string;
  is_demo: number;
  created_at: string;
}

export interface GameStateRow {
  user_id: string;
  money: number;
  xp: number;
  green_score: number;
  city_level: number;
  total_waste_collected: number;
  total_waste_recycled: number;
  total_products_sold: number;
  total_profit: number;
  waste_inventory: string;
  product_inventory: string;
  upgrades: string;
  missions: string;
  achievements: string;
  active_event: string | null;
  updated_at: string;
}

interface DbStore {
  users: UserRow[];
  game_states: GameStateRow[];
}

let store: DbStore = {
  users: [],
  game_states: []
};

function loadStore() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      store = JSON.parse(data);
      if (!store.users) store.users = [];
      if (!store.game_states) store.game_states = [];
    }
  } catch (err) {
    console.error('Error loading JSON DB, initializing empty store:', err);
    store = { users: [], game_states: [] };
  }
}

function saveStore() {
  try {
    const tempPath = dbPath + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), 'utf8');
    fs.renameSync(tempPath, dbPath);
  } catch (err) {
    console.error('Error saving JSON DB:', err);
  }
}

// Initialize database schema
export function initDb() {
  loadStore();
}

export const db = {
  prepare: (sql: string) => {
    return {
      get: (...args: any[]) => {
        loadStore();
        if (sql.includes('FROM users WHERE id = ?')) {
          return store.users.find(u => u.id === args[0]);
        }
        if (sql.includes('FROM users WHERE email = ?')) {
          return store.users.find(u => u.email === args[0]);
        }
        if (sql.includes('FROM users WHERE google_id = ? OR email = ?')) {
          return store.users.find(u => u.google_id === args[0] || u.email === args[1]);
        }
        if (sql.includes('FROM game_states WHERE user_id = ?')) {
          return store.game_states.find(g => g.user_id === args[0]);
        }
        return undefined;
      },
      all: (...args: any[]) => {
        loadStore();
        if (sql.includes('FROM users u') && sql.includes('JOIN game_states g')) {
          const joined = store.users.map(u => {
            const g = store.game_states.find(gs => gs.user_id === u.id);
            return {
              id: u.id,
              name: u.name,
              picture: u.picture,
              green_score: g ? g.green_score : 0,
              total_waste_recycled: g ? g.total_waste_recycled : 0,
              city_level: g ? g.city_level : 1
            };
          });
          joined.sort((a, b) => b.green_score - a.green_score || b.total_waste_recycled - a.total_waste_recycled);
          return joined.slice(0, 10);
        }
        return [];
      },
      run: (...args: any[]) => {
        loadStore();
        if (sql.includes('INSERT INTO users')) {
          const [id, google_id, email, name, picture, is_demo, created_at] = args;
          store.users = store.users.filter(u => u.id !== id && u.email !== email);
          store.users.push({ id, google_id, email, name, picture, is_demo, created_at });
          saveStore();
          return { changes: 1 };
        }
        if (sql.includes('INSERT INTO game_states')) {
          const [
            user_id, money, xp, green_score, city_level,
            total_waste_collected, total_waste_recycled, total_products_sold, total_profit,
            waste_inventory, product_inventory, upgrades, missions, achievements, active_event, updated_at
          ] = args;
          store.game_states = store.game_states.filter(g => g.user_id !== user_id);
          store.game_states.push({
            user_id, money, xp, green_score, city_level,
            total_waste_collected, total_waste_recycled, total_products_sold, total_profit,
            waste_inventory, product_inventory, upgrades, missions, achievements, active_event, updated_at
          });
          saveStore();
          return { changes: 1 };
        }
        if (sql.includes('UPDATE game_states SET')) {
          const userId = args[args.length - 1];
          const gIndex = store.game_states.findIndex(g => g.user_id === userId);
          if (gIndex !== -1) {
            const current = store.game_states[gIndex];
            if (sql.includes('waste_inventory = ?') && sql.includes('product_inventory = ?')) {
              // Recycle update
              const [waste_inventory, product_inventory, xp, green_score, total_waste_recycled, city_level, missions, achievements, updated_at] = args;
              store.game_states[gIndex] = { ...current, waste_inventory, product_inventory, xp, green_score, total_waste_recycled, city_level, missions, achievements, updated_at };
            } else if (sql.includes('waste_inventory = ?')) {
              // Collect update
              const [waste_inventory, xp, total_waste_collected, green_score, city_level, missions, achievements, updated_at] = args;
              store.game_states[gIndex] = { ...current, waste_inventory, xp, total_waste_collected, green_score, city_level, missions, achievements, updated_at };
            } else if (sql.includes('money = ?') && sql.includes('total_profit = ?')) {
              // Sell update
              const [money, total_profit, total_products_sold, product_inventory, xp, city_level, missions, achievements, updated_at] = args;
              store.game_states[gIndex] = { ...current, money, total_profit, total_products_sold, product_inventory, xp, city_level, missions, achievements, updated_at };
            } else if (sql.includes('money = ?') && sql.includes('upgrades = ?')) {
              // Upgrade update
              const [money, green_score, upgrades, achievements, updated_at] = args;
              store.game_states[gIndex] = { ...current, money, green_score, upgrades, achievements, updated_at };
            } else if (sql.includes('money = ?') && sql.includes('xp = ?') && sql.includes('missions = ?')) {
              // Claim mission
              const [money, xp, green_score, missions, updated_at] = args;
              store.game_states[gIndex] = { ...current, money, xp, green_score, missions, updated_at };
            } else if (sql.includes('xp = ?') && sql.includes('green_score = ?')) {
              // Sort update
              const [xp, green_score, missions, achievements, updated_at] = args;
              store.game_states[gIndex] = { ...current, xp, green_score, missions, achievements, updated_at };
            } else if (sql.includes('money = 5000')) {
              // Reset update
              const [waste_inventory, product_inventory, upgrades, missions, achievements, updated_at] = args;
              store.game_states[gIndex] = {
                user_id: userId, money: 5000, xp: 0, green_score: 0, city_level: 1,
                total_waste_collected: 0, total_waste_recycled: 0, total_products_sold: 0, total_profit: 0,
                waste_inventory, product_inventory, upgrades, missions, achievements, active_event: null, updated_at
              };
            }
            saveStore();
            return { changes: 1 };
          }
        }
        return { changes: 0 };
      }
    };
  }
};

export const initialWasteInventory = {
  organic: 0,
  plastic: 0,
  paper: 0,
  glass: 0,
  metal: 0,
  ewaste: 0,
  construction: 0
};

export const initialProductInventory = {
  compost: 0,
  biogas: 0,
  plastic_granules: 0,
  cardboard: 0,
  glass_bottles: 0,
  metal_ingots: 0,
  recovered_metals: 0,
  paver_blocks: 0,
  aggregates: 0
};

export const initialUpgrades = {
  truck: 1,
  sorter: 1,
  plant: 1,
  storage: 1,
  solar: 0
};

export const defaultMissions = [
  { id: 'm1', title: 'Collect 100 kg waste', target: 100, current: 0, rewardMoney: 1000, rewardXP: 50, rewardGreen: 5, completed: false, claimed: false },
  { id: 'm2', title: 'Sort 20 items correctly', target: 20, current: 0, rewardMoney: 800, rewardXP: 40, rewardGreen: 10, completed: false, claimed: false },
  { id: 'm3', title: 'Recycle 50 kg waste', target: 50, current: 0, rewardMoney: 1200, rewardXP: 60, rewardGreen: 10, completed: false, claimed: false },
  { id: 'm4', title: 'Sell 10 products', target: 10, current: 0, rewardMoney: 1500, rewardXP: 75, rewardGreen: 5, completed: false, claimed: false },
  { id: 'm5', title: 'Reach Green Score 50', target: 50, current: 0, rewardMoney: 2000, rewardXP: 100, rewardGreen: 15, completed: false, claimed: false }
];

export const defaultAchievements = [
  { id: 'a1', title: 'Waste Warrior', description: 'Collect 1,000 kg waste', icon: '🏆', target: 1000, current: 0, rewardMoney: 2500, rewardXP: 150, unlocked: false },
  { id: 'a2', title: 'Master Recycler', description: 'Recycle 500 kg waste', icon: '♻️', target: 500, current: 0, rewardMoney: 3000, rewardXP: 200, unlocked: false },
  { id: 'a3', title: 'Green Champion', description: 'Reach Green Score 80', icon: '🌱', target: 80, current: 0, rewardMoney: 5000, rewardXP: 300, unlocked: false },
  { id: 'a4', title: 'Waste Tycoon', description: 'Earn ₹50,000 profit', icon: '💰', target: 50000, current: 0, rewardMoney: 10000, rewardXP: 500, unlocked: false },
  { id: 'a5', title: 'Circular City Builder', description: 'Unlock City Level (Level 3)', icon: '🏙️', target: 3, current: 1, rewardMoney: 7500, rewardXP: 400, unlocked: false },
  { id: 'a6', title: 'Green Future', description: 'Unlock Green City (Level 5)', icon: '🌍', target: 5, current: 1, rewardMoney: 20000, rewardXP: 1000, unlocked: false }
];
