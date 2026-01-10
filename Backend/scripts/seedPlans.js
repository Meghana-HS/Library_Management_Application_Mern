// Backend/scripts/seedPlans.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import MembershipPlan from "../models/MembershipPlan.js";

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    // Optional: clear old plans
    // await MembershipPlan.deleteMany({});

    await MembershipPlan.insertMany([
      {
        name: "Standard",
        description: "Standard plan with basic borrowing limits",
        fee: 500,
        durationInDays: 365,
        maxBooksAllowed: 5,
        isActive: true,
      },
      {
        name: "Premium",
        description: "Higher limits and priority access",
        fee: 1000,
        durationInDays: 365,
        maxBooksAllowed: 10,
        isActive: true,
      },
    ]);

    console.log("✅ Seeded membership plans");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
