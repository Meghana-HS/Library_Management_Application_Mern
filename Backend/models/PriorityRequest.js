// Backend/models/PriorityRequest.js

import mongoose from "mongoose";

const priorityRequestSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // computed score: higher = more priority
    priorityScore: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "FULFILLED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("PriorityRequest", priorityRequestSchema);
