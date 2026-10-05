import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Snowflake,
  ShieldAlert
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/dbStore';
import { Order, OrderStatus } from '../types';

export const OrderTrackingView: React.FC = () => {
  const { trackingQuery, setTrackingQuery } = useShop();
  const [searchInput, setSearchInput] = useState(trackingQuery || 'MF-78421');
  const [foundOrder, setFoundOrder] = useState<Order | undefined>(() => {
    return db.getOrderById(trackingQuery || 'MF-78421');
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const order = db.getOrderById(searchInput.trim());
    setFoundOrder(order);
  };

  const steps: OrderStatus[] = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStepIndex = (status: OrderStatus) => {
    return steps.indexOf(status);
  };

  const currentStepIndex = foundOrder ? getStepIndex(foundOrder.orderStatus) : -1;

  return (
    <div className="py-12 bg-surface-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
            Cold-Chain Logistics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-display">
            Track Your Frozen Delivery
          </h1>
          <p className="text-xs text-brand-muted">
            Enter your 5-digit Order ID (e.g. MF-78421 or MF-78422) to monitor insulated shipment progress.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. MF-78421"
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-main bg-white text-brand-dark focus:outline-hidden focus:border-brand-primary"
            />
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>

        {/* Order Details Panel */}
        {foundOrder ? (
          <div className="bg-surface-white rounded-3xl p-6 sm:p-10 border border-brand-main shadow-xs space-y-8">
            
            {/* Top Bar Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-brand-main gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-brand-leaf tracking-wider">
                  Order Status
                </span>
                <h3 className="text-xl font-extrabold text-brand-dark">
                  #{foundOrder.orderNumber}
                </h3>
                <span className="text-xs text-brand-muted">
                  Placed on {new Date(foundOrder.createdAt).toLocaleDateString()} · Delivering to {foundOrder.shippingAddress.city}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-light text-brand-primary text-xs font-bold">
                  {foundOrder.orderStatus}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-0 relative">
                {steps.map((st, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={st} className="flex flex-col items-center text-center relative z-10 space-y-2">
                      <div 
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isDone 
                            ? 'bg-brand-primary text-white shadow-xs' 
                            : 'bg-surface-cream border border-brand-main text-brand-subtle'
                        } ${isCurrent ? 'ring-4 ring-brand-primary/20' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span className={`text-[11px] font-bold ${isDone ? 'text-brand-dark' : 'text-brand-subtle'}`}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reassurance Banner */}
            <div className="p-4 rounded-2xl bg-brand-light/40 border border-brand-main text-xs flex items-center gap-3">
              <Snowflake className="w-5 h-5 text-brand-leaf shrink-0" />
              <div className="text-brand-dark">
                <strong>Temperature Guarantee:</strong> Your items are packed with dry ice gel packs inside an insulated carton. Keep items frozen at -18°C immediately upon delivery.
              </div>
            </div>

            {/* Updates log */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                Tracking History
              </h4>
              <div className="space-y-2 text-xs">
                {foundOrder.trackingUpdates.map((u, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-cream border border-brand-main/60">
                    <Clock className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-brand-dark">
                        {u.status} — {new Date(u.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-brand-muted">{u.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-brand-main p-8 space-y-3">
            <ShieldAlert className="w-10 h-10 text-brand-leaf mx-auto" />
            <h3 className="text-base font-bold text-brand-dark">Order Not Found</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              We couldn't locate an order with number "{searchInput}". Try searching sample order <strong>MF-78421</strong> or <strong>MF-78422</strong>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
