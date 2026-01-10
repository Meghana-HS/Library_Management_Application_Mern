import express from "express";
import {
  runUpcomingDueReminders,
  runOverdueFineReminders,
  runReservationAvailable,
  runLowStockAlerts,
  runDamageAlerts,
  runMembershipExpiry,
} from "../controllers/notificationController.js";
import {
  getAllNotifications,
  getMyNotifications,
} from "../controllers/notificationListController.js";

const router = express.Router();

// jobs
router.post("/run-due-reminders", runUpcomingDueReminders);
router.post("/run-overdue-reminders", runOverdueFineReminders);
router.post("/run-reservation-available", runReservationAvailable);
router.post("/run-low-stock", runLowStockAlerts);
router.post("/run-damage", runDamageAlerts);
router.post("/run-membership-expiry", runMembershipExpiry);

// lists
router.get("/", getAllNotifications);
// router.get("/me", protect, getMyNotifications); // when auth is ready

export default router;
