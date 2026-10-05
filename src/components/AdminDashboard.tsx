import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Settings, 
  AlertTriangle, 
  Plus, 
  Check, 
  X, 
  Eye, 
  Printer, 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../services/dbStore';
import { Product, Order, OrderStatus, Coupon, ProductCategory, SiteSettings } from '../types';
import { brandImages } from '../assets/images';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    refreshProducts, 
    setCurrentView, 
    showToast,
    siteSettings,
    updateSettings,
    setSelectedOrder 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory' | 'coupons' | 'reviews' | 'settings'>('overview');
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  const [coupons, setCoupons] = useState<Coupon[]>(db.getCoupons());
  const [reviews, setReviews] = useState(db.getReviews());
  
  // Product creation / edit modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for new product
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('kebabs');
  const [prodPrice, setProdPrice] = useState(950);
  const [prodSalePrice, setProdSalePrice] = useState(850);
  const [prodStock, setProdStock] = useState(50);
  const [prodWeight, setProdWeight] = useState('750g • 18-20 Pcs');
  const [prodDescription, setProdDescription] = useState('');

  // Coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(1500);

  // Settings form
  const [editSettings, setEditSettings] = useState<SiteSettings>({ ...siteSettings });

  // Calculate metrics
  const totalSales = orders.reduce((s, o) => s + (o.orderStatus !== 'Cancelled' ? o.grandTotal : 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;
  const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.lowStockThreshold);

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: newStatus,
          trackingUpdates: [
            ...o.trackingUpdates,
            { status: newStatus, timestamp: new Date().toISOString(), notes: `Status updated by Admin to ${newStatus}` }
          ]
        };
      }
      return o;
    });

    const targetOrder = updated.find(o => o.id === orderId);
    if (targetOrder) {
      db.saveOrder(targetOrder);
      setOrders(updated);
      showToast(`Order #${targetOrder.orderNumber} updated to ${newStatus}`);
    }
  };

  const handleStockAdjust = (productId: string, adjustment: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const newStock = Math.max(0, prod.stockQuantity + adjustment);
    const updated: Product = { ...prod, stockQuantity: newStock };
    db.saveProduct(updated);
    refreshProducts();
    showToast(`Stock updated for ${prod.name} to ${newStock} packs`);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const newProd: Product = editingProduct ? {
      ...editingProduct,
      name: prodName.trim(),
      category: prodCategory,
      price: Number(prodPrice),
      salePrice: Number(prodSalePrice) || undefined,
      stockQuantity: Number(prodStock),
      weightLabel: prodWeight,
      description: prodDescription.trim() || editingProduct.description,
    } : {
      id: `prod-${Date.now()}`,
      slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: `MF-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      name: prodName.trim(),
      category: prodCategory,
      categoryName: prodCategory === 'kebabs' ? 'Shami & Seekh Kebabs' : 'Chicken Nuggets',
      description: prodDescription.trim() || 'Delicious frozen food crafted from prime cuts and natural herbs.',
      shortDescription: prodWeight,
      image: brandImages.products.chickenShamiKebab,
      galleryImages: [brandImages.products.chickenShamiKebab],
      price: Number(prodPrice),
      salePrice: Number(prodSalePrice) || undefined,
      weightGrams: 750,
      weightLabel: prodWeight,
      piecesCount: 20,
      stockQuantity: Number(prodStock),
      lowStockThreshold: 10,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      rating: 5.0,
      reviewCount: 0,
      ingredients: ['100% Prime Chicken', 'Spices', 'Salt'],
      nutritionalInfo: { servingSize: '40g', calories: 85, proteinG: 8, totalFatG: 3, carbsG: 5, sodiumMg: 200 },
      cookingMethods: [{ method: 'Pan Fry', time: '5 mins', instructions: 'Pan fry from frozen until golden' }],
      storageInstructions: 'Keep frozen at -18°C',
      tags: ['halal', 'fresh-frozen'],
      seoTitle: `${prodName} | Mr. Frozen`,
      seoDescription: prodDescription,
      createdAt: new Date().toISOString(),
    };

    db.saveProduct(newProd);
    refreshProducts();
    setShowProductModal(false);
    setEditingProduct(null);
    showToast('Product saved successfully!', 'success');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      db.deleteProduct(id);
      refreshProducts();
      showToast('Product deleted from catalog', 'info');
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const coupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponVal),
      minOrderAmount: Number(newCouponMin),
      expiryDate: '2026-12-31',
      usageLimit: 500,
      timesUsed: 0,
      isActive: true,
    };

    const updated = [coupon, ...coupons];
    db.saveCoupons(updated);
    setCoupons(updated);
    setNewCouponCode('');
    showToast(`Coupon ${coupon.code} created successfully!`, 'success');
  };

  const handleToggleCoupon = (id: string) => {
    const updated = coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    db.saveCoupons(updated);
    setCoupons(updated);
    showToast('Coupon status updated', 'info');
  };

  const handleToggleReview = (id: string, isApproved: boolean) => {
    db.updateReviewStatus(id, isApproved);
    setReviews(db.getReviews());
    showToast(`Review ${isApproved ? 'approved' : 'hidden'}`, 'info');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(editSettings);
    showToast('Store settings saved', 'success');
  };

  return (
    <div className="py-8 bg-surface-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-brand-main gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 rounded-xl bg-white border border-brand-main text-brand-dark hover:text-brand-primary cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
                Operations & Management
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-display">
                Mr. Frozen Admin Suite
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                db.resetToDemo();
                refreshProducts();
                setOrders(db.getOrders());
                setCoupons(db.getCoupons());
                setReviews(db.getReviews());
                showToast('Reset sample store data to initial demo state', 'info');
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-brand-main hover:bg-brand-light/50 text-brand-dark text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>

            <button
              onClick={() => {
                setEditingProduct(null);
                setProdName('');
                setProdPrice(950);
                setProdSalePrice(850);
                setProdStock(50);
                setShowProductModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-brand-main pb-4 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'inventory', label: `Inventory & Alerts (${lowStockProducts.length})`, icon: AlertTriangle },
            { id: 'coupons', label: 'Discounts & Coupons', icon: Tag },
            { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'bg-white text-brand-muted hover:text-brand-dark border border-brand-main/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-white border border-brand-main shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-brand-muted">
                  <span>Total Gross Revenue</span>
                  <DollarSign className="w-4 h-4 text-brand-leaf" />
                </div>
                <div className="text-2xl font-extrabold text-brand-dark tabular-nums font-display">
                  PKR {totalSales.toLocaleString()}
                </div>
                <div className="text-[11px] text-brand-leaf font-bold">
                  +18.4% from last month
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-brand-main shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-brand-muted">
                  <span>Pending Fulfillment</span>
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-extrabold text-brand-dark tabular-nums font-display">
                  {pendingOrders}
                </div>
                <div className="text-[11px] text-amber-600 font-semibold">
                  Awaiting dispatch & thermal packing
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-brand-main shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-brand-muted">
                  <span>Completed Deliveries</span>
                  <Check className="w-4 h-4 text-brand-leaf" />
                </div>
                <div className="text-2xl font-extrabold text-brand-dark tabular-nums font-display">
                  {completedOrders}
                </div>
                <div className="text-[11px] text-brand-leaf font-semibold">
                  100% cold-chain success rate
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-brand-main shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-brand-muted">
                  <span>Low Stock Warnings</span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl font-extrabold text-brand-dark tabular-nums font-display">
                  {lowStockProducts.length} Products
                </div>
                <div className="text-[11px] text-red-600 font-semibold">
                  Requires batch restock soon
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-brand-dark font-display">
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-brand-primary hover:text-brand-secondary cursor-pointer"
                >
                  View All Orders →
                </button>
              </div>

              <div className="divide-y divide-brand-main/60 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-brand-muted uppercase text-[10px] tracking-wider">
                      <th className="py-2.5">Order</th>
                      <th className="py-2.5">Customer</th>
                      <th className="py-2.5">City</th>
                      <th className="py-2.5">Items</th>
                      <th className="py-2.5">Total</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-main/60">
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-surface-cream/50 transition-colors">
                        <td className="py-3 font-bold text-brand-primary">{o.orderNumber}</td>
                        <td className="py-3 font-medium text-brand-dark">{o.customer.fullName}</td>
                        <td className="py-3 text-brand-muted">{o.shippingAddress.city}</td>
                        <td className="py-3 text-brand-muted">{o.items.length} items</td>
                        <td className="py-3 font-bold text-brand-dark tabular-nums">PKR {o.grandTotal.toLocaleString()}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-md bg-brand-light text-brand-primary font-bold text-[10px]">
                            {o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-brand-dark font-display">
              Orders Management
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-brand-muted uppercase text-[10px] tracking-wider border-b border-brand-main">
                    <th className="py-3">Order Number</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Customer & Contact</th>
                    <th className="py-3">Destination</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Current Status</th>
                    <th className="py-3">Action Status Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-main/60">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-surface-cream/50 transition-colors">
                      <td className="py-4 font-bold text-brand-primary font-mono">{o.orderNumber}</td>
                      <td className="py-4 text-brand-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <div className="font-bold text-brand-dark">{o.customer.fullName}</div>
                        <div className="text-[11px] text-brand-muted">{o.customer.phoneNumber}</div>
                      </td>
                      <td className="py-4 text-brand-muted">
                        <div>{o.shippingAddress.area}</div>
                        <div className="text-brand-dark font-semibold">{o.shippingAddress.city}</div>
                      </td>
                      <td className="py-4 font-bold text-brand-dark tabular-nums">
                        PKR {o.grandTotal.toLocaleString()}
                        <div className="text-[10px] text-brand-muted uppercase">{o.paymentMethod}</div>
                      </td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-full bg-brand-light text-brand-primary font-bold text-[11px]">
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-4">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 rounded-lg border border-brand-main bg-surface-cream text-brand-dark text-xs font-semibold cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed (Dry Ice)</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Products Management */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-dark font-display">
                Catalog & Products ({products.length})
              </h3>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProdName('');
                  setProdPrice(950);
                  setProdSalePrice(850);
                  setProdStock(50);
                  setShowProductModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-brand-muted uppercase text-[10px] tracking-wider border-b border-brand-main">
                    <th className="py-3">Product</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Pack Details</th>
                    <th className="py-3">Price (PKR)</th>
                    <th className="py-3">Stock Remaining</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-main/60">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-surface-cream/50 transition-colors">
                      <td className="py-3 flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-brand-main" />
                        <div>
                          <div className="font-bold text-brand-dark">{p.name}</div>
                          <div className="text-[11px] text-brand-muted">SKU: {p.sku}</div>
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-brand-leaf">{p.categoryName}</td>
                      <td className="py-3 text-brand-dark">{p.weightLabel}</td>
                      <td className="py-3 font-bold text-brand-dark tabular-nums">
                        PKR {(p.salePrice || p.price).toLocaleString()}
                        {p.salePrice && <span className="text-[10px] line-through text-brand-subtle ml-1">PKR {p.price}</span>}
                      </td>
                      <td className="py-3">
                        <span className={`font-bold tabular-nums ${p.stockQuantity <= p.lowStockThreshold ? 'text-red-600' : 'text-brand-dark'}`}>
                          {p.stockQuantity} packs
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProdName(p.name);
                            setProdCategory(p.category);
                            setProdPrice(p.price);
                            setProdSalePrice(p.salePrice || p.price);
                            setProdStock(p.stockQuantity);
                            setProdWeight(p.weightLabel);
                            setProdDescription(p.description);
                            setShowProductModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-surface-cream hover:bg-brand-light text-brand-primary font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 cursor-pointer"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Inventory & Alerts */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-brand-dark font-display">
              Inventory Controls & Rapid Restock
            </h3>

            <div className="space-y-4">
              {products.map(p => (
                <div key={p.id} className="p-4 rounded-2xl bg-surface-cream border border-brand-main flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-brand-main" />
                    <div>
                      <h4 className="text-xs font-bold text-brand-dark">{p.name}</h4>
                      <div className="text-[11px] text-brand-muted">{p.weightLabel} · SKU: {p.sku}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-brand-muted">Current Stock:</div>
                      <div className={`text-sm font-extrabold tabular-nums ${p.stockQuantity <= p.lowStockThreshold ? 'text-red-600' : 'text-brand-dark'}`}>
                        {p.stockQuantity} Packs Available
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStockAdjust(p.id, -5)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-brand-main text-xs font-bold hover:bg-brand-light cursor-pointer"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleStockAdjust(p.id, 10)}
                        className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover cursor-pointer"
                      >
                        +10 Packs
                      </button>
                      <button
                        onClick={() => handleStockAdjust(p.id, 25)}
                        className="px-3 py-1.5 rounded-lg bg-brand-leaf text-white text-xs font-bold hover:bg-brand-leaf-hover cursor-pointer"
                      >
                        +25 Packs
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Coupons */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Create Coupon */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs space-y-4">
              <h3 className="text-base font-bold text-brand-dark font-display">
                Create Promo Coupon
              </h3>
              <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-brand-dark">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. RAMADAN15"
                    className="w-full px-3 py-2 uppercase rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-brand-dark">Discount Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed PKR</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-brand-dark">Discount Value *</label>
                    <input
                      type="number"
                      required
                      value={newCouponVal}
                      onChange={(e) => setNewCouponVal(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-brand-dark">Minimum Order (PKR)</label>
                  <input
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-primary text-white font-bold cursor-pointer hover:bg-brand-primary-hover"
                >
                  Publish Coupon
                </button>
              </form>
            </div>

            {/* Existing Coupons */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs space-y-4">
              <h3 className="text-base font-bold text-brand-dark font-display">
                Active Promotional Codes
              </h3>
              <div className="space-y-3">
                {coupons.map(cp => (
                  <div key={cp.id} className="p-4 rounded-2xl bg-surface-cream border border-brand-main flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm text-brand-primary">{cp.code}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${cp.isActive ? 'bg-brand-light text-brand-primary' : 'bg-red-100 text-red-700'}`}>
                          {cp.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <div className="text-brand-muted mt-0.5">
                        {cp.discountType === 'percentage' ? `${cp.discountValue}% Off` : `PKR ${cp.discountValue} Off`} · Min order: PKR {cp.minOrderAmount.toLocaleString()} · Used: {cp.timesUsed} times
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleCoupon(cp.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        cp.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-brand-light text-brand-primary hover:bg-brand-leaf/20'
                      }`}
                    >
                      {cp.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Reviews Moderation */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-brand-dark font-display">
              Customer Reviews Moderation
            </h3>
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="p-4 rounded-2xl bg-surface-cream border border-brand-main flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-dark">{r.customerName}</span>
                      <span className="text-brand-leaf font-semibold">on {r.productName}</span>
                      <span className="text-amber-500 font-bold">★ {r.rating}/5</span>
                    </div>
                    <h5 className="font-bold text-brand-dark">{r.title}</h5>
                    <p className="text-brand-muted italic">"{r.comment}"</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleReview(r.id, !r.isApproved)}
                      className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                        r.isApproved ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-brand-light text-brand-primary hover:bg-brand-light/80'
                      }`}
                    >
                      {r.isApproved ? 'Hide Review' : 'Approve Review'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs space-y-6 max-w-2xl">
            <h3 className="text-lg font-bold text-brand-dark font-display">
              Site Settings & Delivery Rules
            </h3>
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-brand-dark">Brand Announcement Banner</label>
                <input
                  type="text"
                  value={editSettings.bannerAnnouncement}
                  onChange={(e) => setEditSettings({ ...editSettings, bannerAnnouncement: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-brand-dark">Free Delivery Threshold (PKR)</label>
                  <input
                    type="number"
                    value={editSettings.freeDeliveryThreshold}
                    onChange={(e) => setEditSettings({ ...editSettings, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-brand-dark">Standard Delivery Fee (PKR)</label>
                  <input
                    type="number"
                    value={editSettings.defaultDeliveryFee}
                    onChange={(e) => setEditSettings({ ...editSettings, defaultDeliveryFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-brand-dark">Customer Support Phone</label>
                  <input
                    type="text"
                    value={editSettings.supportPhone}
                    onChange={(e) => setEditSettings({ ...editSettings, supportPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-brand-dark">Official WhatsApp Number</label>
                  <input
                    type="text"
                    value={editSettings.whatsappNumber}
                    onChange={(e) => setEditSettings({ ...editSettings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-brand-primary text-white font-bold cursor-pointer hover:bg-brand-primary-hover shadow-xs"
              >
                Save All Store Settings
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-main">
              <h3 className="text-base font-bold text-brand-dark font-display">
                {editingProduct ? 'Edit Frozen Product' : 'Add New Frozen Product'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-brand-muted hover:text-brand-dark cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-brand-dark">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Chicken Seekh Kebab"
                  className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-brand-dark">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                  >
                    <option value="kebabs">Shami & Seekh Kebabs</option>
                    <option value="nuggets">Chicken Nuggets</option>
                    <option value="tender-pops">Tender Pops & Bites</option>
                    <option value="parathas">Crispy Parathas</option>
                    <option value="family-packs">Family Packs</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-brand-dark">Pack Weight / Pieces</label>
                  <input
                    type="text"
                    required
                    value={prodWeight}
                    onChange={(e) => setProdWeight(e.target.value)}
                    placeholder="750g • 18-20 Pcs"
                    className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-brand-dark">Regular Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-brand-dark">Sale Price (PKR)</label>
                  <input
                    type="number"
                    value={prodSalePrice}
                    onChange={(e) => setProdSalePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-brand-dark">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-dark">Short Description</label>
                <textarea
                  rows={2}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Ingredients, taste, cooking style..."
                  className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl border border-brand-main text-brand-muted hover:bg-surface-cream cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary-hover cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
