// Backend/controllers/googleAuthController.js
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
export async function googleLogin(req, res) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Missing idToken" });
    }

    // 1) Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, email_verified } = payload;

    if (!email_verified) {
      return res
        .status(400)
        .json({ message: "Email not verified by Google" });
    }

    // 2) Find or create user
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // REGISTER via Google
      isNewUser = true;
      user = new User({
        name: name || "Google User",
        email,
        authProvider: "GOOGLE",
        googleId,
        role: "STUDENT",
        isApproved: true, // auto‑approve Google users
      });
      await user.save();
    } else {
      // LOGIN via Google
      if (!user.authProvider || user.authProvider === "LOCAL") {
        user.authProvider = "GOOGLE";
      }
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (user.role !== "ADMIN" && user.isApproved === false) {
        user.isApproved = true;
      }
      await user.save();
    }

    // 3) Issue same JWT as normal login
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      authProvider: user.authProvider,
      isNewUser, // true = registered now, false = existing login
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(500).json({ message: "Google login failed" });
  }
}
