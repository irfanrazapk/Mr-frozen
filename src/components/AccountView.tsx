import React from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  Clock, 
  Truck, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/dbStore';
import { ProductCard } from './ProductCard';

export const AccountView: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    setCurrentView, 
    setTrackingQuery, 
    wishlist, 
    products 
  } = useShop();

  if (!currentUser) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-brand-dark">Please sign in to view your account</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Get orders associated with customer email or phone
  const allOrders = db.getOrders();
  const customerOrders = allOrders.filter(
    o => o.customer.email.toLowerCase() === currentUser.email.toLowerCase() ||
         o.customer.phoneNumber === currentUser.phoneNumber
  );

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleTrack = (orderNum: string) => {
    setTrackingQuery(orderNum);
    setCurrentView('order-tracking');
  };

  return (
    <div className="py-10 bg-surface-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Profile Card */}
        <div className="bg-surface-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary font-bold text-2xl font-display">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark font-display">
                  {currentUser.fullName}
                </h1>
                {currentUser.role === 'admin' && (
                  <span className="px-2 py-0.5 rounded-md bg-brand-primary text-white text-[10px] font-bold">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-muted mt-0.5">
                {currentUser.email} · {currentUser.phoneNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover cursor-pointer"
              >
                Go to Admin Dashboard
              </button>
            )}
            <button
              onClick={() => {
                logout();
                setCurrentView('home');
              }}
              className="px-4 py-2 rounded-xl border border-brand-main text-brand-muted hover:text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Content Grid: Orders & Wishlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Orders History (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-main">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-primary" />
                  <h3 className="text-base font-bold text-brand-dark font-display">
                    My Order History ({customerOrders.length})
                  </h3>
                </div>
              </div>

              {customerOrders.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-xs text-brand-muted">You haven't placed any orders yet.</p>
                  <button
                    onClick={() => setCurrentView('shop')}
                    className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
                  >
                    Start shopping Mr. Frozen fresh foods →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerOrders.map(order => (
                    <div 
                      key={order.id}
                      className="p-5 rounded-2xl bg-surface-cream border border-brand-main/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-sm text-brand-primary">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-brand-muted ml-2">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-brand-primary font-bold text-xs">
                          {order.orderStatus}
                        </span>
                      </div>

                      <div className="text-xs text-brand-dark space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-brand-muted">
                            <span>{it.quantity}x {it.productName}</span>
                            <span className="tabular-nums font-semibold text-brand-dark">PKR {it.totalPrice.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-brand-main flex items-center justify-between">
                        <div className="text-xs">
                          Total: <strong className="text-brand-dark tabular-nums">PKR {order.grandTotal.toLocaleString()}</strong> ({order.paymentMethod.replace('_', ' ')})
                        </div>
                        <button
                          onClick={() => handleTrack(order.orderNumber)}
                          className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover flex items-center gap-1 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Package</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Wishlist & Quick Address (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Wishlist Preview */}
            <div className="bg-surface-white rounded-3xl p-6 border border-brand-main shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-main">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-bold text-brand-dark font-display">
                    Wishlist ({wishlistProducts.length})
                  </h3>
                </div>
                <button
                  onClick={() => setCurrentView('wishlist')}
                  className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              {wishlistProducts.length === 0 ? (
                <p className="text-xs text-brand-muted italic">Your wishlist is currently empty.</p>
              ) : (
                <div className="space-y-3">
                  {wishlistProducts.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center gap-3 text-xs">
                      <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-brand-main shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-brand-dark truncate">{p.name}</div>
                        <div className="text-brand-leaf font-bold tabular-nums">
                          PKR {(p.salePrice || p.price).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reassurance Info */}
            <div className="bg-brand-light/30 rounded-3xl p-6 border border-brand-main space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-brand-primary">
                <ShieldCheck className="w-4 h-4 text-brand-leaf" />
                <span>Cold-Chain Protection</span>
              </div>
              <p className="text-brand-muted leading-relaxed">
                All Mr. Frozen orders are packed in thermally insulated boxes with sub-zero freezing gel packs.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
