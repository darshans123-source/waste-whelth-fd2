import React from 'react';
import { ShoppingBag, TrendingUp, Coins, Sparkles, Zap } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ProductType } from '../../types/game';
import { PRODUCT_BASE_PRICES } from '../../../../server/src/services/defaultState';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const MarketScreen: React.FC = () => {
  const { gameState, sellProducts } = useGame();

  if (!gameState) return null;

  const isHighDemand = gameState.activeEvent?.type === 'high_demand';
  const priceMultiplier = isHighDemand ? (gameState.activeEvent?.multiplierMarketPrice || 1.4) : 1.0;

  const productsList: {
    type: ProductType;
    name: string;
    icon: string;
    desc: string;
  }[] = [
    { type: 'compost', name: 'Organic Compost', icon: '🌱', desc: 'Enriched organic fertilizer for agriculture' },
    { type: 'biogas', name: 'Biogas Fuel', icon: '🔥', desc: 'Renewable methane energy cylinders' },
    { type: 'plasticGranules', name: 'Plastic Granules', icon: '♻️', desc: 'Recycled raw pellets for manufacturing' },
    { type: 'cardboard', name: 'Packaging Cardboard', icon: '📦', desc: 'Heavy-duty recycled shipping boxes' },
    { type: 'glassBottles', name: 'Sterilized Glass Bottles', icon: '🍾', desc: 'Bottling & packaging containers' },
    { type: 'metalIngots', name: 'Refined Metal Ingots', icon: '🔩', desc: 'Structural foundry-grade alloy blocks' },
    { type: 'recoveredMetals', name: 'Recovered Precious Metals', icon: '⚙️', desc: 'High-value copper, silver, and gold' },
    { type: 'paverBlocks', name: 'Eco Paver Blocks', icon: '🧱', desc: 'Interlocking pavers made from C&D waste' },
    { type: 'aggregates', name: 'Construction Aggregates', icon: '🪨', desc: 'Recycled gravel and base stone' },
  ];

  const totalInventoryValue = productsList.reduce((sum, item) => {
    const qty = gameState.products[item.type] || 0;
    const unitPrice = Math.round((PRODUCT_BASE_PRICES[item.type] || 500) * priceMultiplier);
    return sum + qty * unitPrice;
  }, 0);

  const totalInventoryUnits = Object.values(gameState.products).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 select-none max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <h2 className="text-2xl font-black text-white">Commodity Marketplace</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Sell your recycled circular products to commercial buyers and city contractors.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="px-4 py-2 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Inventory Value</span>
            <span className="font-mono font-black text-base text-amber-300">
              ₹{totalInventoryValue.toLocaleString()}
            </span>
          </div>

          <Button
            variant="gold"
            size="md"
            onClick={() => sellProducts({ sellAll: true })}
            disabled={totalInventoryUnits <= 0}
            icon={<Coins className="w-4 h-4 text-slate-950" />}
          >
            SELL ALL INVENTORY
          </Button>
        </div>
      </div>

      {/* High Demand Event Banner */}
      {isHighDemand && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between gold-glow">
          <div className="flex items-center gap-2.5 font-bold">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Market Surge Active! All product prices increased by +40%</span>
          </div>
          <span className="font-mono font-black text-sm">1.4x Multiplier</span>
        </div>
      )}

      {/* 9 Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productsList.map((item) => {
          const qty = gameState.products[item.type] || 0;
          const unitPrice = Math.round((PRODUCT_BASE_PRICES[item.type] || 500) * priceMultiplier);
          const totalVal = qty * unitPrice;

          return (
            <Card key={item.type} className="flex flex-col justify-between space-y-4" hoverEffect>
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h3 className="font-black text-base text-white">{item.name}</h3>
                      <span className="text-[11px] font-mono font-bold text-amber-300">
                        ₹{unitPrice.toLocaleString()} / unit
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border ${
                      qty > 0
                        ? 'bg-eco-500/20 text-eco-300 border-eco-500/40'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {qty} in stock
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">{item.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-3 font-semibold text-slate-300">
                  <span>Batch Value:</span>
                  <span className="font-mono font-black text-sm text-amber-400">
                    ₹{totalVal.toLocaleString()}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => sellProducts({ productType: item.type })}
                  disabled={qty <= 0}
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  {qty > 0 ? `SELL ${qty} UNITS (₹${totalVal.toLocaleString()})` : 'Out of Stock'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
