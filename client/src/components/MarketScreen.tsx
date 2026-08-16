import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { ShoppingCart, Coins, ArrowUpRight, Sparkles, DollarSign } from 'lucide-react';

export const MarketScreen: React.FC = () => {
  const { productInventory, sellProducts } = useGame();
  const [sellingKey, setSellingKey] = useState<string | null>(null);

  const products = [
    { key: 'compost', name: 'Compost', emoji: '🌱', price: 500 },
    { key: 'biogas', name: 'Biogas', emoji: '🔥', price: 700 },
    { key: 'plastic_granules', name: 'Plastic Granules', emoji: '♻️', price: 800 },
    { key: 'cardboard', name: 'Cardboard', emoji: '📦', price: 600 },
    { key: 'glass_bottles', name: 'Glass Bottles', emoji: '🍾', price: 650 },
    { key: 'metal_ingots', name: 'Metal Ingots', emoji: '🔩', price: 1000 },
    { key: 'recovered_metals', name: 'Recovered Metals', emoji: '⚙️', price: 1200 },
    { key: 'paver_blocks', name: 'Paver Blocks', emoji: '🧱', price: 900 },
    { key: 'aggregates', name: 'Aggregates', emoji: '🪨', price: 750 }
  ];

  let totalMarketVal = 0;
  products.forEach(p => {
    const qty = productInventory[p.key as keyof typeof productInventory] || 0;
    totalMarketVal += qty * p.price;
  });

  const handleSell = async (pKey: string, qty: number) => {
    setSellingKey(pKey);
    await sellProducts(pKey, qty, false);
    setSellingKey(null);
  };

  const handleSellAll = async () => {
    setSellingKey('all');
    await sellProducts(undefined, undefined, true);
    setSellingKey(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <ShoppingCart className="w-4 h-4" />
            <span>Circular Economy Marketplace</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sell Refined Eco-Products</h2>
          <p className="text-slate-300 text-sm">
            Monetize recycled materials to fund city upgrades and clean energy expansion.
          </p>
        </div>

        {/* Total Inventory Worth & Sell All Button */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-6">
          <div>
            <div className="text-xs text-slate-400 font-bold">Total Stock Value</div>
            <div className="text-xl font-extrabold text-amber-400">{formatCurrency(totalMarketVal)}</div>
          </div>

          <button
            onClick={handleSellAll}
            disabled={totalMarketVal <= 0 || sellingKey === 'all'}
            className="py-3 px-6 rounded-xl font-extrabold text-xs bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-400 hover:to-gold-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-1.5 disabled:opacity-50 transition-all active:scale-95"
          >
            <Coins className="w-4 h-4 fill-current" />
            <span>SELL ALL STOCK</span>
          </button>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => {
          const qty = productInventory[p.key as keyof typeof productInventory] || 0;
          const totalVal = qty * p.price;
          const isSelling = sellingKey === p.key;

          return (
            <div
              key={p.key}
              className="glass-card p-5 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                    {p.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{p.name}</h3>
                    <p className="text-xs text-amber-400 font-bold">Price: {formatCurrency(p.price)} / unit</p>
                  </div>
                </div>
              </div>

              {/* Quantity & Total Value */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-400 font-semibold">Stock Quantity</div>
                  <div className="text-white font-extrabold text-sm">{formatNumber(qty)} units</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 font-semibold">Estimated Worth</div>
                  <div className="text-amber-300 font-extrabold text-sm">{formatCurrency(totalVal)}</div>
                </div>
              </div>

              {/* Sell Button */}
              <button
                onClick={() => handleSell(p.key, qty)}
                disabled={qty <= 0 || isSelling}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-400 hover:to-gold-400 text-slate-950 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-98"
              >
                <Coins className="w-4 h-4 fill-current" />
                <span>{isSelling ? 'Selling...' : `SELL STOCK (${formatCurrency(totalVal)})`}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
