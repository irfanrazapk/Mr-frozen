import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Building2, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
  Lock,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PaymentMethod, DeliveryAddress } from '../types';
import { deliveryService } from '../services/DeliveryService';
import { couponService } from '../services/CouponService';
import { orderService } from '../services/OrderService';

interface CheckoutViewProps {
  onBack: () => void;
  onOrderSuccess: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onBack, onOrderSuccess }) => {
  const { 
    cart, 
    cartSubtotal, 
    clearCart, 
    appliedCoupon, 
    currentUser, 
    selectedCity, 
    setSelectedCity,
    siteSettings,
    showToast,
    setSelectedOrder 
  } = useShop();

  // Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState(selectedCity);
  const [province, setProvince] = useState('Sindh');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Delivery calculation
  const deliveryCalc = deliveryService.calculate({
    city,
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

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setSelectedCity(newCity);
    // Auto-detect province for major Pakistani cities
    if (['Karachi', 'Hyderabad', 'Sukkur'].includes(newCity)) {
      setProvince('Sindh');
    } else if (['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot'].includes(newCity)) {
      setProvince('Punjab');
    } else if (['Islamabad'].includes(newCity)) {
      setProvince('Federal Capital');
    } else if (['Peshawar'].includes(newCity)) {
      setProvince('KPK');
    } else if (['Quetta'].includes(newCity)) {
      setProvince('Balochistan');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (!fullName.trim() || !phoneNumber.trim() || !streetAddress.trim() || !area.trim()) {
      setErrorMessage('Please complete all required customer and delivery address fields.');
      return;
    }

    // Phone format basic check
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please provide a valid Pakistani mobile number (e.g. 0300 1234567).');
      return;
    }

    setIsSubmitting(true);

    const shippingAddress: DeliveryAddress = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim() || 'customer@mrfrozen.pk',
      streetAddress: streetAddress.trim(),
      area: area.trim(),
      city,
      province,
      postalCode: postalCode.trim(),
      deliveryNotes: deliveryNotes.trim(),
    };

    const result = orderService.createOrder({
      customer: {
        id: currentUser?.id,
        fullName: fullName.trim(),
        email: email.trim() || 'customer@mrfrozen.pk',
        phoneNumber: phoneNumber.trim(),
      },
      shippingAddress,
      items: cart,
      couponCode: appliedCoupon || undefined,
      paymentMethod,
    });

    setIsSubmitting(false);

    if (result.success && result.order) {
      clearCart();
      setSelectedOrder(result.order);
      showToast('Order confirmed! Cold-chain preparation has started.', 'success');
      onOrderSuccess();
    } else {
      setErrorMessage(result.error || 'Failed to place order. Please review your cart.');
    }
  };

  return (
    <div className="py-10 bg-surface-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form: Customer & Delivery Info (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-surface-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs space-y-6">
              
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
                  Step 1 of 2
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark font-display">
                  Delivery Details
                </h2>
                <p className="text-xs text-brand-muted mt-1">
                  We deliver in thermal temperature-controlled boxes directly to your doorstep.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                
                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Asad Mansoor"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-main bg-surface-cream text-brand-dark focus:outline-hidden focus:border-brand-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark">Pakistani Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-main bg-surface-cream text-brand-dark focus:outline-hidden focus:border-brand-primary"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark">Email Address (for order invoice & tracking)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-main bg-surface-cream text-brand-dark focus:outline-hidden focus:border-brand-primary"
                  />
                </div>

                {/* City & Province */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark">City *</label>
                    <select
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-main bg-surface-cream text-brand-dark focus:outline-hidden focus:border-brand-primary cursor-pointer"
                    >
                      {siteSettings.supportedCities.map(c => (
                        <option key={c.name} value={c.name}>
                          {c.name} — PKR {c.deliveryFee} ({c.estimatedHours})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark">Area / Neighborhood *</label>
                    <input
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. DHA Phase 6 / Gulberg / F-7"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-main bg-surface-cream text-brand-dark focus:outline-hidden focus:border-brand-primary"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark">Complete Street Address *</label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="House/Apartment #, Street/Lane, Block/Sector"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-main bg-surface-cream text-brand-dark focus:outline-hidden focus:border-brand-primary"
                  />
                </div>

                {/* Special Delivery Instructions */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Ring bell twice, deliver after 2 PM, nearest landmark..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-main bg-surface-cream text-brand-dark focus:outline-hidden focus:border-brand-primary"
                  />
                </div>

              </form>

            </div>

            {/* Payment Method Selector */}
            <div className="bg-surface-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
                  Step 2 of 2
                </div>
                <h3 className="text-xl font-extrabold text-brand-dark font-display">
                  Payment Method
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Cash on Delivery */}
                <label 
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod' 
                      ? 'border-brand-primary bg-brand-light/30' 
                      : 'border-brand-main hover:border-brand-leaf/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark">
                      <Banknote className="w-4 h-4 text-brand-primary" />
                      <span>Cash on Delivery</span>
                    </div>
                    <p className="text-[11px] text-brand-muted mt-0.5">
                      Pay cash upon inspecting the cold-chain safety seal.
                    </p>
                  </div>
                </label>

                {/* Direct Bank Transfer */}
                <label 
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer' 
                      ? 'border-brand-primary bg-brand-light/30' 
                      : 'border-brand-main hover:border-brand-leaf/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark">
                      <Building2 className="w-4 h-4 text-brand-primary" />
                      <span>Direct Bank Transfer</span>
                    </div>
                    <p className="text-[11px] text-brand-muted mt-0.5">
                      Meezan Bank Ltd account details provided at checkout.
                    </p>
                  </div>
                </label>

                {/* JazzCash / EasyPaisa */}
                <label 
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'jazzcash_easypaisa' 
                      ? 'border-brand-primary bg-brand-light/30' 
                      : 'border-brand-main hover:border-brand-leaf/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'jazzcash_easypaisa'}
                    onChange={() => setPaymentMethod('jazzcash_easypaisa')}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark">
                      <Smartphone className="w-4 h-4 text-brand-primary" />
                      <span>JazzCash / EasyPaisa</span>
                    </div>
                    <p className="text-[11px] text-brand-muted mt-0.5">
                      Merchant Till transfer with instant SMS receipt.
                    </p>
                  </div>
                </label>

                {/* Credit / Debit Card */}
                <label 
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'online_card' 
                      ? 'border-brand-primary bg-brand-light/30' 
                      : 'border-brand-main hover:border-brand-leaf/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'online_card'}
                    onChange={() => setPaymentMethod('online_card')}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark">
                      <CreditCard className="w-4 h-4 text-brand-primary" />
                      <span>Debit / Credit Card</span>
                    </div>
                    <p className="text-[11px] text-brand-muted mt-0.5">
                      Visa / MasterCard 3D Secure payment gateway.
                    </p>
                  </div>
                </label>

              </div>

            </div>

          </div>

          {/* Right Summary Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-surface-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs space-y-5">
              
              <h3 className="text-base font-bold text-brand-dark font-display">
                Order Review ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
              </h3>

              {/* Items List */}
              <div className="divide-y divide-brand-main/60 max-h-60 overflow-y-auto pr-1">
                {cart.map(item => {
                  const unitPrice = item.product.salePrice || item.product.price;
                  return (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={item.product.image} 
                          alt="" 
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-brand-main"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-brand-dark truncate">{item.product.name}</div>
                          <div className="text-[11px] text-brand-muted">Qty: {item.quantity} × PKR {unitPrice.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="font-bold text-brand-dark tabular-nums shrink-0">
                        PKR {(unitPrice * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fee Breakdown */}
              <div className="pt-3 border-t border-brand-main space-y-2 text-xs">
                <div className="flex justify-between text-brand-muted">
                  <span>Subtotal</span>
                  <span className="font-bold text-brand-dark tabular-nums">
                    PKR {cartSubtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-leaf font-semibold">
                    <span>Discount Coupon ({appliedCoupon})</span>
                    <span className="tabular-nums">- PKR {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-brand-muted">
                  <span>Cold-Chain Insulated Delivery ({city})</span>
                  <span className="font-bold text-brand-dark tabular-nums">
                    {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-brand-main flex justify-between items-baseline text-sm font-extrabold text-brand-dark">
                  <span>Total to Pay</span>
                  <span className="text-xl text-brand-primary tabular-nums font-display">
                    PKR {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'Securing Order...' : 'Confirm & Place Order'}</span>
              </button>

              <div className="text-[11px] text-brand-muted text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-leaf" />
                <span>100% Cold-Chain Safety & Temperature Integrity Guaranteed</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
