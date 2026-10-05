/**
 * MongoDB / Mongoose Schema Definitions for Production Vercel & MongoDB Deployment
 * 
 * These schemas can be directly imported into Next.js Route Handlers or Express controllers:
 * import mongoose, { Schema, model, models } from 'mongoose';
 */

export const ProductSchemaDefinition = {
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true, index: true },
  categoryName: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  image: { type: String, required: true },
  galleryImages: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  weightGrams: { type: Number, required: true },
  weightLabel: { type: String, required: true },
  piecesCount: { type: Number, required: true },
  stockQuantity: { type: Number, required: true, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  isFeatured: { type: Boolean, default: false, index: true },
  isBestSeller: { type: Boolean, default: false, index: true },
  isNewArrival: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  ingredients: [{ type: String }],
  nutritionalInfo: {
    servingSize: String,
    calories: Number,
    proteinG: Number,
    totalFatG: Number,
    carbsG: Number,
    sodiumMg: Number,
  },
  cookingMethods: [{
    method: String,
    time: String,
    temperature: String,
    instructions: String,
  }],
  storageInstructions: { type: String, default: 'Keep frozen at -18°C or below.' },
  tags: [{ type: String, index: true }],
  seoTitle: String,
  seoDescription: String,
  createdAt: { type: Date, default: Date.now },
};

export const OrderSchemaDefinition = {
  orderNumber: { type: String, required: true, unique: true, index: true },
  customer: {
    id: String,
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  shippingAddress: {
    fullName: String,
    phoneNumber: String,
    email: String,
    streetAddress: String,
    area: String,
    city: { type: String, required: true },
    province: String,
    postalCode: String,
    deliveryNotes: String,
  },
  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    sku: String,
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    image: String,
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true, default: 0 },
  discountAmount: { type: Number, default: 0 },
  couponCode: String,
  grandTotal: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['cod', 'bank_transfer', 'online_card', 'jazzcash_easypaisa'], 
    default: 'cod' 
  },
  paymentStatus: { type: String, enum: ['Unpaid', 'Paid', 'Refunded'], default: 'Unpaid' },
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Pending' 
  },
  trackingUpdates: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    notes: String,
  }],
  createdAt: { type: Date, default: Date.now },
  estimatedDeliveryDate: String,
};

export const CouponSchemaDefinition = {
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'fixed', 'free_shipping'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: Number,
  expiryDate: String,
  usageLimit: { type: Number, default: 100 },
  timesUsed: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
};

export const UserSchemaDefinition = {
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  savedAddresses: [Object],
  wishlistProductIds: [String],
  createdAt: { type: Date, default: Date.now },
};
