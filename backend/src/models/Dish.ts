import mongoose, { Document, Schema } from 'mongoose';

export interface IDish extends Document {
  name: string;
  description: string;
  image?: string; // URL ou base64
  ingredients: string[];
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
    description: {
      type: String,
      required: [true, 'La description est requise'],
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    ingredients: {
      type: [String],
      default: []
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

DishSchema.index({ name: 1 });
DishSchema.index({ createdAt: -1 });

export const Dish = mongoose.model<IDish>('Dish', DishSchema);
