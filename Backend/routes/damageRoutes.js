// Backend/routes/damageRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { notifyDamagedBook } from "../services/notificationService.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { bookId, comment } = req.body;
    await notifyDamagedBook({ bookId, reporterId: req.user.id, comment });
    res.json({ message: "Damage report submitted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
