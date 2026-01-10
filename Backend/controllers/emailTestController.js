import User from "../models/User.js";
import { sendWelcomeEmail } from "../services/emailService.js";

export async function sendWelcomeToAll(req, res) {
  try {
    const users = await User.find(
      { isApproved: true },
      { name: 1, email: 1, role: 1 }
    );

    if (!users.length) {
      return res.status(404).json({ message: "No approved users found" });
    }

    for (const u of users) {
      console.log("Sending welcome email to", u.email, "role:", u.role);
      await sendWelcomeEmail(u);
    }

    res.json({ message: `Welcome email sent to ${users.length} users` });
  } catch (err) {
    console.error("sendWelcomeToAll error:", err);
    res.status(500).json({
      message: "Failed to send welcome emails",
      error: err.message,
    });
  }
}
