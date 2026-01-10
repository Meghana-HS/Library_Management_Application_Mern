// Backend/models/Member.js
import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    address: String,

    // Reference to membership plan
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      required: true,
    },

    joinDate: { type: Date, required: true, default: Date.now },
    expiryDate: { type: Date, required: true },

    isActive: { type: Boolean, default: true },

    // Fine summary
    totalOutstandingFine: { type: Number, default: 0 },
    totalPaidFine: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Member = mongoose.model('Member', memberSchema);
export default Member;
