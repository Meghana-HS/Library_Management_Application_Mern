// Backend/routes/priorityRequestRoutes.js

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  createPriorityRequest,
  getMyPriorityRequests,
  getGlobalPriorityQueue,
} from "../controllers/priorityRequestController.js";

const router = express.Router();

// Student creates a priority request
router.post("/", authMiddleware, requireRole(["STUDENT"]), createPriorityRequest);

// Student sees own priority requests + global rank
router.get("/my", authMiddleware, requireRole(["STUDENT"]), getMyPriorityRequests);

// Librarian/Admin sees full global priority queue (all students)
router.get(
  "/",
  authMiddleware,
  requireRole(["LIBRARIAN", "ADMIN"]),
  getGlobalPriorityQueue
);

export default router;
