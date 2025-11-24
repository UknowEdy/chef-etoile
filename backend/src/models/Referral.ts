import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  referrerId: mongoose.Types.ObjectId; // Reference to User (parrain)
  referredId: mongoose.Types.ObjectId; // Reference to User (filleul)
  referrerCode: string;
  status: 'PENDING' | 'ACTIVE' | 'USED'; // USED when bonus meals awarded
  bonusMealsEarned?: number; // 1 free meal when 5 friends subscribed
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'ID du parrain est requis'],
      index: true
    },
    referredId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'ID du filleul est requis'],
      index: true
    },
    referrerCode: {
      type: String,
      required: [true, 'Le code de parrainage est requis'],
      index: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'USED'],
      default: 'PENDING'
    },
    bonusMealsEarned: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

ReferralSchema.index({ referrerId: 1, status: 1 });
ReferralSchema.index({ createdAt: -1 });

export const Referral = mongoose.model<IReferral>('Referral', ReferralSchema);
