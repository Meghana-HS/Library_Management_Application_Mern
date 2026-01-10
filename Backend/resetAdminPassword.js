import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // note the .js at the end

const mongoURI = "mongodb+srv://meghana:Chinnima%402003@coding.zsuvwia.mongodb.net/?retryWrites=true&w=majority&appName=coding";
const newPassword = "admin1234";

async function resetPassword() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    const hashed = await bcrypt.hash(newPassword, 10);

    const result = await User.findOneAndUpdate(
      { email: "admin@library.com" },
      { password: hashed },
      { new: true }
    );

    if (!result) console.log("Admin not found!");
    else console.log("Admin password reset successfully!");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

resetPassword();
