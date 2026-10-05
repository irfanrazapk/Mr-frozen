import React from 'react';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, products, setCurrentView, toggleWishlist, addToCart } = useShop();
  const wishedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="py-10 bg-surface-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-main">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
              Saved Favorites
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-display">
              My Wishlist ({wishedProducts.length})
            </h1>
          </div>

          <button
            onClick={() => setCurrentView('shop')}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-secondary cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Content */}
        {wishedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-brand-main p-8 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mx-auto text-brand-primary">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark">Your Wishlist is Empty</h3>
            <p className="text-xs text-brand-muted">
              Tap the heart icon on any Chicken Shami Kebab, Nuggets, or Seekh Kebab to save it for your next family dinner.
            </p>
            <button
              onClick={() => setCurrentView('shop')}
              className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all cursor-pointer"
            >
              Explore Ready-to-Cook Delicacies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
