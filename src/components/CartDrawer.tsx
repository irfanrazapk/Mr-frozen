import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { deliveryService } from '../services/DeliveryService';
import { couponService } from '../services/CouponService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onProceedToCheckout 
}) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    clearCart,
    appliedCoupon,
    setAppliedCoupon,
    selectedCity,
    siteSettings,
    showToast,
    setCurrentView
  } = useShop();

  const [couponInput, setCouponInput] = useState(appliedCoupon);

  if (!isOpen) return null;

  // Delivery calculation
  const deliveryCalc = deliveryService.calculate({
    city: selectedCity,
    subtotal: cartSubtotal,
  });

  // Coupon calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    const couponRes = couponService.validate(appliedCoupon, cartSubtotal);
    if (couponRes.isValid) {
      discountAmount = couponRes.discountAmount;
    }
  }

  const deliveryFee = appliedCoupon === 'FREESHIP' ? 0 : deliveryCalc.deliveryFee;
  const grandTotal = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = couponService.validate(couponInput, cartSubtotal);
    if (res.isValid) {
      setAppliedCoupon(couponInput.trim().toUpperCase());
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponInput('');
    showToast('Coupon removed', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-brand-main flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-primary" />
              <h2 className="text-base font-bold text-brand-dark font-display">
                Your Frozen Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-surface-cream cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-brand-light/50 px-5 py-3 border-b border-brand-main">
            {deliveryCalc.isFreeDelivery ? (
              <div className="flex items-center gap-2 text-xs font-bold text-brand-leaf">
                <Truck className="w-4 h-4" />
                <span>You unlocked FREE cold-chain delivery! ❄️</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-brand-dark font-semibold">
                  <span>Add PKR {deliveryCalc.amountNeededForFreeDelivery.toLocaleString()} for Free Delivery</span>
                  <span className="text-brand-leaf font-bold">
                    {Math.round((cartSubtotal / siteSettings.freeDeliveryThreshold) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-brand-main overflow-hidden">
                  <div 
                    className="h-full bg-brand-leaf transition-all duration-300"
                    style={{ width: `${Math.min(100, (cartSubtotal / siteSettings.freeDeliveryThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mx-auto text-brand-primary">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-brand-dark">Your cart is empty</h3>
                <p className="text-xs text-brand-muted max-w-xs mx-auto">
                  Stock up on delicious Shami Kebabs, crispy Nuggets, and gourmet Seekh Kebabs.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    setCurrentView('shop');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.product.salePrice || item.product.price;
                return (
                  <div 
                    key={item.product.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-surface-cream border border-brand-main/80"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-brand-main">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-brand-dark truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-brand-muted">
                        {item.product.weightLabel}
                      </div>
                      <div className="text-xs font-extrabold text-brand-dark tabular-nums mt-0.5">
                        PKR {itemPrice.toLocaleString()}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center border border-brand-main rounded-lg bg-white overflow-hidden shrink-0">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-xs font-bold hover:bg-brand-light text-brand-dark cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold tabular-nums text-brand-dark">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 text-xs font-bold hover:bg-brand-light text-brand-dark cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Calculations */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-brand-main bg-surface-white space-y-4">
              
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon (e.g. FROZENFRESH10)"
                    disabled={!!appliedCoupon}
                    className="w-full pl-3 pr-8 py-2 text-xs uppercase rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                  />
                  <Tag className="w-3.5 h-3.5 text-brand-muted absolute right-3 top-2.5" />
                </div>
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="px-3 py-2 text-xs font-bold rounded-xl bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-primary text-white hover:bg-brand-secondary cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-brand-muted">
                  <span>Subtotal</span>
                  <span className="font-bold text-brand-dark tabular-nums">
                    PKR {cartSubtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-leaf font-semibold">
                    <span>Discount ({appliedCoupon})</span>
                    <span className="tabular-nums">- PKR {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-brand-muted">
                  <span>Delivery ({selectedCity})</span>
                  <span className="font-bold text-brand-dark tabular-nums">
                    {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-brand-dark pt-2 border-t border-brand-main">
                  <span>Estimated Total</span>
                  <span className="text-base text-brand-primary tabular-nums font-display">
                    PKR {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
