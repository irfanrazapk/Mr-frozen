import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCategory } from '../types';

export const CategoryGrid: React.FC = () => {
  const { categories, setSelectedCategory, setCurrentView } = useShop();

  const handleSelectCategory = (catId: ProductCategory) => {
    setSelectedCategory(catId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 bg-surface-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
              Farm Fresh Variety
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-display">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('shop');
            }}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-primary hover:text-brand-secondary transition-colors cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="group flex flex-col items-center text-center p-4 rounded-2xl bg-surface-white border border-brand-main/70 hover:border-brand-leaf/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-brand-light/40 p-1 mb-3 group-hover:scale-105 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-brand-muted mt-0.5">
                {cat.itemCount} Varieties
              </p>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
