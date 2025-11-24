import mongoose, { Document, Schema } from 'mongoose';

export interface IMealDay {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
  lunch?: mongoose.Types.ObjectId; // Reference to Dish
  dinner?: mongoose.Types.ObjectId; // Reference to Dish
}

export interface IWeeklyMenu extends Document {
  weekStart: Date; // Lundi de la semaine
  meals: IMealDay[];
  createdAt: Date;
  updatedAt: Date;
}

const MealDaySchema = new Schema<IMealDay>({
  dayOfWeek: {
    type: String,
    enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    required: true
  },
  lunch: {
    type: Schema.Types.ObjectId,
    ref: 'Dish'
  },
  dinner: {
    type: Schema.Types.ObjectId,
    ref: 'Dish'
  }
});

const WeeklyMenuSchema = new Schema<IWeeklyMenu>(
  {
    weekStart: {
      type: Date,
      required: [true, 'La date de début de semaine est requise'],
      index: true
    },
    meals: {
      type: [MealDaySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

WeeklyMenuSchema.index({ weekStart: -1 });

export const WeeklyMenu = mongoose.model<IWeeklyMenu>('WeeklyMenu', WeeklyMenuSchema);
