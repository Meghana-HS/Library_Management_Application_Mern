import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "WELCOME",
        "PASSWORD_RESET",
        "LOAN_RECEIPT",
        "MEMBERSHIP_EXPIRY",
        "DUE_REMINDER",
        "OVERDUE_FINE",
        "LOW_STOCK",
        "DAMAGE_REPORTED",
      ],
      required: true,
    },
    subject: String,
    message: String,
    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING",
    },
    error: String,
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
