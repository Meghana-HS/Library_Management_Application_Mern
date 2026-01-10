// Backend/models/MembershipPlan.js
import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Standard, Premium
    description: String,
    fee: { type: Number, required: true, default: 0 },    // per period
    durationInDays: { type: Number, required: true, default: 365 },
    maxBooksAllowed: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MembershipPlan = mongoose.model("MembershipPlan", planSchema);
export default MembershipPlan;
