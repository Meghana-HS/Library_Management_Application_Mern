// Backend/controllers/adminController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../services/emailService.js";

// Ensure admin exists (email: bnamitha57@gmail.com, password: Chinnima@8050)
export async function ensureAdminExists() {
  try {
    console.log("ensureAdminExists STARTED");

    const adminEmail = "bnamitha57@gmail.com";
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log("Admin exists");
      return;
    }

    const hashed = await bcrypt.hash("Chinnima@8050", 10);

    const admin = new User({
      name: "Admin",
      username: "admin",
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
      isApproved: true,
    });

    await admin.save();
    console.log(
      "Admin created with email bnamitha57@gmail.com and password Chinnima@8050"
    );

    // optional: send welcome email to seeded admin once
    await sendWelcomeEmail(admin);
  } catch (err) {
    console.error("Error ensuring admin exists", err);
  }
}

// Get pending users (not approved)
export async function getPendingUsers(req, res) {
  try {
    const pending = await User.find({
      isApproved: false,
      role: { $in: ["STUDENT", "LIBRARIAN"] },
    }).select("-password");
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// Approve a user → send welcome email
export async function approveUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = true;
    await user.save();

    // send nice welcome email based on role
    await sendWelcomeEmail(user);

    res.json({ message: "User approved" });
  } catch (err) {
    console.error("approveUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Reject a user
export async function rejectUser(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// Get approved students only
export async function getApprovedStudents(req, res) {
  try {
    const students = await User.find({
      isApproved: true,
      role: "STUDENT",
    }).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
