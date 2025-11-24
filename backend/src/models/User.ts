import mongoose, { Document, Schema } from 'mongoose';

export enum UserType {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  DELIVERY = 'DELIVERY'
}

export interface IUser extends Document {
  fullName: string;
  phone: string;
  email?: string;
  password: string; // Plain text password
  address: string;
  userType: UserType;
  defaultGPS?: {
    lat: number;
    lng: number;
  };
  allergies?: string;
  dietaryPreferences?: string[]; // Vegetarian, no fish, etc.
  qrCodeId?: string; // Unique QR code identifier
  referralCode?: string; // Code unique de parrain
  referredByCode?: string; // Code du parrain qui a invité
  createdAt: Date;
  updatedAt: Date;
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
      trim: true,
      validate: {
        validator: function(v: string) {
          // Format Togo: +228 XX XX XX XX
          return /^\+228\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/.test(v);
        },
        message: 'Format de téléphone invalide (ex: +228 90 00 00 00)'
      }
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v: string) {
          return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: 'Format d\'email invalide'
      }
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis']
    },
    address: {
      type: String,
      required: [true, 'L\'adresse est requise'],
      trim: true
    },
    userType: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.CLIENT
    },
    defaultGPS: {
      lat: {
        type: Number,
        min: -90,
        max: 90
      },
      lng: {
        type: Number,
        min: -180,
        max: 180
      }
    },
    allergies: {
      type: String,
      trim: true
    },
    dietaryPreferences: {
      type: [String],
      default: []
    },
    qrCodeId: {
      type: String,
      unique: true,
      sparse: true
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true
    },
    referredByCode: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index pour recherche rapide
UserSchema.index({ phone: 1 });
UserSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', UserSchema);
