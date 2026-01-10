import Notification from "../models/Notification.js";
import { sendEmail } from "./emailService.js";

export async function sendEmailWithNotification({
  userId,
  email,
  type,
  subject,
  text,
  html,
}) {
  console.log("sendEmailWithNotification called for type=", type, "email=", email);

  const notification = await Notification.create({
    userId,
    email,
    type,
    subject,
    message: text?.slice(0, 200) || "",
    status: "PENDING",
  });

  console.log("Notification created:", notification._id, "type=", notification.type);

  try {
    await sendEmail(email, subject, text, html);
    notification.status = "SENT";
    await notification.save();
  } catch (err) {
    notification.status = "FAILED";
    notification.error = err?.message || String(err);
    await notification.save();
    console.error("Email send failed for notification", notification._id, err.message);
    throw err;
  }

  return notification;
}
