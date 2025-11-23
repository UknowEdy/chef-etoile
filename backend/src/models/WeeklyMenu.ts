import mongoose, { Document, Schema, Types } from 'mongoose';

export type DayOfWeek = 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI';

export interface IDayMenu {
  day: DayOfWeek;
  dejeuner: {
    dish: Types.ObjectId;
    name?: string;
    image?: string;
    description?: string;
  };
  diner: {
    dish: Types.ObjectId;
    name?: string;
    image?: string;
    description?: string;
  };
}

export interface IWeeklyMenu extends Document {
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isArchived: boolean;
  meals: IDayMenu[];
  totalLikes: number;
  createdAt: Date;
  updatedAt: Date;
}

const WeeklyMenuSchema = new Schema<IWeeklyMenu>(
  {
    weekNumber: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    meals: [{
      day: {
        type: String,
        enum: ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'],
        required: true
      },
      dejeuner: {
        dish: {
          type: Schema.Types.ObjectId,
          ref: 'Dish'
        },
        name: String,
        image: String,
        description: String
      },
      diner: {
        dish: {
          type: Schema.Types.ObjectId,
          ref: 'Dish'
        },
        name: String,
        image: String,
        description: String
      }
    }],
    totalLikes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index pour recherche rapide
WeeklyMenuSchema.index({ weekNumber: 1, year: 1 }, { unique: true });
WeeklyMenuSchema.index({ isActive: 1 });
WeeklyMenuSchema.index({ isArchived: 1 });
WeeklyMenuSchema.index({ startDate: -1 });

export default mongoose.model<IWeeklyMenu>('WeeklyMenu', WeeklyMenuSchema);
