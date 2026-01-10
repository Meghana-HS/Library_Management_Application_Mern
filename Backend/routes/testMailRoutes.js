// Backend/routes/testMailRoutes.js
import express from "express";
import { sendMail } from "../services/emailService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await sendMail({
      to: process.env.EMAIL_USER, // send to yourself for test
      subject: "Library test mail",
      html: "<p>This is a test email from your library backend.</p>",
    });
    res.json({ message: "Test email sent" });
  } catch (err) {
    console.error("Test mail error:", err);
    res.status(500).json({ message: "Mail failed", error: err.message });
  }
});

export default router;
