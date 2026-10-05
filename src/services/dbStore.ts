import { 
  Product, 
  CategoryItem, 
  Order, 
  Coupon, 
  ProductReview, 
  SiteSettings, 
  UserProfile,
  DealBundle
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_DEALS,
  INITIAL_CATEGORIES, 
  INITIAL_COUPONS, 
  INITIAL_SETTINGS, 
  INITIAL_REVIEWS 
} from '../data/seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'mf_products_v2',
  DEALS: 'mf_deals_v1',
  CATEGORIES: 'mf_categories_v2',
  ORDERS: 'mf_orders_v2',
  COUPONS: 'mf_coupons_v2',
  REVIEWS: 'mf_reviews_v2',
  SETTINGS: 'mf_settings_v2',
  USER: 'mf_current_user_v2',
  WISHLIST: 'mf_wishlist_v2',
  CART: 'mf_cart_v2',
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
        productId: 'prod-02',
        productName: 'Chicken Shami Kabab',
        sku: 'MF-CSK-648',
        unitPrice: 1100,
        quantity: 2,
        totalPrice: 2200,
        image: INITIAL_PRODUCTS[1].image,
      },
      {
        productId: 'prod-01',
        productName: 'Chicken Nuggets (1000g)',
        sku: 'MF-NUG-1000',
        unitPrice: 1300,
        quantity: 1,
        totalPrice: 1300,
        image: INITIAL_PRODUCTS[0].image,
      }
    ],
    subtotal: 3500,
    deliveryFee: 0,
    discountAmount: 350,
    couponCode: 'FROZENFRESH10',
    grandTotal: 3150,
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

  // Deals
  getDeals(): DealBundle[] {
    return this.get<DealBundle[]>(STORAGE_KEYS.DEALS, INITIAL_DEALS);
  }

  saveDeals(deals: DealBundle[]): void {
    this.set(STORAGE_KEYS.DEALS, deals);
  }

  getDealById(id: string): DealBundle | undefined {
    return this.getDeals().find(d => d.id === id || d.slug === id);
  }

  // Convert deal to a Product format so it can be added to the Cart cleanly
  convertDealToProduct(deal: DealBundle): Product {
    const itemNames = deal.items.map(i => `${i.name} (Rs. ${i.price})`).join(' + ');
    return {
      id: deal.id,
      slug: deal.slug,
      sku: deal.sku,
      name: `Deal #${deal.dealNumber}: ${deal.title}`,
      tagline: itemNames,
      category: 'deals',
      categoryName: 'Mega Deals',
      description: `${deal.description} Includes: ${itemNames}. Save Rs. ${deal.savings.toLocaleString()}!`,
      shortDescription: itemNames,
      image: deal.image,
      galleryImages: [deal.image],
      price: deal.originalTotal,
      salePrice: deal.dealPrice,
      discountPercentage: Math.round((deal.savings / deal.originalTotal) * 100),
      weightGrams: 2000,
      weightLabel: `3 Pack Combo • Save Rs. ${deal.savings}`,
      piecesCount: 3,
      stockQuantity: deal.stockQuantity,
      lowStockThreshold: 5,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      rating: 5.0,
      reviewCount: 18,
      ingredients: deal.items.map(i => i.name),
      nutritionalInfo: { servingSize: 'Combo Pack', calories: 450, proteinG: 40, totalFatG: 18, carbsG: 25, sodiumMg: 600 },
      cookingMethods: [
        { method: 'Air Fry', time: '8-12 mins', instructions: 'Cook items from frozen according to individual preference.' },
        { method: 'Pan Fry', time: '5-7 mins', instructions: 'Pan fry from frozen with minimal oil.' }
      ],
      storageInstructions: 'Keep frozen at -18°C.',
      tags: ['deal', 'bundle', 'savings', 'combo'],
      seoTitle: `${deal.title} - Deal #${deal.dealNumber} | Mr. Frozen`,
      seoDescription: `Order ${deal.title} for Rs. ${deal.dealPrice.toLocaleString()}. Save Rs. ${deal.savings.toLocaleString()}.`,
      createdAt: new Date().toISOString(),
      isDeal: true,
      dealItems: deal.items,
      originalTotal: deal.originalTotal,
      savings: deal.savings,
    };
  }

  // Products
  getProducts(): Product[] {
    return this.get<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  saveProducts(products: Product[]): void {
    this.set(STORAGE_KEYS.PRODUCTS, products);
  }

  getProductById(id: string): Product | undefined {
    const prods = this.getProducts();
    const foundProd = prods.find(p => p.id === id || p.slug === id);
    if (foundProd) return foundProd;

    // Check if it's a deal
    const deal = this.getDealById(id);
    if (deal) return this.convertDealToProduct(deal);

    return undefined;
  }

  updateProductStock(productId: string, quantityToDeduct: number): boolean {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index >= 0) {
      if (products[index].stockQuantity < quantityToDeduct) return false;
      products[index].stockQuantity -= quantityToDeduct;
      this.saveProducts(products);
      return true;
    }

    // Check deals
    const deals = this.getDeals();
    const dealIndex = deals.findIndex(d => d.id === productId);
    if (dealIndex >= 0) {
      if (deals[dealIndex].stockQuantity < quantityToDeduct) return false;
      deals[dealIndex].stockQuantity -= quantityToDeduct;
      this.saveDeals(deals);
      return true;
    }

    return false;
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
    this.set(STORAGE_KEYS.DEALS, INITIAL_DEALS);
    this.set(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    this.set(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    this.set(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    this.set(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    this.set(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }
}

export const db = new DatabaseService();
