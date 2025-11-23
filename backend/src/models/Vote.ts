import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVote extends Document {
  userId: Types.ObjectId;
  dishId: Types.ObjectId;
  menuId?: Types.ObjectId;
  createdAt: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dishId: {
      type: Schema.Types.ObjectId,
      ref: 'Dish',
      required: true
    },
    menuId: {
      type: Schema.Types.ObjectId,
      ref: 'WeeklyMenu'
    }
  },
  {
    timestamps: true
  }
);

// Un utilisateur ne peut voter qu'une fois par plat
VoteSchema.index({ userId: 1, dishId: 1 }, { unique: true });
VoteSchema.index({ dishId: 1 });
VoteSchema.index({ menuId: 1 });

export const Vote = mongoose.model<IVote>('Vote', VoteSchema);
