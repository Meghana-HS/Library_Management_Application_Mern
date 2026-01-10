// Backend/models/MembershipRequest.js
import mongoose from "mongoose";

const membershipRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const MembershipRequest = mongoose.model(
  "MembershipRequest",
  membershipRequestSchema
);

export default MembershipRequest;
