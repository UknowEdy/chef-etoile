import mongoose, { Document, Schema } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum PaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY'  // Only Mobile Money allowed
}

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User
  subscriptionId: mongoose.Types.ObjectId; // Reference to Subscription
  amount: number;
  currency: string; // FCFA
  method: PaymentMethod;
  status: PaymentStatus;
  proofImage?: string; // Base64 or URL of payment proof
  transactionId?: string; // Mobile Money transaction ID
  verifiedAt?: Date;
  verifiedBy?: string; // Admin ID who verified
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'ID utilisateur est requis'],
      index: true
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: [true, 'L\'ID abonnement est requis'],
      index: true
    },
    amount: {
      type: Number,
      required: [true, 'Le montant est requis'],
      min: 0
    },
    currency: {
      type: String,
      default: 'FCFA'
    },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.MOBILE_MONEY
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING
    },
    proofImage: {
      type: String
    },
    transactionId: {
      type: String,
      trim: true
    },
    verifiedAt: {
      type: Date
    },
    verifiedBy: {
      type: String,
      trim: true
    },
    rejectionReason: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
