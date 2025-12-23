import { Schema, model, Types } from "mongoose";

export interface ISubscriptionPlan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isDefault: boolean;
  isActive: boolean;
}

const SubscriptionSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true, unique: true },
    monthlyPrice: { type: Number, required: true },
    yearlyPrice: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔥 The "One True Only" Logic
SubscriptionSchema.pre("save", async function (this: any) {
  // We only care if the document is being set to isDefault: true
  if (this.isDefault) {
    try {
      // Use this.constructor to refer to the Model
      await (this.constructor as any).updateMany(
        { _id: { $ne: this._id } },
        { $set: { isDefault: false } }
      );
    } catch (error) {
      // In async hooks, throwing an error automatically stops the save
      throw error;
    }
  }
});

export const SubscriptionPlan = model<ISubscriptionPlan>(
  "SubscriptionPlan",
  SubscriptionSchema
);
