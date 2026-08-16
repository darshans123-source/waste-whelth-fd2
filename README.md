# ♻️ Waste to Wealth
### *Turn Waste Into Wealth. Build a Greener Future.*

A production-quality circular-economy simulation casual game built with **React, Vite, TypeScript, Tailwind CSS, Node.js, Express, and SQLite/persistent storage**.

---

## 🌟 Core Gameplay Loop

```text
🗑️ COLLECT WASTE (6 City Sectors)
        ↓
♻️ SORT WASTE (7-Bin Segregation Mini-Game)
        ↓
🚛 TRANSPORT (Logistics Fleet to Plants)
        ↓
🏭 RECYCLE (7 Circular Industrial Plants)
        ↓
📦 CREATE PRODUCTS (Compost, Biogas, Granules, Cardboard, Ingots...)
        ↓
🛒 SELL PRODUCTS (Commodity Marketplace)
        ↓
💰 EARN MONEY (Net Operations & Profit)
        ↓
⬆️ BUY UPGRADES (Trucks, Sorting Tech, Plants, Warehouses, Solar)
        ↓
🏙️ UNLOCK NEW CITY TIERS (Village → Town → City → Smart City → Green City)
        ↓
🌱 BUILD A 100% CIRCULAR GREEN METROPOLIS
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or later recommended)
- **npm** (v9.0.0 or later)

### 2. Installation
Run the root automated installation command:
```bash
npm run install:all
```
*This installs dependencies for the root orchestrator, backend server, and frontend client.*

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` values:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=super_secret_waste_to_wealth_jwt_token_key_2026

# Google OAuth (Optional for Demo Mode, required for real Google Sign-In)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Database Path
DATABASE_FILE=./data/gamestate.json
```

### 4. Running Locally
Start both backend (Port 5000) and frontend (Port 5173) concurrently:
```bash
npm run dev
```

Visit: **`http://localhost:5173`** in your browser!

---

## 🔑 Google OAuth 2.0 Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** > **Credentials**.
4. Click **Create Credentials** > **OAuth client ID** > Select **Web application**.
5. Add Authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:5000`
6. Add Authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
7. Copy the **Client ID** and **Client Secret** into your `.env` file.
8. Restart the server. Google Sign-In will be active!

> *Note: If Google OAuth credentials are not provided, the game runs seamlessly with the **"Continue as Demo Manager"** button.*

---

## 🎮 Features Breakdown

1. **Animated Splash Screen**: Rotating recycling emblem, circular economy motto, and progressive loading sequence.
2. **Authentication**: Secure JWT token generation with Google OAuth and Demo Sandbox mode.
3. **Interactive City Visualizer**: Animated dynamic cityscape reflecting progress through 5 tiers:
   - 🏡 Village (Level 1)
   - 🏘️ Town (Level 2)
   - 🏙️ City (Level 3)
   - 🌆 Smart City (Level 4)
   - 🌍 Green City (Level 5)
4. **Waste Collection (6 Sectors)**:
   - 🏠 Houses: Organic, Plastic, Paper
   - 🏫 Schools: Paper, Plastic, Organic
   - 🏢 Offices: Paper, Plastic, E-waste
   - 🏭 Factories: Metal, Plastic, E-waste
   - 🌳 Parks: Organic, Paper
   - 🏗️ Construction: C&D Waste, Metal
5. **Interactive Sorting Mini-Game**:
   - 7 Color-Coded Segregation Bins (Organic, Plastic, Paper, Glass, Metal, E-waste, Construction).
   - Real-time feedback, accuracy percentages, XP bonuses, and Green Score adjustments.
6. **Logistics & Fleet Transport**:
   - Dispatch trucks with payload capacity validation and fuel costs (discounted by Solar Power).
7. **7 Circular Recycling Plants**:
   - Biogas & Compost Facility
   - Polymer Granulation Plant
   - Paper Pulping & Mill
   - Glass Smelting Plant
   - Metal Foundry
   - E-waste Refining Facility
   - C&D Debris Upcycling Unit
8. **Commodity Marketplace**:
   - Sell 9 finished goods with live market values, individual selling, and "Sell All" liquidation.
9. **Upgrade Workshop**:
   - Trucks (100kg → 250kg → 500kg)
   - Sorter Tech (Manual → Improved → Smart AI)
   - Plant Efficiency (75% → 85% → 95% yield)
   - Warehouse Storage (500kg → 1,200kg → 3,000kg)
   - Clean Solar Power Grid (-30% / -60% logistics costs, +10 / +25 Green Score)
10. **Daily Missions & Achievements**:
    - Daily operational objectives with claimable ₹ money, XP, and Green Score bonuses.
    - Badges with locked grayscale and golden unlocked accolades.
11. **Random Events System**:
    - 🎉 Festival Season (+50% waste generation)
    - 🌧️ Monsoon Downpour (-20% logistics efficiency)
    - ♻️ Circular Bonus Initiative (+30% XP and recycling yield)
    - 📈 Global Market Surge (+40% finished product selling prices)
12. **Audio System (Web Audio API)**:
    - Zero-dependency browser sound synthesizer for clicks, coins, truck engines, sorting chimes, recycling hums, level fanfares, and dynamic generative ambient synth chords.

---

## 🛡️ Security & Validations

- Anti-cheat server-side validations on money, capacity, payload limits, upgrade tiers, and conversion yields.
- Sanitized payloads and JWT authenticated endpoints.
- Zero client-side leakage of Google Client Secrets.

---

## 📜 License
MIT License • Built with pride for a sustainable circular future 🌱
