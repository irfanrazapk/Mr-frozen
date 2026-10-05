import React from 'react';
import { ArrowRight, Sparkles, Snowflake } from 'lucide-react';
import { brandImages } from '../assets/images';
import { useShop } from '../context/ShopContext';

export const PromoBanner: React.FC = () => {
  const { setCurrentView, setSelectedCategory } = useShop();

  return (
    <section className="py-12 bg-surface-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-brand-primary text-white shadow-xl">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-light text-xs font-semibold backdrop-blur-xs">
                <Snowflake className="w-3.5 h-3.5 text-brand-light" />
                <span>Special Promotion</span>
                <span>·</span>
                <span>Use code: FROZENFRESH10</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
                Freshness That Stays With You.
              </h2>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                Stock your freezer with family packs of Chicken Shami Kebabs and Crispy Nuggets. Fast same-day cold-chain insulated dispatch in Karachi, Lahore, and Islamabad.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setCurrentView('shop');
                  }}
                  className="px-6 py-3 rounded-xl bg-brand-leaf hover:bg-brand-leaf-hover text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Claim 10% Off Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-white/70">
                  Free cold delivery on orders over PKR 2,500
                </span>
              </div>
            </div>

            {/* Right Image Cutout */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <img
                  src={brandImages.products.chickenNuggets}
                  alt="Mr. Frozen Golden Chicken Nuggets"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
