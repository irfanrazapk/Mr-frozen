import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, UserProfile, ProductCategory, SiteSettings } from '../types';
import { db } from '../services/dbStore';
import { authService } from '../services/AuthService';
import { couponService } from '../services/CouponService';
import { deliveryService } from '../services/DeliveryService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

export type AppView = 
  | 'home' 
  | 'shop' 
  | 'product-details' 
  | 'categories' 
  | 'cart' 
  | 'checkout' 
  | 'order-success' 
  | 'order-tracking' 
  | 'wishlist' 
  | 'account' 
  | 'admin' 
  | 'about' 
  | 'contact' 
  | 'faq'
  | 'shipping-policy';

interface ShopContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  products: Product[];
  refreshProducts: () => void;
  categories: ReturnType<typeof db.getCategories>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  openProductDetails: (product: Product) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  logout: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  appliedCoupon: string;
  setAppliedCoupon: (code: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  siteSettings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  trackingQuery: string;
  setTrackingQuery: (num: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Karachi');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(db.getSettings());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [trackingQuery, setTrackingQuery] = useState<string>('');

  // Initial load
  useEffect(() => {
    setProducts(db.getProducts());
    setWishlist(authService.getWishlist());
    setCurrentUser(authService.getCurrentUser());

    try {
      const storedCart = localStorage.getItem('mf_cart_v1');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mf_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const refreshProducts = () => {
    setProducts(db.getProducts());
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const addToCart = (product: Product, quantity = 1) => {
    // Check available stock
    const currentStock = product.stockQuantity;
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    const existingQty = existingIndex >= 0 ? cart[existingIndex].quantity : 0;

    if (existingQty + quantity > currentStock) {
      showToast(`Cannot add more than ${currentStock} packs (stock limit)`, 'error');
      return;
    }

    setCart(prev => {
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prev, { product, quantity }];
      }
    });

    showToast(`Added ${quantity}x ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const prod = products.find(p => p.id === productId);
    if (prod && quantity > prod.stockQuantity) {
      showToast(`Only ${prod.stockQuantity} packs available in stock`, 'error');
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const updated = authService.toggleWishlist(productId);
    setWishlist([...updated]);
    const isAdded = updated.includes(productId);
    showToast(isAdded ? 'Added to your wishlist' : 'Removed from wishlist', 'info');
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  const updateSettings = (newSettings: SiteSettings) => {
    db.saveSettings(newSettings);
    setSiteSettings(newSettings);
    showToast('Store settings updated', 'success');
  };

  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        products,
        refreshProducts,
        categories: db.getCategories(),
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        selectedProduct,
        setSelectedProduct,
        openProductDetails,
        selectedOrder,
        setSelectedOrder,
        currentUser,
        setCurrentUser,
        logout,
        toasts,
        showToast,
        appliedCoupon,
        setAppliedCoupon,
        selectedCity,
        setSelectedCity,
        siteSettings,
        updateSettings,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        trackingQuery,
        setTrackingQuery,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
