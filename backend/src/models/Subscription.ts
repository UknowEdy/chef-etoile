import mongoose, { Document, Schema } from 'mongoose';

export enum SubscriptionPlanType {
  PARTIAL = 'PARTIAL',     // 5 repas/semaine = 7.500 FCFA
  COMPLETE = 'COMPLETE'    // 10 repas/semaine = 14.000 FCFA
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',      // En attente de vérification paiement
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED'
}

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User
  planType: SubscriptionPlanType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  pricePerWeek: number;
  mealsPerWeek: number;
  mealsRemaining?: number; // Nombre de repas restants cette semaine
  referralBonusMeals?: number; // Repas gratuits par parrainage
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'ID utilisateur est requis'],
      index: true
    },
    planType: {
      type: String,
      enum: Object.values(SubscriptionPlanType),
      required: [true, 'Le type de plan est requis']
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.PENDING
    },
    startDate: {
      type: Date,
      required: [true, 'La date de début est requise']
    },
    endDate: {
      type: Date,
      required: [true, 'La date de fin est requise']
    },
    pricePerWeek: {
      type: Number,
      required: [true, 'Le prix hebdomadaire est requis'],
      min: 0
    },
    mealsPerWeek: {
      type: Number,
      required: [true, 'Le nombre de repas est requis'],
      min: 1
    },
    mealsRemaining: {
      type: Number,
      default: function(this: ISubscription) {
        return this.mealsPerWeek;
      }
    },
    referralBonusMeals: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ startDate: -1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
