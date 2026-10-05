import React from 'react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { HeroSection } from './HeroSection';
import { CategoryGrid } from './CategoryGrid';
import { ProductCard } from './ProductCard';
import { WhyChooseUs } from './WhyChooseUs';
import { PromoBanner } from './PromoBanner';
import { CustomerReviewsSection } from './CustomerReviewsSection';
import { useShop } from '../context/ShopContext';
import { brandImages } from '../assets/images';

export const HomeView: React.FC = () => {
  const { products, setCurrentView, setSelectedCategory } = useShop();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-0">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Shop by Category */}
      <CategoryGrid />

      {/* 3. Featured Ready-to-Cook Collection */}
      <section className="py-16 bg-surface-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
                Featured Selection
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-display">
                Ready to Cook Favorites
              </h2>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentView('shop');
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-secondary transition-colors cursor-pointer"
            >
              <span>Explore All {products.length} Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

        </div>
      </section>

      {/* 4. Why Choose Mr. Frozen */}
      <WhyChooseUs />

      {/* 5. Mid-Page Promo Banner */}
      <PromoBanner />

      {/* 6. Best Sellers Section */}
      <section className="py-16 bg-surface-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-leaf">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span>Most Popular</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-display">
                Best Selling Family Packs
              </h2>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('kebabs');
                setCurrentView('shop');
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-secondary transition-colors cursor-pointer"
            >
              <span>View Kebab Range</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

        </div>
      </section>

      {/* 7. Short Brand Story Callout */}
      <section className="py-16 bg-white border-y border-brand-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden border border-brand-main shadow-md">
                <img
                  src={brandImages.products.chickenShamiKebab}
                  alt="Authentic Mr. Frozen Shami Kebab"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
                Quality You Can Taste
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark font-display">
                Pure Chicken. Real Herbs. No Compromises.
              </h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                At Mr. Frozen, we hold the traditional Pakistani dining table sacred. We don't use mechanically separated poultry, textured soy fillers, or chemical preservatives. Every single kebab, nugget, and tender pop is prepared using prime meat, freshly minced herbs, and aromatic whole spices before being shock-frozen at -18°C.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('about')}
                  className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Read Our Full Story
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Customer Reviews & Testimonials */}
      <CustomerReviewsSection />

    </div>
  );
};
