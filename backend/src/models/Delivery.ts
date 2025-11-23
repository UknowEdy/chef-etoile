import mongoose, { Document, Schema, Types } from 'mongoose';

export type DeliveryStatus = 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'failed';

export interface IDelivery extends Document {
  userId: Types.ObjectId;
  livreurId?: Types.ObjectId;
  menuId: Types.ObjectId;
  date: Date;
  mealType: 'LUNCH' | 'DINNER';
  status: DeliveryStatus;
  confirmationNumber: string;
  qrCode: string;
  // Confirmation livraison
  deliveredAt?: Date;
  deliveryPhoto?: string;
  scannedAt?: Date;
  scannedBy?: Types.ObjectId;
  // Infos client au moment de la livraison
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  clientLocation?: {
    lat: number;
    lng: number;
  };
  // Ordre dans la tournée
  deliveryOrder?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliverySchema = new Schema<IDelivery>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    livreurId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    menuId: {
      type: Schema.Types.ObjectId,
      ref: 'WeeklyMenu',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    mealType: {
      type: String,
      enum: ['LUNCH', 'DINNER'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'delivered', 'failed'],
      default: 'pending'
    },
    confirmationNumber: {
      type: String,
      required: true,
      unique: true
    },
    qrCode: {
      type: String,
      required: true
    },
    deliveredAt: {
      type: Date
    },
    deliveryPhoto: {
      type: String
    },
    scannedAt: {
      type: Date
    },
    scannedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    clientName: {
      type: String,
      required: true
    },
    clientPhone: {
      type: String,
      required: true
    },
    clientAddress: {
      type: String,
      required: true
    },
    clientLocation: {
      lat: Number,
      lng: Number
    },
    deliveryOrder: {
      type: Number
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Index pour recherche rapide
DeliverySchema.index({ date: 1, mealType: 1 });
DeliverySchema.index({ userId: 1, date: -1 });
DeliverySchema.index({ livreurId: 1, date: 1, status: 1 });
DeliverySchema.index({ confirmationNumber: 1 });
DeliverySchema.index({ status: 1 });

// Générer numéro de confirmation unique
DeliverySchema.pre('save', async function(next) {
  if (!this.confirmationNumber) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.confirmationNumber = `CE${dateStr}${random}`;
  }
  if (!this.qrCode) {
    // Le QR code contient le numéro de confirmation
    this.qrCode = `CHEF-ETOILE:${this.confirmationNumber}`;
  }
  next();
});

export const Delivery = mongoose.model<IDelivery>('Delivery', DeliverySchema);
