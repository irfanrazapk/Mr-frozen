import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  X, 
  Sparkles,
  ChevronDown,
  Flame,
  Tag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCategory, Product } from '../types';
import { ProductCard } from './ProductCard';
import { DealsSection } from './DealsSection';
import { DealCard } from './DealCard';
import { db } from '../services/dbStore';

export const ShopView: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setCurrentView
  } = useShop();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'best-selling' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const allDeals = db.getDeals();

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // In stock
      if (inStockOnly && p.stockQuantity <= 0) {
        return false;
      }
      // Price
      const activePrice = p.salePrice || p.price;
      if (activePrice > maxPrice) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCategory = p.categoryName.toLowerCase().includes(query);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'best-selling') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, inStockOnly, maxPrice, searchQuery, sortBy]);

  return (
    <div className="py-8 bg-surface-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* FIRST SHOW DEALS (As requested: "same as show in All products pages first show deals") */}
        <div className="rounded-3xl overflow-hidden shadow-xs border border-brand-main">
          <DealsSection 
            title="Featured Mega Deals"
            subtitle="Save up to Rs. 701 on our curated combo bundles. Free delivery on orders above Rs. 2,500!"
            limit={4}
            showViewAllButton={true}
            onViewAllClick={() => setCurrentView('deals')}
          />
        </div>

        {/* Page Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pt-4 gap-4 border-t border-brand-main">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
              Full Frozen Pantry
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-display">
              Individual Products ({filteredProducts.length})
            </h1>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-white border border-brand-main text-xs font-bold text-brand-dark flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-muted hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-brand-main bg-white text-brand-dark text-xs font-bold focus:outline-hidden focus:border-brand-primary cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="best-selling">Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filter + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-6 border border-brand-main shadow-xs space-y-6 sticky top-28">
            
            {/* Search filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                Search Catalog
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Shami, wings, seekh, nuggets..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                />
                <Search className="w-3.5 h-3.5 text-brand-muted absolute left-2.5 top-2.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-brand-muted hover:text-brand-dark"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Deals Quick Switcher */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Flame className="w-4 h-4 text-amber-600 fill-current" />
                <span>Save with Mega Deals</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                Browse our 8 discounted multi-pack bundles saving up to Rs. 701.
              </p>
              <button
                onClick={() => setCurrentView('deals')}
                className="w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
              >
                View 8 Mega Deals
              </button>
            </div>

            {/* Categories filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                Categories
              </label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-brand-primary text-white font-bold'
                      : 'text-brand-dark hover:bg-surface-cream'
                  }`}
                >
                  <span>All Products</span>
                  <span className="text-[11px] opacity-70">{products.length}</span>
                </button>

                {categories.map((cat) => {
                  const count = products.filter(p => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-brand-primary text-white font-bold'
                          : 'text-brand-dark hover:bg-surface-cream'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[11px] opacity-70">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2 pt-2 border-t border-brand-main">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-dark uppercase tracking-wider">Max Price</span>
                <span className="font-bold text-brand-primary tabular-nums">Rs. {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="900"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-brand-muted tabular-nums">
                <span>Rs. 900</span>
                <span>Rs. 2,500</span>
              </div>
            </div>

            {/* In stock toggle */}
            <div className="pt-2 border-t border-brand-main">
              <label className="flex items-center gap-2 text-xs font-semibold text-brand-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-md text-brand-primary accent-brand-primary"
                />
                <span>In Stock Items Only</span>
              </label>
            </div>

          </aside>

          {/* Product Grid Area (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Active search filter chips */}
            {(selectedCategory !== 'all' || searchQuery || inStockOnly) && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-brand-muted">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-brand-main font-semibold text-brand-primary">
                    <span>Category: {selectedCategory}</span>
                    <button onClick={() => setSelectedCategory('all')} className="cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-brand-main font-semibold text-brand-primary">
                    <span>"{searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')} className="cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-brand-main font-semibold text-brand-primary">
                    <span>In Stock Only</span>
                    <button onClick={() => setInStockOnly(false)} className="cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Product Cards */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-brand-main p-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center mx-auto text-brand-primary">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-brand-dark">No Products Found</h3>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Try adjusting your filters, price range, or searching for other items like "shami", "nuggets", "wings" or "seekh".
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setInStockOnly(false);
                    setMaxPrice(2500);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold cursor-pointer hover:bg-brand-primary-hover"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div 
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs" 
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white p-6 shadow-2xl space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-brand-main">
                <h3 className="text-base font-bold text-brand-dark">Filter Products</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="text-brand-muted cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-dark uppercase">Category</label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => { setSelectedCategory('all'); setMobileFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer ${selectedCategory === 'all' ? 'bg-brand-primary text-white font-bold' : 'text-brand-dark'}`}
                  >
                    All Products
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategory(c.id); setMobileFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer ${selectedCategory === c.id ? 'bg-brand-primary text-white font-bold' : 'text-brand-dark'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-brand-dark">
                  <span>Max Price:</span>
                  <span className="text-brand-primary">Rs. {maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="900"
                  max="2500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer"
                />
              </div>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-brand-primary text-white font-bold text-xs cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
