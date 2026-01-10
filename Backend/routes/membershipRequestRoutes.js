// Backend/routes/membershipRequestRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  createMembershipRequest,
  getMyMembershipRequests,
  getAllMembershipRequests,
  updateMembershipRequestStatus,
} from "../controllers/membershipRequestController.js";

const router = express.Router();

// student creates membership request
router.post(
  "/",
  authMiddleware,
  requireRole(["STUDENT"]),
  createMembershipRequest
);

// student sees own membership requests
router.get(
  "/mine",
  authMiddleware,
  requireRole(["STUDENT"]),
  getMyMembershipRequests
);

// admin views all membership requests
router.get(
  "/",
  authMiddleware,
  requireRole(["ADMIN"]),
  getAllMembershipRequests
);

// admin approves / rejects
router.patch(
  "/:id",
  authMiddleware,
  requireRole(["ADMIN"]),
  updateMembershipRequestStatus
);

export default router;
