import { 
  Product, 
  CategoryItem, 
  Order, 
  Coupon, 
  ProductReview, 
  SiteSettings, 
  UserProfile 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_COUPONS, 
  INITIAL_SETTINGS, 
  INITIAL_REVIEWS 
} from '../data/seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'mf_products_v1',
  CATEGORIES: 'mf_categories_v1',
  ORDERS: 'mf_orders_v1',
  COUPONS: 'mf_coupons_v1',
  REVIEWS: 'mf_reviews_v1',
  SETTINGS: 'mf_settings_v1',
  USER: 'mf_current_user_v1',
  WISHLIST: 'mf_wishlist_v1',
  CART: 'mf_cart_v1',
};

// Seed default admin user
export const DEMO_ADMIN_USER: UserProfile = {
  id: 'usr-admin-01',
  email: 'admin@mrfrozen.pk',
  fullName: 'Mr. Frozen Admin',
  phoneNumber: '0300-1234567',
  role: 'admin',
  savedAddresses: [
    {
      fullName: 'Mr. Frozen HQ Store',
      phoneNumber: '0300-1234567',
      email: 'admin@mrfrozen.pk',
      streetAddress: 'Plot 42, Korangi Industrial Area Sector 24',
      area: 'Korangi',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '74900',
    }
  ],
  wishlistProductIds: [],
  createdAt: '2026-01-01T00:00:00Z',
};

// Seed demo sample orders
const DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'MF-78421',
    customer: {
      id: 'cust-1',
      fullName: 'Hamza Sheikh',
      email: 'hamza.sheikh@gmail.com',
      phoneNumber: '0321-4567890',
    },
    shippingAddress: {
      fullName: 'Hamza Sheikh',
      phoneNumber: '0321-4567890',
      email: 'hamza.sheikh@gmail.com',
      streetAddress: 'House 14-B, Street 7, Phase 5 DHA',
      area: 'DHA Phase 5',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75500',
      deliveryNotes: 'Please ring bell twice and leave in insulated bag.',
    },
    items: [
      {
        productId: 'prod-shami-chicken-01',
        productName: 'Premium Chicken Shami Kebab',
        sku: 'MF-CSK-750',
        unitPrice: 850,
        quantity: 2,
        totalPrice: 1700,
        image: INITIAL_PRODUCTS[0].image,
      },
      {
        productId: 'prod-nuggets-chicken-03',
        productName: 'Crispy Chicken Nuggets',
        sku: 'MF-NUG-800',
        unitPrice: 1190,
        quantity: 1,
        totalPrice: 1190,
        image: INITIAL_PRODUCTS[2].image,
      }
    ],
    subtotal: 2890,
    deliveryFee: 0,
    discountAmount: 289,
    couponCode: 'FROZENFRESH10',
    grandTotal: 2601,
    paymentMethod: 'cod',
    paymentStatus: 'Unpaid',
    orderStatus: 'Out for Delivery',
    trackingUpdates: [
      { status: 'Pending', timestamp: '2026-03-05T09:00:00Z', notes: 'Order placed via online store' },
      { status: 'Confirmed', timestamp: '2026-03-05T09:15:00Z', notes: 'Order verified by operations team' },
      { status: 'Packed', timestamp: '2026-03-05T10:30:00Z', notes: 'Packed into dry-ice cold insulated box' },
      { status: 'Out for Delivery', timestamp: '2026-03-05T11:45:00Z', notes: 'Rider dispatched with thermal cooling kit' },
    ],
    createdAt: '2026-03-05T09:00:00Z',
    estimatedDeliveryDate: '2026-03-05',
  },
  {
    id: 'ord-1002',
    orderNumber: 'MF-78422',
    customer: {
      id: 'cust-2',
      fullName: 'Zainab Ahmed',
      email: 'zainab.a@outlook.com',
      phoneNumber: '0333-8765432',
    },
    shippingAddress: {
      fullName: 'Zainab Ahmed',
      phoneNumber: '0333-8765432',
      email: 'zainab.a@outlook.com',
      streetAddress: 'Flat 402, Al-Razi Heights, Gulberg III',
      area: 'Gulberg III',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54000',
    },
    items: [
      {
        productId: 'prod-seekh-chicken-02',
        productName: 'Smoky Chicken Seekh Kebab',
        sku: 'MF-SEEKH-600',
        unitPrice: 990,
        quantity: 2,
        totalPrice: 1980,
        image: INITIAL_PRODUCTS[1].image,
      }
    ],
    subtotal: 1980,
    deliveryFee: 200,
    discountAmount: 0,
    grandTotal: 2180,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    trackingUpdates: [
      { status: 'Confirmed', timestamp: '2026-03-04T14:00:00Z' },
      { status: 'Shipped', timestamp: '2026-03-04T16:00:00Z' },
      { status: 'Delivered', timestamp: '2026-03-04T18:30:00Z', notes: 'Received by customer with signature' }
    ],
    createdAt: '2026-03-04T13:45:00Z',
    estimatedDeliveryDate: '2026-03-04',
  }
];

class DatabaseService {
  private get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  // Products
  getProducts(): Product[] {
    return this.get<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  saveProducts(products: Product[]): void {
    this.set(STORAGE_KEYS.PRODUCTS, products);
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id || p.slug === id);
  }

  updateProductStock(productId: string, quantityToDeduct: number): boolean {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) return false;
    
    if (products[index].stockQuantity < quantityToDeduct) {
      return false; // insufficient stock
    }

    products[index].stockQuantity -= quantityToDeduct;
    this.saveProducts(products);
    return true;
  }

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    this.saveProducts(products);
  }

  deleteProduct(productId: string): void {
    const products = this.getProducts().filter(p => p.id !== productId);
    this.saveProducts(products);
  }

  // Categories
  getCategories(): CategoryItem[] {
    return this.get<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  saveCategories(categories: CategoryItem[]): void {
    this.set(STORAGE_KEYS.CATEGORIES, categories);
  }

  // Orders
  getOrders(): Order[] {
    return this.get<Order[]>(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
  }

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.unshift(order);
    }
    this.set(STORAGE_KEYS.ORDERS, orders);
  }

  getOrderById(idOrNumber: string): Order | undefined {
    return this.getOrders().find(o => o.id === idOrNumber || o.orderNumber.toLowerCase() === idOrNumber.toLowerCase());
  }

  // Coupons
  getCoupons(): Coupon[] {
    return this.get<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }

  saveCoupons(coupons: Coupon[]): void {
    this.set(STORAGE_KEYS.COUPONS, coupons);
  }

  // Reviews
  getReviews(): ProductReview[] {
    return this.get<ProductReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  saveReview(review: ProductReview): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    this.set(STORAGE_KEYS.REVIEWS, reviews);
  }

  updateReviewStatus(id: string, isApproved: boolean): void {
    const reviews = this.getReviews();
    const found = reviews.find(r => r.id === id);
    if (found) {
      found.isApproved = isApproved;
      this.set(STORAGE_KEYS.REVIEWS, reviews);
    }
  }

  // Site Settings
  getSettings(): SiteSettings {
    return this.get<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  saveSettings(settings: SiteSettings): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  // Reset demo data
  resetToDemo(): void {
    this.set(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    this.set(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    this.set(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    this.set(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    this.set(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    this.set(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }
}

export const db = new DatabaseService();
