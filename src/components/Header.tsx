import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Truck, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { useShop, AppView } from '../context/ShopContext';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenCart }) => {
  const { 
    currentView, 
    setCurrentView, 
    cartCount, 
    wishlist, 
    currentUser, 
    siteSettings,
    searchQuery,
    setSearchQuery,
    setSelectedCategory
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navigateTo = (view: AppView, category?: string) => {
    if (category) {
      setSelectedCategory(category as any);
      setCurrentView('shop');
    } else {
      setCurrentView(view);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('shop');
      setShowSearchInput(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-white/95 backdrop-blur-md border-b border-brand-main shadow-xs transition-colors">
      {/* Top Announcement Bar */}
      {siteSettings.bannerAnnouncement && (
        <div className="bg-brand-primary text-white text-xs py-2 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
          <span>{siteSettings.bannerAnnouncement}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="text-left group cursor-pointer focus:outline-hidden"
              aria-label="Mr. Frozen Home"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white font-extrabold text-xl shadow-xs group-hover:bg-brand-secondary transition-colors">
                  MF
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-brand-primary group-hover:text-brand-secondary transition-colors font-display">
                    MR. FROZEN
                  </div>
                  <div className="text-[10px] tracking-widest uppercase font-semibold text-brand-leaf -mt-1">
                    Good Food • Frozen Fresh
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-brand-dark">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-brand-primary transition-colors cursor-pointer py-1 border-b-2 ${
                currentView === 'home' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-dark/80'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className={`hover:text-brand-primary transition-colors cursor-pointer py-1 border-b-2 ${
                currentView === 'shop' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-dark/80'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => navigateTo('shop', 'kebabs')}
              className="hover:text-brand-primary transition-colors cursor-pointer py-1 text-brand-dark/80"
            >
              Shami & Seekh
            </button>
            <button
              onClick={() => navigateTo('shop', 'nuggets')}
              className="hover:text-brand-primary transition-colors cursor-pointer py-1 text-brand-dark/80"
            >
              Nuggets & Pops
            </button>
            <button
              onClick={() => navigateTo('order-tracking')}
              className={`hover:text-brand-primary transition-colors cursor-pointer py-1 border-b-2 ${
                currentView === 'order-tracking' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-dark/80'
              }`}
            >
              Track Order
            </button>
            <button
              onClick={() => navigateTo('about')}
              className={`hover:text-brand-primary transition-colors cursor-pointer py-1 border-b-2 ${
                currentView === 'about' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-dark/80'
              }`}
            >
              Our Story
            </button>
          </nav>

          {/* Zone 3: Actions (Search, Wishlist, Account, Cart, Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Input or Toggle */}
            <div className="relative">
              {showSearchInput ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search kebabs, nuggets..."
                    autoFocus
                    className="w-44 sm:w-64 pl-3 pr-8 py-1.5 text-xs rounded-lg border border-brand-main bg-surface-cream text-brand-dark focus:outline-hidden focus:border-brand-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSearchInput(false)}
                    className="absolute right-2 text-brand-muted hover:text-brand-dark"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-brand-dark hover:text-brand-primary transition-colors rounded-lg hover:bg-brand-light/50 cursor-pointer"
                  aria-label="Search products"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist Link */}
            <button
              onClick={() => navigateTo('wishlist')}
              className="relative p-2 text-brand-dark hover:text-brand-primary transition-colors rounded-lg hover:bg-brand-light/50 cursor-pointer"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-leaf text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User / Account Button */}
            <button
              onClick={() => {
                if (currentUser) {
                  navigateTo(currentUser.role === 'admin' ? 'admin' : 'account');
                } else {
                  onOpenAuth();
                }
              }}
              className="p-2 text-brand-dark hover:text-brand-primary transition-colors rounded-lg hover:bg-brand-light/50 cursor-pointer flex items-center gap-1.5"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
              {currentUser && (
                <span className="hidden md:inline-block text-xs font-semibold text-brand-primary truncate max-w-[100px]">
                  {currentUser.role === 'admin' ? 'Admin' : currentUser.fullName.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-semibold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-[11px] tabular-nums font-bold">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-brand-dark hover:text-brand-primary cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-main bg-surface-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-150">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Mr. Frozen products..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-brand-main bg-surface-cream text-brand-dark"
              />
              <Search className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
            </div>
          </form>

          <div className="grid grid-cols-1 gap-1 text-sm font-semibold text-brand-dark">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-brand-light/40 text-left"
            >
              <span>Home</span>
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-brand-light/40 text-left"
            >
              <span>All Products</span>
            </button>
            <button
              onClick={() => navigateTo('shop', 'kebabs')}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-brand-light/40 text-left pl-6 text-brand-muted"
            >
              <span>Shami & Seekh Kebabs</span>
            </button>
            <button
              onClick={() => navigateTo('shop', 'nuggets')}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-brand-light/40 text-left pl-6 text-brand-muted"
            >
              <span>Chicken Nuggets</span>
            </button>
            <button
              onClick={() => navigateTo('shop', 'tender-pops')}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-brand-light/40 text-left pl-6 text-brand-muted"
            >
              <span>Tender Pops & Bites</span>
            </button>
            <button
              onClick={() => navigateTo('order-tracking')}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-brand-light/40 text-left"
            >
              <span>Track My Order</span>
            </button>
            <button
              onClick={() => navigateTo('about')}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-brand-light/40 text-left"
            >
              <span>Our Story & Quality</span>
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-brand-light/40 text-left"
            >
              <span>Contact & Wholesale</span>
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => navigateTo('admin')}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-brand-light text-brand-primary text-left font-bold"
              >
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
