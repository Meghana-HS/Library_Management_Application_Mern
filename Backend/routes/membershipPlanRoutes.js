// Backend/routes/membershipPlanRoutes.js
import express from "express";
import {
  createPlan,
  updatePlan,
  deletePlan,
  getPlans,
} from "../controllers/membershipPlanController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only routes
router.post("/", authMiddleware, adminMiddleware, createPlan);
router.put("/:id", authMiddleware, adminMiddleware, updatePlan);
router.delete("/:id", authMiddleware, adminMiddleware, deletePlan);

// Decide: public or protected GET
// If MemberForm should work without login:
router.get("/", getPlans);

// If it requires admin login instead:
// router.get("/", authMiddleware, adminMiddleware, getPlans);

export default router;
