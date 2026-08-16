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

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

### Installation

1. Install root, client, and server dependencies:
```bash
npm run install:all
```

2. Configure environment variables (Optional for Google OAuth):
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Running the Application

To start both backend API server (`http://localhost:5000`) and Vite frontend (`http://localhost:5173`) concurrently:

```bash
npm run dev
```

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
