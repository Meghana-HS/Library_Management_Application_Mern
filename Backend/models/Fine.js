// Backend/models/Fine.js
import mongoose from "mongoose";

const fineSchema = new mongoose.Schema(
  {
    // Use User, because BorrowRecord.student is a User id
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    borrowRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BorrowRecord",
      required: true,
    },
    daysOverdue: { type: Number, required: true },
    finePerDay: { type: Number, required: true },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["PENDING", "PARTIAL", "PAID"],
      default: "PENDING",
    },
    configName: String,
  },
  { timestamps: true }
);

const Fine = mongoose.model("Fine", fineSchema);
export default Fine;
