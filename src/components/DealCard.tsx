import React from 'react';
import { ShoppingBag, Check, Flame, Sparkles } from 'lucide-react';
import { DealBundle } from '../types';
import { useShop } from '../context/ShopContext';
import { db } from '../services/dbStore';

interface DealCardProps {
  deal: DealBundle;
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const { addToCart, showToast } = useShop();

  const handleAddDealToCart = () => {
    const productRepresentation = db.convertDealToProduct(deal);
    addToCart(productRepresentation, 1);
  };

  return (
    <div className="group relative flex flex-col rounded-3xl bg-surface-white border-2 border-brand-main/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-brand-primary/60 transition-all duration-300">
      
      {/* Top Header Badge & Image Container */}
      <div className="relative w-full aspect-16/10 bg-surface-muted overflow-hidden">
        <img
          src={deal.image}
          alt={deal.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Deal Number Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary text-white text-xs font-extrabold shadow-md">
          <Flame className="w-3.5 h-3.5 text-amber-300 fill-current" />
          <span>DEAL #{deal.dealNumber}</span>
        </div>

        {/* Savings Pill */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-brand-leaf text-white text-xs font-black shadow-md tracking-wide">
          SAVE RS. {deal.savings.toLocaleString()}
        </div>
      </div>

      {/* Deal Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between gap-4">
        
        <div>
          <h3 className="text-lg font-extrabold text-brand-dark group-hover:text-brand-primary transition-colors font-display line-clamp-1">
            {deal.title}
          </h3>
          <p className="text-xs text-brand-muted mt-1 line-clamp-1">
            {deal.description}
          </p>

          {/* Itemized list of included products with individual prices */}
          <div className="mt-4 p-3.5 rounded-2xl bg-surface-cream border border-brand-main/70 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-leaf">
              Included In This Deal:
            </div>
            <ul className="space-y-1.5 text-xs">
              {deal.items.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between text-brand-dark">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-brand-leaf shrink-0" />
                    <span>{item.name}</span>
                  </span>
                  <span className="text-brand-muted font-semibold tabular-nums text-[11px]">
                    Rs. {item.price.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing Block & Add To Cart Button */}
        <div className="pt-3 border-t border-brand-main/60 flex items-end justify-between gap-2">
          <div>
            <div className="text-[11px] text-brand-subtle line-through tabular-nums font-semibold">
              Original Total: Rs. {deal.originalTotal.toLocaleString()}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-extrabold text-brand-leaf">Deal Price:</span>
              <span className="text-xl sm:text-2xl font-black text-brand-primary tabular-nums font-display">
                Rs. {deal.dealPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddDealToCart}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
            aria-label={`Add Deal ${deal.dealNumber} to Cart`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add Deal</span>
          </button>
        </div>

      </div>

    </div>
  );
};
