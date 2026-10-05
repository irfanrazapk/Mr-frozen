import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ArrowLeft, 
  Flame, 
  Snowflake, 
  ShieldCheck, 
  Check, 
  Truck, 
  Clock, 
  Info,
  ChevronRight,
  Share2
} from 'lucide-react';
import { Product, ProductReview } from '../types';
import { useShop } from '../context/ShopContext';
import { db } from '../services/dbStore';
import { ProductCard } from './ProductCard';

interface ProductDetailsViewProps {
  product: Product;
  onBack: () => void;
  onOpenCheckout: () => void;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ 
  product, 
  onBack, 
  onOpenCheckout 
}) => {
  const { 
    addToCart, 
    isInWishlist, 
    toggleWishlist, 
    products, 
    showToast,
    currentUser 
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [activeTab, setActiveTab] = useState<'cooking' | 'nutrition' | 'ingredients' | 'reviews'>('cooking');
  
  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [customerName, setCustomerName] = useState(currentUser?.fullName || '');

  const isWished = isInWishlist(product.id);
  const activePrice = product.salePrice || product.price;
  const isOutOfStock = product.stockQuantity <= 0;

  const productReviews = db.getReviews().filter(r => r.productId === product.id && r.isApproved);
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onOpenCheckout();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) {
      showToast('Please provide a title and comment for your review.', 'error');
      return;
    }

    const review: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      customerName: customerName.trim() || 'Verified Customer',
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      isVerifiedBuyer: true,
      isApproved: true,
      createdAt: new Date().toISOString(),
    };

    db.saveReview(review);
    showToast('Thank you! Your verified review has been published.', 'success');
    setNewTitle('');
    setNewComment('');
  };

  return (
    <div className="py-8 bg-surface-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-6 text-xs text-brand-muted">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-bold text-brand-primary hover:text-brand-secondary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5">
            <span>Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{product.categoryName}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-brand-dark">{product.name}</span>
          </div>
        </div>

        {/* Contiguous Purchase Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-surface-white rounded-3xl p-6 sm:p-10 border border-brand-main shadow-xs">
          
          {/* Left Gallery (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Main Image Frame */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-surface-muted border border-brand-main/60">
              <img
                src={selectedImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {product.discountPercentage && product.discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-brand-primary text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                  Save {product.discountPercentage}%
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {[product.image, ...product.galleryImages].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-brand-main/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Details & Buy Module (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Weight unboxed metadata */}
              <div className="flex items-center gap-2 text-xs text-brand-muted">
                <span className="font-bold text-brand-leaf uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <span aria-hidden="true">·</span>
                <span>SKU: {product.sku}</span>
                <span aria-hidden="true">·</span>
                <span>{product.weightLabel}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-display">
                {product.name}
              </h1>

              {/* Tagline */}
              <p className="text-sm text-brand-muted leading-relaxed">
                {product.description}
              </p>

              {/* Ratings */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-300'}`} 
                    />
                  ))}
                  <span className="font-bold text-brand-dark tabular-nums ml-1">
                    {product.rating}
                  </span>
                </div>
                <span className="text-brand-subtle">·</span>
                <span className="text-brand-muted font-medium">
                  {productReviews.length} Verified Customer Reviews
                </span>
              </div>

              {/* Price Block */}
              <div className="p-4 rounded-2xl bg-brand-light/40 border border-brand-main flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-brand-muted uppercase">
                    Price per pack
                  </div>
                  <div className="flex items-baseline gap-3 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-brand-dark tabular-nums font-display">
                      PKR {activePrice.toLocaleString()}
                    </span>
                    {product.salePrice && product.salePrice < product.price && (
                      <span className="text-sm text-brand-subtle line-through tabular-nums">
                        PKR {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-brand-leaf">
                    {product.stockQuantity > 0 ? 'In Stock (Fresh Frozen)' : 'Out of Stock'}
                  </div>
                  <div className="text-[11px] text-brand-muted">
                    {product.stockQuantity} packs ready for delivery
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-brand-dark">Quantity:</span>
                  <div className="flex items-center border border-brand-main rounded-xl bg-surface-cream overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-brand-dark hover:bg-brand-light font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-xs font-bold tabular-nums text-brand-dark">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="px-3.5 py-2 text-brand-dark hover:bg-brand-light font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-brand-muted">
                    Total: <strong className="text-brand-dark tabular-nums">PKR {(activePrice * quantity).toLocaleString()}</strong>
                  </span>
                </div>

                {/* Primary CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="py-3.5 px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95 disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="py-3.5 px-6 rounded-xl bg-brand-leaf hover:bg-brand-leaf-hover text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95 disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    <span>Instant Checkout</span>
                  </button>
                </div>

                {/* Wishlist button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-brand-dark hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isWished ? 'fill-current text-red-600' : ''}`} />
                    <span>{isWished ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                    <Truck className="w-4 h-4 text-brand-leaf" />
                    <span>Insulated Cold-Chain Delivery</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Quick Guarantees Pill */}
            <div className="pt-4 border-t border-brand-main grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-brand-muted">
              <div>❄️ Keep at -18°C</div>
              <div>✨ 100% Halal Cuts</div>
              <div>⚡ 5-Min Cooking</div>
            </div>

          </div>

        </div>

        {/* Tabbed Content: Cooking Instructions, Nutrition, Ingredients, Reviews */}
        <div className="mt-12 bg-surface-white rounded-3xl p-6 sm:p-10 border border-brand-main shadow-xs">
          
          {/* Tabs Selector */}
          <div className="flex items-center gap-2 border-b border-brand-main pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('cooking')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'cooking' 
                  ? 'bg-brand-primary text-white shadow-xs' 
                  : 'text-brand-muted hover:text-brand-dark hover:bg-surface-cream'
              }`}
            >
              Cooking Instructions
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'nutrition' 
                  ? 'bg-brand-primary text-white shadow-xs' 
                  : 'text-brand-muted hover:text-brand-dark hover:bg-surface-cream'
              }`}
            >
              Nutritional Facts
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'ingredients' 
                  ? 'bg-brand-primary text-white shadow-xs' 
                  : 'text-brand-muted hover:text-brand-dark hover:bg-surface-cream'
              }`}
            >
              Ingredients & Storage
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'reviews' 
                  ? 'bg-brand-primary text-white shadow-xs' 
                  : 'text-brand-muted hover:text-brand-dark hover:bg-surface-cream'
              }`}
            >
              Customer Reviews ({productReviews.length})
            </button>
          </div>

          {/* Tab 1: Cooking Instructions */}
          {activeTab === 'cooking' && (
            <div className="py-6 space-y-6">
              <div className="text-xs text-brand-leaf font-bold uppercase tracking-wider">
                Directly From Freezer — No Thawing Needed
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.cookingMethods.map((cm, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-surface-cream border border-brand-main/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-brand-dark">{cm.method}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-brand-light text-brand-primary tabular-nums">
                        {cm.time}
                      </span>
                    </div>
                    {cm.temperature && (
                      <div className="text-xs text-brand-leaf font-medium">
                        Temp: {cm.temperature}
                      </div>
                    )}
                    <p className="text-xs text-brand-muted leading-relaxed">
                      {cm.instructions}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Important Chef Tip:</strong> For best crunch and tenderness, do not thaw before cooking. Place frozen food straight into hot oil or preheated air fryer.
                </span>
              </div>
            </div>
          )}

          {/* Tab 2: Nutrition Facts */}
          {activeTab === 'nutrition' && (
            <div className="py-6 space-y-4 max-w-xl">
              <div className="text-xs text-brand-leaf font-bold uppercase tracking-wider">
                Serving Size: {product.nutritionalInfo.servingSize}
              </div>
              <table className="w-full text-xs text-left border border-brand-main rounded-xl overflow-hidden">
                <tbody>
                  <tr className="border-b border-brand-main/60 bg-surface-cream">
                    <td className="p-3 font-bold text-brand-dark">Calories</td>
                    <td className="p-3 text-right font-bold text-brand-dark tabular-nums">{product.nutritionalInfo.calories} kcal</td>
                  </tr>
                  <tr className="border-b border-brand-main/60">
                    <td className="p-3 font-medium text-brand-dark">Protein</td>
                    <td className="p-3 text-right font-bold text-brand-primary tabular-nums">{product.nutritionalInfo.proteinG}g</td>
                  </tr>
                  <tr className="border-b border-brand-main/60 bg-surface-cream">
                    <td className="p-3 font-medium text-brand-dark">Total Fat</td>
                    <td className="p-3 text-right font-bold text-brand-dark tabular-nums">{product.nutritionalInfo.totalFatG}g</td>
                  </tr>
                  <tr className="border-b border-brand-main/60">
                    <td className="p-3 font-medium text-brand-dark">Total Carbohydrates</td>
                    <td className="p-3 text-right font-bold text-brand-dark tabular-nums">{product.nutritionalInfo.carbsG}g</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-brand-dark">Sodium</td>
                    <td className="p-3 text-right font-bold text-brand-dark tabular-nums">{product.nutritionalInfo.sodiumMg}mg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Ingredients & Storage */}
          {activeTab === 'ingredients' && (
            <div className="py-6 space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-brand-dark">Wholesome Natural Ingredients</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-muted">
                  {product.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-brand-leaf shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-surface-cream border border-brand-main space-y-1">
                <h5 className="text-xs font-bold text-brand-dark">Storage Guidelines:</h5>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {product.storageInstructions} Keep in the deepest drawer of your freezer at -18°C. Reseal zipper pouch tightly after opening.
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="py-6 space-y-8">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-brand-muted italic">No customer reviews yet. Be the first to share your experience!</p>
                ) : (
                  productReviews.map(r => (
                    <div key={r.id} className="p-4 rounded-xl bg-surface-cream border border-brand-main/70 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] text-brand-subtle">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h5 className="text-sm font-bold text-brand-dark">{r.title}</h5>
                      <p className="text-xs text-brand-muted leading-relaxed">{r.comment}</p>
                      <div className="text-[11px] text-brand-leaf font-semibold pt-1">
                        By {r.customerName} {r.isVerifiedBuyer && '(Verified Buyer)'}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-6 rounded-2xl bg-surface-cream border border-brand-main space-y-4 max-w-xl">
                <h4 className="text-sm font-bold text-brand-dark">Leave a Customer Review</h4>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-brand-dark">Your Rating:</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-dark">Your Name / City</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Maria Khan (Lahore)"
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-brand-main bg-white text-brand-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-dark">Review Headline</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Perfectly seasoned and super juicy!"
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-brand-main bg-white text-brand-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-dark">Your Experience</label>
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe how you cooked it, taste, crispiness, and family reaction..."
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-brand-main bg-white text-brand-dark"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Submit Verified Review
                </button>
              </form>

            </div>
          )}

        </div>

        {/* Related Products Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
                You May Also Like
              </div>
              <h3 className="text-2xl font-extrabold text-brand-dark font-display">
                Pairs Great With This Meal
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
