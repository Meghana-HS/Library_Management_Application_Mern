import Notification from "../models/Notification.js";

// For logged-in user notifications
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user?._id; // assuming you set req.user in auth middleware

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ notifications });
  } catch (err) {
    console.error("getMyNotifications error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// For admin dashboard: see everything
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({ notifications });
  } catch (err) {
    console.error("getAllNotifications error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
