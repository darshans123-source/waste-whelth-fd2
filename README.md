<<<<<<< HEAD
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
=======
# ♻️ WASTE TO WEALTH
> **Turn Waste Into Wealth. Build a Greener Future.**

A complete, production-quality circular-economy casual simulation game built with React, TypeScript, Vite, Tailwind CSS, Node.js, Express, and SQLite.

---

## 🌟 Key Features

1. **Animated Splash & Auth Screen**:
   - Rotating recycling symbol & loading bar
   - Google OAuth 2.0 Integration + Demo Login fallback
   - Persistent session tokens and profile cards

2. **First-Time Manager Tutorial**:
   - 3-step interactive onboarding modal introducing collection, recycling, and market mechanics.

3. **Visual City Evolution Engine**:
   - 5 City Tiers: 🏡 **Village** → 🏘️ **Town** → 🏙️ **City** → 🌆 **Smart City** → 🌍 **Green City**
   - Evolving visual city landscape based on player XP, profits, and recycled waste.

4. **6 Collection Locations**:
   - Houses, Schools, Offices, Factories, Parks, and Construction Sites generating 7 waste types: Organic, Plastic, Paper, Glass, Metal, E-waste, and C&D Waste.

5. **Interactive Sorting Mini-Game**:
   - 7 recycling bins (Organic, Plastic, Paper, Glass, Metal, E-waste, Construction)
   - Real-time Web Audio API audio feedback (+10 XP & Green Score for correct, -5 XP for wrong bin)
   - Round report card with accuracy metrics.

6. **Logistics & Fleet Transport**:
   - Transport collected waste to processing plants with truck capacity upgrades (100 kg → 250 kg → 500 kg).

7. **7 Processing Facilities**:
   - Biogas Plant, Plastic Recycling Plant, Paper Mill, Glass Recycling, Metal Smelter, E-waste Facility, and C&D Recycling Plant.

8. **Dynamic Eco Marketplace**:
   - Sell 9 refined products (Compost, Biogas, Granules, Cardboard, Bottles, Metal Ingots, Recovered Metals, Paver Blocks, Aggregates).
   - "Sell All" button with floating coin animations (+₹) and synthesized sound effects.

9. **5 Upgrade Tech Trees**:
   - Truck Capacity, Automated Sorters, Plant Efficiency, Storage Silos, and Solar Energy.

10. **Daily Quests, Badges & Leaderboard**:
    - Daily mission claims, achievement trophies, global player rankings, and eco green score gauge.
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f

---

## 🚀 Quick Start Guide

<<<<<<< HEAD
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
=======
### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

### Installation

1. Install root, client, and server dependencies:
```bash
npm run install:all
```

2. Configure environment variables (Optional for Google OAuth):
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
<<<<<<< HEAD
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
=======

### Running the Application

To start both backend API server (`http://localhost:5000`) and Vite frontend (`http://localhost:5173`) concurrently:

>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
```bash
npm run dev
```

<<<<<<< HEAD
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
=======
Open your browser at **`http://localhost:5173`**.

---

## 🔑 Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and configure the **OAuth consent screen**.
3. Create **OAuth 2.0 Client IDs** for a Web Application.
4. Add `http://localhost:5173` to **Authorized JavaScript origins**.
5. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your `.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```
*Note: If OAuth keys are omitted, the game automatically operates in **Demo Mode**, allowing all game loops to be tested immediately.*

---

## 🗄️ Database Architecture

Uses **SQLite** (`better-sqlite3`) stored locally in `waste_to_wealth.db`.
- Automatic table creation on startup (`users`, `game_states`).
- Game progress is saved persistently across sessions, page refreshes, and logouts.

---

## ⚙️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, Web Audio API.
- **Backend**: Node.js, Express, TypeScript, SQLite, JWT, Google Auth Library.
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
