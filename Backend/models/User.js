// Backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  // LOCAL users: password required
  // GOOGLE users: password can be empty
  password: { type: String },

  role: {
    type: String,
    enum: ["ADMIN", "LIBRARIAN", "STUDENT"],
    default: "STUDENT",
  },

  isApproved: { type: Boolean, default: false },

  idProofPath: { type: String },

  // Social login info
  authProvider: {
    type: String,
    enum: ["LOCAL", "GOOGLE"],
    default: "LOCAL",
  },
  googleId: { type: String },

  // For password reset (used in authController)
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  createdAt: { type: Date, default: Date.now },

  // 🔹 Membership info
  membershipType: {
    type: String,
    enum: ["BASIC", "PREMIUM"],
    default: "BASIC",
  },
  // Per-member max active borrowed books
  maxBorrowLimit: {
    type: Number,
    default: 2, // BASIC default; adjust per user/plan
  },
});

// Ensure LOCAL users always have a password
userSchema.pre("save", function (next) {
  if (this.authProvider === "LOCAL" && !this.password) {
    return next(new Error("Password is required for LOCAL users"));
  }
  next();
});

export default mongoose.model("User", userSchema);
