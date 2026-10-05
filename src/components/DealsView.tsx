import React from 'react';
import { ArrowLeft, Flame, Sparkles, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/dbStore';
import { DealCard } from './DealCard';

export const DealsView: React.FC = () => {
  const { setCurrentView } = useShop();
  const deals = db.getDeals();

  return (
    <div className="py-10 bg-surface-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-brand-main gap-4">
          <div>
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-leaf animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
                Exclusive Combos & Value Bundles
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark font-display mt-1">
              Mr. Frozen Mega Deals ({deals.length})
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs bg-white px-4 py-2.5 rounded-2xl border border-brand-main shadow-xs">
            <Truck className="w-4 h-4 text-brand-leaf" />
            <span className="text-brand-dark font-semibold">
              Free Delivery on orders above Rs. 2,500
            </span>
          </div>
        </div>

        {/* Value Reassurance Banner */}
        <div className="p-6 rounded-3xl bg-brand-primary text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-bold text-amber-300">
              <Flame className="w-4 h-4 fill-current" />
              <span>Direct-to-Freezer Savings</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-display">
              Save Up to Rs. 701 on Every Family Bundle!
            </h3>
            <p className="text-xs text-white/80 max-w-xl">
              Each deal includes 3 full-sized frozen packs (Nuggets, Kababs, Wings, Tenders, Pizza or Boti). All items blast-frozen at -18°C.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('all-deals-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-brand-leaf hover:bg-brand-leaf-hover text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Browse All 8 Deals
            </button>
          </div>
        </div>

        {/* Deals Grid */}
        <div id="all-deals-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

      </div>
    </div>
  );
};
