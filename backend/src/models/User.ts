import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  role: 'CLIENT' | 'ADMIN';
  defaultGPS?: {
    lat: number;
    lng: number;
  };
  allergies?: string;
  subscription?: {
    isActive: boolean;
    type: "COMPLET" | "DEJEUNER" | "DINER";
    startDate?: Date;
    endDate?: Date;
  };
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
        message: 'Format de téléphone invalide (ex: +228 91 20 90 85)'
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
    role: {
      type: String,
      enum: ['CLIENT', 'ADMIN'],
      default: 'CLIENT'
    },
    address: {
      type: String,
      required: [true, 'L\'adresse est requise'],
      trim: true
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
    subscription: {
      isActive: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        enum: ['COMPLET', 'DEJEUNER', 'DINER'],
        default: 'COMPLET'
      },
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      }
    }
  },
  {
    timestamps: true
  }
);

// Index pour recherche rapide
UserSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', UserSchema);
