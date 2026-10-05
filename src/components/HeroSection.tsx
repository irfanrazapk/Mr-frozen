import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { brandImages } from '../assets/images';
import { useShop } from '../context/ShopContext';

export const HeroSection: React.FC = () => {
  const { setCurrentView, setSelectedCategory } = useShop();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-light/40 via-surface-cream to-surface-cream pt-8 pb-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Editorial Category Tag */}
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary">
              <span className="w-2 h-2 rounded-full bg-brand-leaf animate-pulse" />
              <span>Premium Pakistani Frozen Foods</span>
              <span className="text-brand-subtle">·</span>
              <span>100% Pure Chicken & Beef</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-dark leading-[1.1] font-display">
              Good Food. <br />
              <span className="text-brand-primary">Frozen Fresh.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-brand-muted leading-relaxed max-w-xl">
              Delicious frozen foods made for convenient, wholesome meals your family will love. Crafted from farm-fresh chicken, aromatic spices, and blast-frozen at peak flavor with zero artificial preservatives.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentView('shop');
                }}
                className="px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('kebabs');
                  setCurrentView('shop');
                }}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-brand-light/60 text-brand-primary border border-brand-main text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Shami Kebabs</span>
              </button>
            </div>

            {/* Quality Checklist */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-brand-main/70 text-xs font-semibold text-brand-dark">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-leaf shrink-0" />
                <span>100% Natural</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-leaf shrink-0" />
                <span>High Protein</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-leaf shrink-0" />
                <span>Air-Fry Ready</span>
              </div>
            </div>

          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Backing decorative glow */}
              <div className="absolute -inset-4 bg-brand-leaf/10 rounded-3xl blur-2xl transform -rotate-2" />

              {/* Main Card Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-brand-main shadow-xl bg-surface-white">
                <img
                  src={brandImages.heroBanner}
                  alt="Mr. Frozen Pakistani Gourmet Platter"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 lg:h-[420px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Bottom Card Over Image */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-brand-main/60 shadow-lg flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-brand-leaf uppercase tracking-wider">
                      Chef's Special Selection
                    </div>
                    <div className="text-sm font-extrabold text-brand-dark">
                      Chicken Shami & Seekh Kebabs
                    </div>
                    <div className="text-xs text-brand-muted">
                      Pan-fry or Air Fry in 5 mins • Fresh Taste
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('kebabs');
                      setCurrentView('shop');
                    }}
                    className="px-3.5 py-2 rounded-lg bg-brand-primary text-white text-xs font-bold hover:bg-brand-secondary transition-colors cursor-pointer shrink-0"
                  >
                    Order Now
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
