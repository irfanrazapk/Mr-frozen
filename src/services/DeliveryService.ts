import { db } from './dbStore';

export interface DeliveryCalculationRequest {
  city: string;
  subtotal: number;
  totalWeightGrams?: number;
}

export interface DeliveryCalculationResult {
  city: string;
  deliveryFee: number;
  isFreeDelivery: boolean;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  estimatedDeliveryWindow: string;
}

class DeliveryService {
  calculate(req: DeliveryCalculationRequest): DeliveryCalculationResult {
    const settings = db.getSettings();
    const cityConfig = settings.supportedCities.find(
      c => c.name.toLowerCase() === req.city.trim().toLowerCase()
    );

    const baseFee = cityConfig ? cityConfig.deliveryFee : settings.defaultDeliveryFee;
    const estimatedWindow = cityConfig ? cityConfig.estimatedHours : '1-2 days (Insulated Cold-Chain)';

    const isFreeDelivery = req.subtotal >= settings.freeDeliveryThreshold;
    const finalFee = isFreeDelivery ? 0 : baseFee;
    const amountNeeded = Math.max(0, settings.freeDeliveryThreshold - req.subtotal);

    return {
      city: req.city,
      deliveryFee: finalFee,
      isFreeDelivery,
      freeDeliveryThreshold: settings.freeDeliveryThreshold,
      amountNeededForFreeDelivery: amountNeeded,
      estimatedDeliveryWindow: estimatedWindow,
    };
  }

  getSupportedCities() {
    return db.getSettings().supportedCities;
  }
}

export const deliveryService = new DeliveryService();
