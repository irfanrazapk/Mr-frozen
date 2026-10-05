import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  Package, 
  Truck, 
  MapPin, 
  Calendar,
  Snowflake,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderSuccessView: React.FC = () => {
  const { selectedOrder, setCurrentView, setTrackingQuery } = useShop();

  if (!selectedOrder) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-brand-dark">No order selected</h2>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleTrack = () => {
    setTrackingQuery(selectedOrder.orderNumber);
    setCurrentView('order-tracking');
  };

  return (
    <div className="py-12 bg-surface-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Main Card */}
        <div className="bg-surface-white rounded-3xl p-6 sm:p-10 border border-brand-main shadow-md space-y-8">
          
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mx-auto text-brand-leaf">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
              Order Confirmed & Secured
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-display">
              Thank You For Your Order!
            </h1>

            <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto">
              We have received your order <strong className="text-brand-dark">#{selectedOrder.orderNumber}</strong>. Our cold-chain team is preparing your insulated frozen package.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-surface-cream border border-brand-main text-xs">
            <div>
              <span className="text-brand-muted block text-[11px]">Order Number</span>
              <strong className="text-brand-dark font-mono font-bold">{selectedOrder.orderNumber}</strong>
            </div>
            <div>
              <span className="text-brand-muted block text-[11px]">Estimated Delivery</span>
              <strong className="text-brand-dark">{selectedOrder.estimatedDeliveryDate}</strong>
            </div>
            <div>
              <span className="text-brand-muted block text-[11px]">Payment Method</span>
              <strong className="text-brand-dark uppercase text-[11px]">{selectedOrder.paymentMethod.replace('_', ' ')}</strong>
            </div>
            <div>
              <span className="text-brand-muted block text-[11px]">Total Amount</span>
              <strong className="text-brand-primary font-bold tabular-nums">PKR {selectedOrder.grandTotal.toLocaleString()}</strong>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-brand-dark font-display">
              Package Contents
            </h3>
            <div className="divide-y divide-brand-main/70 border border-brand-main/80 rounded-2xl overflow-hidden">
              {selectedOrder.items.map(item => (
                <div key={item.productId} className="p-3.5 flex items-center justify-between gap-4 text-xs bg-white">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-brand-main" />
                    <div>
                      <div className="font-bold text-brand-dark">{item.productName}</div>
                      <div className="text-[11px] text-brand-muted">Qty: {item.quantity} × PKR {item.unitPrice.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="font-bold text-brand-dark tabular-nums">
                    PKR {item.totalPrice.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address Confirmation */}
          <div className="p-4 rounded-2xl bg-surface-cream border border-brand-main text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-brand-dark">
              <MapPin className="w-4 h-4 text-brand-primary" />
              <span>Delivering To: {selectedOrder.shippingAddress.fullName}</span>
            </div>
            <p className="text-brand-muted pl-5">
              {selectedOrder.shippingAddress.streetAddress}, {selectedOrder.shippingAddress.area}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}
            </p>
            <p className="text-brand-muted pl-5">
              Phone: {selectedOrder.shippingAddress.phoneNumber}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleTrack}
              className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>Track Live Delivery Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white border border-brand-main hover:bg-brand-light/50 text-brand-dark text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-brand-primary" />
              <span>Print Invoice Receipt</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
