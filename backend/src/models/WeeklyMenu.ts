import mongoose, { Document, Schema } from 'mongoose';

export interface IWeeklyMenu extends Document {
  weekNumber: number;
  year: number;
  isActive: boolean;
  meals: {
    day: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI';
    dejeuner: { name: string; description?: string };
    diner: { name: string; description?: string };
  }[];
}

const WeeklyMenuSchema = new Schema<IWeeklyMenu>({
  weekNumber: { type: Number, required: true },
  year: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  meals: [{
    day: {
      type: String,
      enum: ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'],
      required: true
    },
    dejeuner: {
      name: { type: String, required: true },
      description: String
    },
    diner: {
      name: { type: String, required: true },
      description: String
    }
  }]
}, { timestamps: true });

export default mongoose.model<IWeeklyMenu>('WeeklyMenu', WeeklyMenuSchema);
