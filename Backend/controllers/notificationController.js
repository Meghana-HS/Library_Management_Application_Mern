// Backend/controllers/notificationController.js

import {
  notifyUpcomingDueDates,
  notifyOverdueFines,
  notifyReservationAvailable,
  notifyLowStock,
  notifyDamageReported,
  notifyMembershipExpiry,
} from "../services/notificationService.js";

// POST /api/notifications/run-due-reminders
export const runUpcomingDueReminders = async (req, res) => {
  try {
    const count = await notifyUpcomingDueDates();
    return res.json({ message: "Due reminders sent", count });
  } catch (err) {
    console.error("runUpcomingDueReminders error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// POST /api/notifications/run-overdue-reminders
export const runOverdueFineReminders = async (req, res) => {
  try {
    const count = await notifyOverdueFines();
    return res.json({ message: "Overdue fine reminders sent", count });
  } catch (err) {
    console.error("runOverdueFineReminders error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// POST /api/notifications/run-reservation-available
export const runReservationAvailable = async (req, res) => {
  try {
    const count = await notifyReservationAvailable();
    return res.json({
      message: "Reservation available notifications sent",
      count,
    });
  } catch (err) {
    console.error("runReservationAvailable error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// POST /api/notifications/run-low-stock
export const runLowStockAlerts = async (req, res) => {
  try {
    console.log("runLowStockAlerts body =", req.body);

    const bookId = req.body?.bookId;
    if (!bookId) {
      return res
        .status(400)
        .json({ message: "bookId is required in body" });
    }

    const count = await notifyLowStock(bookId);
    return res.json({ message: "Low stock alerts sent", count });
  } catch (err) {
    console.error("runLowStockAlerts error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// POST /api/notifications/run-damage
export const runDamageAlerts = async (req, res) => {
  try {
    console.log("runDamageAlerts body =", req.body);

    const damage = req.body || {};
    const { bookId, reportedBy } = damage;

    if (!bookId || !reportedBy) {
      return res.status(400).json({
        message: "bookId and reportedBy are required in body",
      });
    }

    const count = await notifyDamageReported(damage);
    return res.json({ message: "Damage alerts sent", count });
  } catch (err) {
    console.error("runDamageAlerts error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// POST /api/notifications/run-membership-expiry
export const runMembershipExpiry = async (req, res) => {
  try {
    console.log("runMembershipExpiry body =", req.body);

    const daysRaw = req.body?.days;
    const days = Number(daysRaw || 7);

    if (Number.isNaN(days) || days <= 0) {
      return res
        .status(400)
        .json({ message: "days must be a positive number" });
    }

    const count = await notifyMembershipExpiry(days);
    return res.json({ message: "Membership reminders sent", count });
  } catch (err) {
    console.error("runMembershipExpiry error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
