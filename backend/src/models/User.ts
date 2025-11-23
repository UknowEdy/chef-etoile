import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'client' | 'admin' | 'livreur';

export interface ILocation {
  lat: number;
  lng: number;
  updatedAt: Date;
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
  allergies?: string;
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
    }
  },
  {
    timestamps: true
  }
);

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

export const User = mongoose.model<IUser>('User', UserSchema);
