export type ProductCategory = 
  | 'kebabs' 
  | 'nuggets' 
  | 'tender-pops' 
  | 'wings-bites' 
  | 'pizza-toppings' 
  | 'patties-boti' 
  | 'parathas' 
  | 'ready-to-cook' 
  | 'family-packs'
  | 'deals';

export interface CookingMethod {
  method: 'Deep Fry' | 'Pan Fry' | 'Air Fry' | 'Bake' | 'Grill';
  time: string;
  temperature?: string;
  instructions: string;
}

export interface NutritionalInfo {
  servingSize: string;
  calories: number;
  proteinG: number;
  totalFatG: number;
  carbsG: number;
  sodiumMg: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  tagline?: string;
  category: ProductCategory;
  categoryName: string;
  description: string;
  shortDescription: string;
  image: string;
  galleryImages: string[];
  price: number; // in PKR
  salePrice?: number;
  discountPercentage?: number;
  weightGrams: number;
  weightLabel: string; // e.g. "1000g | 43~45 Pieces"
  piecesCount: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewCount: number;
  ingredients: string[];
  nutritionalInfo: NutritionalInfo;
  cookingMethods: CookingMethod[];
  storageInstructions: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  isDeal?: boolean;
  dealItems?: { name: string; price: number }[];
  originalTotal?: number;
  savings?: number;
}

export interface DealItemComponent {
  name: string;
  price: number;
}

export interface DealBundle {
  id: string;
  dealNumber: number;
  title: string;
  slug: string;
  sku: string;
  items: DealItemComponent[];
  originalTotal: number;
  dealPrice: number;
  savings: number;
  image: string;
  description: string;
  badge?: string;
  stockQuantity: number;
}

export interface CategoryItem {
  id: ProductCategory;
  name: string;
  tagline: string;
  itemCount: number;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryAddress {
  fullName: string;
  phoneNumber: string; // e.g. 0300-1234567
  email: string;
  streetAddress: string;
  area: string;
  city: string;
  province: string;
  postalCode?: string;
  deliveryNotes?: string;
}

export type PaymentMethod = 'cod' | 'bank_transfer' | 'online_card' | 'jazzcash_easypaisa';

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Packed' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned';

export type PaymentStatus = 'Unpaid' | 'Paid' | 'Refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "MF-82914"
  customer: {
    id?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  shippingAddress: DeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode?: string;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingUpdates: {
    status: OrderStatus;
    timestamp: string;
    notes?: string;
  }[];
  createdAt: string;
  estimatedDeliveryDate: string;
}

export interface Coupon {
  id: string;
  code: string; // e.g. "FROZENFRESH10"
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number; // percentage (e.g. 15) or PKR amount (e.g. 200)
  minOrderAmount: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: 'customer' | 'admin';
  savedAddresses: DeliveryAddress[];
  wishlistProductIds: string[];
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  brandTagline: string;
  supportPhone: string;
  whatsappNumber: string;
  supportEmail: string;
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  supportedCities: {
    name: string;
    deliveryFee: number;
    estimatedHours: string;
  }[];
  bannerAnnouncement: string;
  isStoreOpen: boolean;
}
