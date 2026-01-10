// Backend/routes/fineRoutes.js
import express from "express";
import Fine from "../models/Fine.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { payFine } from "../services/fineService.js";

const router = express.Router();

// Get all fines (admin/librarian)
router.get(
  "/",
  authMiddleware,
  requireRole(["ADMIN", "LIBRARIAN"]),
  async (req, res) => {
    try {
      const fines = await Fine.find()
        .populate("member", "name email")
        .populate("borrowRecord");
      res.json(fines);
    } catch (err) {
      console.error("Get fines error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get my fines (student)
router.get(
  "/my",
  authMiddleware,
  requireRole(["STUDENT"]),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const fines = await Fine.find({ member: userId }).populate(
        "borrowRecord"
      );
      res.json(fines);
    } catch (err) {
      console.error("Get my fines error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Pay a fine (student)
router.post(
  "/:id/pay",
  authMiddleware,
  requireRole(["STUDENT"]),
  async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const fine = await payFine(req.params.id, amount);
      res.json(fine);
    } catch (err) {
      console.error("Pay fine error:", err);
      res.status(400).json({ message: err.message || "Payment failed" });
    }
  }
);

export default router;
