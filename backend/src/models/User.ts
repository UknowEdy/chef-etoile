import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'client' | 'admin' | 'livreur';

export interface ILocation {
  lat: number;
  lng: number;
  updatedAt: Date;
}

export interface ISubscription {
  isActive: boolean;
  plan: 'COMPLETE' | 'PARTIEL';
  mealPreference: 'LUNCH' | 'DINNER' | 'BOTH';
  startDate?: Date;
  endDate?: Date;
  paymentProof?: string;
  paymentVerified: boolean;
}

export interface IDietaryPreferences {
  isVegetarian: boolean;
  noFish: boolean;
  noMeat: boolean;
  noPork: boolean;
  noSpicy: boolean;
  otherRestrictions?: string;
}

export interface IUser extends Document {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  role: UserRole;
  address: string;
  location?: ILocation;
  readyToReceive: boolean;
  readyAt?: Date;
  // Préférences alimentaires
  allergies?: string;
  dietaryPreferences?: IDietaryPreferences;
  // Parrainage
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  freeMealsEarned: number;
  // Abonnement
  subscription?: ISubscription;
  // QR Code et confirmation
  qrCode?: string;
  confirmationNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Le nom complet est requis'],
      trim: true,
      minlength: [2, 'Le nom doit contenir au moins 2 caractères']
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis'],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      validate: {
        validator: function(v: string) {
          return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: 'Format d\'email invalide'
      }
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false // Ne pas inclure par défaut dans les requêtes
    },
    role: {
      type: String,
      enum: ['client', 'admin', 'livreur'],
      default: 'client'
    },
    address: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
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
      updatedAt: {
        type: Date,
        default: Date.now
      }
    },
    readyToReceive: {
      type: Boolean,
      default: false
    },
    readyAt: {
      type: Date
    },
    allergies: {
      type: String,
      trim: true
    },
    // Préférences alimentaires
    dietaryPreferences: {
      isVegetarian: {
        type: Boolean,
        default: false
      },
      noFish: {
        type: Boolean,
        default: false
      },
      noMeat: {
        type: Boolean,
        default: false
      },
      noPork: {
        type: Boolean,
        default: false
      },
      noSpicy: {
        type: Boolean,
        default: false
      },
      otherRestrictions: {
        type: String,
        trim: true
      }
    },
    // Parrainage
    referralCode: {
      type: String,
      unique: true,
      sparse: true
    },
    referredBy: {
      type: String,
      trim: true
    },
    referralCount: {
      type: Number,
      default: 0
    },
    freeMealsEarned: {
      type: Number,
      default: 0
    },
    // Abonnement
    subscription: {
      isActive: {
        type: Boolean,
        default: false
      },
      plan: {
        type: String,
        enum: ['COMPLETE', 'PARTIEL']
      },
      mealPreference: {
        type: String,
        enum: ['LUNCH', 'DINNER', 'BOTH']
      },
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      },
      paymentProof: {
        type: String
      },
      paymentVerified: {
        type: Boolean,
        default: false
      }
    },
    // QR Code et confirmation (générés quand abonnement activé)
    qrCode: {
      type: String,
      unique: true,
      sparse: true
    },
    confirmationNumber: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true
  }
);

// Generate unique referral code before saving
UserSchema.pre('save', async function(next) {
  if (!this.referralCode) {
    // Generate a unique 6-character code based on name and random string
    const namePart = this.fullName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.referralCode = `${namePart}${randomPart}`;
  }
  next();
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Index pour recherche rapide
UserSchema.index({ phone: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ readyToReceive: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ referralCode: 1 });
UserSchema.index({ 'subscription.isActive': 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
