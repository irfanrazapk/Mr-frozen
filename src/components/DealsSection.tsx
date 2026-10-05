import React from 'react';
import { Flame, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { db } from '../services/dbStore';
import { DealCard } from './DealCard';

interface DealsSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showViewAllButton?: boolean;
  onViewAllClick?: () => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({
  title = "Mr. Frozen Mega Deals",
  subtitle = "Handcrafted value bundles designed for family feasts. Save up to Rs. 701 on every combo!",
  limit,
  showViewAllButton = false,
  onViewAllClick,
}) => {
  const allDeals = db.getDeals();
  const deals = limit ? allDeals.slice(0, limit) : allDeals;

  return (
    <section id="deals-section" className="py-14 bg-gradient-to-b from-brand-light/30 via-surface-cream to-surface-cream border-b border-brand-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-leaf bg-brand-light px-3 py-1 rounded-full border border-brand-leaf/30">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>Limited Time Mega Bundles</span>
              <span className="text-brand-subtle">·</span>
              <span>Save Up To Rs. 701</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark font-display">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-brand-muted max-w-2xl">
              {subtitle}
            </p>
          </div>

          {showViewAllButton && onViewAllClick && (
            <button
              onClick={onViewAllClick}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-secondary transition-colors cursor-pointer self-start md:self-end"
            >
              <span>View All {allDeals.length} Deals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

      </div>
    </section>
  );
};
