import mongoose, { Document, Schema } from 'mongoose';

export enum PlanType {
  SIMPLE = 'SIMPLE',
  COMPLETE = 'COMPLETE'
}

export enum MealTime {
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  BOTH = 'BOTH'
}

export enum OrderStatus {
  PENDING = 'PENDING',           // En attente de paiement
  CONFIRMED = 'CONFIRMED',       // Payée, en préparation
  READY = 'READY',               // Client a cliqué "Je suis prêt"
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', // En livraison
  DELIVERED = 'DELIVERED',       // Livrée
  CANCELLED = 'CANCELLED'        // Annulée
}

export interface IGPSCoordinates {
  lat: number;
  lng: number;
  timestamp: Date;
}

export interface IOrder extends Document {
  orderId: string;
  userId: mongoose.Types.ObjectId;
  customerName: string;
  phone: string;
  address: string;
  plan: PlanType;
  mealPreference: MealTime;
  totalPrice: number;
  allergies?: string;
  status: OrderStatus;
  gps?: IGPSCoordinates;
  deliveryOrder?: number;  // Numéro dans la tournée (1, 2, 3...)
  distance?: number;        // Distance depuis la cuisine (km)
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false  // Optionnel pour permettre les commandes sans compte
    },
    customerName: {
      type: String,
      required: [true, 'Le nom du client est requis'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'L\'adresse de livraison est requise'],
      trim: true
    },
    plan: {
      type: String,
      enum: Object.values(PlanType),
      required: [true, 'Le type de formule est requis']
    },
    mealPreference: {
      type: String,
      enum: Object.values(MealTime),
      required: [true, 'La préférence de repas est requise']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Le prix total est requis'],
      min: [0, 'Le prix ne peut pas être négatif']
    },
    allergies: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING
    },
    gps: {
      lat: {
        type: Number,
        min: -90,
        max: 90
      },
      lng: {
        type: Number,
        min: -180,
        max: 180
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    },
    deliveryOrder: {
      type: Number,
      min: 0
    },
    distance: {
      type: Number,
      min: 0
    },
    estimatedDeliveryTime: {
      type: Date
    },
    actualDeliveryTime: {
      type: Date
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index pour recherche et tri rapides
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ deliveryOrder: 1 });
OrderSchema.index({ 'gps.lat': 1, 'gps.lng': 1 });

// Méthode pour vérifier si la commande a des coordonnées GPS valides
OrderSchema.methods.hasValidGPS = function(): boolean {
  return !!(
    this.gps &&
    typeof this.gps.lat === 'number' &&
    typeof this.gps.lng === 'number' &&
    this.gps.lat !== 0 &&
    this.gps.lng !== 0
  );
};

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
