import { db } from './dbStore';
import { Order, OrderStatus, DeliveryAddress, CartItem, PaymentMethod } from '../types';
import { deliveryService } from './DeliveryService';
import { couponService } from './CouponService';

export interface CreateOrderInput {
  customer: {
    id?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  shippingAddress: DeliveryAddress;
  items: CartItem[];
  couponCode?: string;
  paymentMethod: PaymentMethod;
}

class OrderService {
  createOrder(input: CreateOrderInput): { success: boolean; order?: Order; error?: string } {
    // 1. Validate Stock on server
    for (const item of input.items) {
      const product = db.getProductById(item.product.id);
      if (!product) {
        return { success: false, error: `Product ${item.product.name} is no longer available.` };
      }
      if (product.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${product.name}. Only ${product.stockQuantity} packs remaining.`
        };
      }
    }

    // 2. Calculate authoritative server-side prices (Never trust client prices)
    let subtotal = 0;
    const orderItems = input.items.map(item => {
      const liveProduct = db.getProductById(item.product.id)!;
      const unitPrice = liveProduct.salePrice || liveProduct.price;
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      return {
        productId: liveProduct.id,
        productName: liveProduct.name,
        sku: liveProduct.sku,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
        image: liveProduct.image,
      };
    });

    // 3. Calculate delivery fee
    const deliveryCalc = deliveryService.calculate({
      city: input.shippingAddress.city,
      subtotal,
    });
    let deliveryFee = deliveryCalc.deliveryFee;

    // 4. Validate coupon if provided
    let discountAmount = 0;
    if (input.couponCode) {
      const couponResult = couponService.validate(input.couponCode, subtotal);
      if (couponResult.isValid) {
        discountAmount = couponResult.discountAmount;
        if (couponResult.coupon?.discountType === 'free_shipping') {
          deliveryFee = 0;
        }
        couponService.recordUsage(input.couponCode);
      }
    }

    const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

    // 5. Deduct inventory
    for (const item of input.items) {
      db.updateProductStock(item.product.id, item.quantity);
    }

    // 6. Generate order
    const orderNumber = `MF-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customer: input.customer,
      shippingAddress: input.shippingAddress,
      items: orderItems,
      subtotal,
      deliveryFee,
      discountAmount,
      couponCode: input.couponCode,
      grandTotal,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === 'online_card' ? 'Paid' : 'Unpaid',
      orderStatus: 'Confirmed',
      trackingUpdates: [
        {
          status: 'Confirmed',
          timestamp: new Date().toISOString(),
          notes: 'Order confirmed and sent to cold-chain preparation department.'
        }
      ],
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    db.saveOrder(newOrder);

    return { success: true, order: newOrder };
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus, notes?: string): Order | undefined {
    const order = db.getOrderById(orderId);
    if (!order) return undefined;

    order.orderStatus = newStatus;
    order.trackingUpdates.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      notes: notes || `Status updated to ${newStatus}`,
    });

    db.saveOrder(order);
    return order;
  }
}

export const orderService = new OrderService();
