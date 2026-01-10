// Backend/services/fineService.js
import FineConfig from "../models/FineConfig.js";
import Fine from "../models/Fine.js";
import Member from "../models/Member.js";
// Optional: if you added email notifications for overdue fines
// import { notifyOverdueFine } from "./notificationService.js";

// Get the currently active fine configuration
export async function getActiveFineConfig() {
  const cfg = await FineConfig.findOne({ isActive: true }).sort({
    createdAt: -1,
  });
  // Do NOT throw; just return null if none found
  return cfg;
}

// Compute fine based on due/return dates and config
export function computeFine(dueDate, returnedAt, fineConfig) {
  const msPerMinute = 60 * 1000;

  // No fine if returned on or before dueDate
  if (!returnedAt || returnedAt <= dueDate) {
    return { daysOverdue: 0, amount: 0 };
  }

  // Overdue in minutes (demo: 5‑minute grace)
  const rawMinutes = Math.ceil((returnedAt - dueDate) / msPerMinute);
  const minutesOverdue = Math.max(0, rawMinutes - 5); // 5‑minute grace

  // Convert minutes to days
  const rawDays = minutesOverdue / (24 * 60);
  const daysOverdue = Math.ceil(rawDays);

  let amount = daysOverdue * fineConfig.finePerDay;

  // Respect max per item if configured
  if (fineConfig.maxFinePerItem != null) {
    amount = Math.min(amount, fineConfig.maxFinePerItem);
  }

  return { daysOverdue, amount };
}

// Create a fine when a book is returned (if overdue)
export async function createFineForReturn({
  memberId,
  borrowRecordId,
  dueDate,
  returnedAt,
}) {
  const cfg = await getActiveFineConfig();

  // If no active config, skip fine
  if (!cfg) return null;

  const { daysOverdue, amount } = computeFine(dueDate, returnedAt, cfg);
  if (amount <= 0) return null;

  const fine = await Fine.create({
    member: memberId, // User id from BorrowRecord.student
    borrowRecord: borrowRecordId,
    daysOverdue,
    finePerDay: cfg.finePerDay,
    amount,
    configName: cfg.name,
  });

  // Optional: update Member totals if you use a separate Member collection
  try {
    await Member.findByIdAndUpdate(memberId, {
      $inc: { totalOutstandingFine: amount },
    });
  } catch (_) {
    // ignore if Member doc not found
  }

  // Optional: send email about the new fine
  // try {
  //   await notifyOverdueFine(fine._id);
  // } catch (_) {}

  return fine;
}

// Pay/partially pay a fine
export async function payFine(fineId, amountToPay) {
  const fine = await Fine.findById(fineId);
  if (!fine) throw new Error("Fine not found");

  const remaining = fine.amount - fine.paidAmount;
  const pay = Math.min(remaining, amountToPay);

  fine.paidAmount += pay;
  fine.status = fine.paidAmount >= fine.amount ? "PAID" : "PARTIAL";
  await fine.save();

  try {
    await Member.findByIdAndUpdate(fine.member, {
      $inc: {
        totalOutstandingFine: -pay,
        totalPaidFine: pay,
      },
    });
  } catch (_) {
    // ignore if Member not maintained
  }

  return fine;
}
