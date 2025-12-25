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

SubscriptionSchema.pre("save", async function (this: any) {
  if (this.isDefault) {
    try {
      await (this.constructor as any).updateMany(
        { _id: { $ne: this._id } },
        { $set: { isDefault: false } }
      );
    } catch (error) {
      throw error;
    }
  }
});

export const SubscriptionPlan = model<ISubscriptionPlan>(
  "SubscriptionPlan",
  SubscriptionSchema
);
