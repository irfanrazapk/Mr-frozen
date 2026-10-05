import React from 'react';
import { Heart, Plus, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInWishlist, toggleWishlist, openProductDetails } = useShop();
  const isWished = isInWishlist(product.id);
  const activePrice = product.salePrice || product.price;
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-surface-white border border-brand-main/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      
      {/* Top Image Showcase */}
      <div 
        onClick={() => openProductDetails(product)}
        className="relative w-full aspect-4/3 bg-surface-muted overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
            isWished 
              ? 'bg-red-50 text-red-600' 
              : 'bg-white/80 text-brand-dark/70 hover:text-red-500 hover:bg-white'
          }`}
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-current text-red-600' : ''}`} />
        </button>

        {/* Discount Tag (Top Left) */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-brand-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            Save {product.discountPercentage}%
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-brand-dark text-white text-xs font-bold px-3 py-1.5 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Hover Pill */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-dark/90 text-white text-xs font-semibold backdrop-blur-sm shadow-md">
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between gap-3">
        
        {/* Unboxed Metadata (Category & Pack Details) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-brand-leaf">
              {product.categoryName}
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.weightLabel}</span>
          </div>

          <h3 
            onClick={() => openProductDetails(product)}
            className="text-base font-bold text-brand-dark group-hover:text-brand-primary transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
            {product.shortDescription || product.tagline}
          </p>
        </div>

        {/* Rating & Stock Health */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-main/50">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold text-brand-dark tabular-nums">{product.rating}</span>
            <span className="text-brand-subtle">({product.reviewCount})</span>
          </div>
          
          <div className="text-[11px] text-brand-leaf font-medium">
            {product.stockQuantity <= 10 ? (
              <span className="text-amber-600 font-semibold">Only {product.stockQuantity} left</span>
            ) : (
              <span>In Stock</span>
            )}
          </div>
        </div>

        {/* Bottom Price & Add To Cart Button */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-brand-dark tabular-nums font-display">
                PKR {activePrice.toLocaleString()}
              </span>
              {product.salePrice && product.salePrice < product.price && (
                <span className="text-xs text-brand-subtle line-through tabular-nums">
                  PKR {product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-brand-primary hover:bg-brand-primary-hover text-white active:scale-95'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  );
};
