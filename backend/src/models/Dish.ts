import mongoose, { Document, Schema } from 'mongoose';

export interface IDish extends Document {
  name: string;
  image: string;
  description: string;
  ingredients: string[];
  category: 'plat_principal' | 'accompagnement' | 'dessert' | 'boisson';
  isVegetarian: boolean;
  containsFish: boolean;
  containsMeat: boolean;
  allergens: string[];
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const DishSchema = new Schema<IDish>(
  {
    name: {
      type: String,
      required: [true, 'Le nom du plat est requis'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'L\'image du plat est requise']
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      trim: true
    },
    ingredients: [{
      type: String,
      trim: true
    }],
    category: {
      type: String,
      enum: ['plat_principal', 'accompagnement', 'dessert', 'boisson'],
      default: 'plat_principal'
    },
    isVegetarian: {
      type: Boolean,
      default: false
    },
    containsFish: {
      type: Boolean,
      default: false
    },
    containsMeat: {
      type: Boolean,
      default: true
    },
    allergens: [{
      type: String,
      trim: true
    }],
    likesCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index pour recherche et tri
DishSchema.index({ name: 'text', description: 'text' });
DishSchema.index({ likesCount: -1 });
DishSchema.index({ category: 1 });

export const Dish = mongoose.model<IDish>('Dish', DishSchema);
