// Backend/models/FineConfig.js
import mongoose from "mongoose";

const fineConfigSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g. "Default"
    finePerDay: { type: Number, required: true },         // amount per day
    graceDays: { type: Number, default: 0 },              // not used in logic below
    maxFinePerItem: { type: Number },                     // optional cap
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FineConfig = mongoose.model("FineConfig", fineConfigSchema);
export default FineConfig;
