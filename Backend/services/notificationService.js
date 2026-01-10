import BorrowRecord from "../models/BorrowRecord.js";
import Fine from "../models/Fine.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import { buildMembershipReminderEmail } from "./emailService.js";
import { sendEmailWithNotification } from "./notificationEmailHelper.js";


// 1) Upcoming due dates (2 days before)
export async function notifyUpcomingDueDates() {
  const now = new Date();
  const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  const records = await BorrowRecord.find({
    isReturned: false,
    dueDate: {
      $gte: now,
      $lte: inTwoDays,
    },
  })
    .populate("student")
    .populate("book");

  for (const r of records) {
    if (!r.student?.email) continue;

    const subject = "📚 Reminder: Book due soon";
    const text = `Hi ${r.student.name},

Your book "${r.book.title}" is due on ${r.dueDate.toDateString()}.

Please return or renew it to avoid fines.

- Library`;

    const html = `
      <div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">
          <div style="background:#3949ab;color:#ffffff;padding:16px 24px;">
            <h2 style="margin:0;font-size:20px;">Reminder: Book due soon</h2>
          </div>
          <div style="padding:24px;color:#333333;">
            <p>Hi <strong>${r.student.name}</strong>,</p>
            <p>This is a friendly reminder that your borrowed book is due soon:</p>
            <div style="border-left:4px solid #3949ab;padding-left:12px;margin:12px 0;">
              <p style="margin:0;"><strong>Title:</strong> ${r.book.title}</p>
              <p style="margin:0;"><strong>Due date:</strong> ${r.dueDate.toDateString()}</p>
            </div>
            <p>Please return or renew the book before the due date to avoid fines.</p>
          </div>
          <div style="background:#f1f3f4;color:#777777;padding:10px 24px;font-size:12px;text-align:center;">
            This alert was generated automatically by your Library Management System.
          </div>
        </div>
      </div>
    `;

    await sendEmailWithNotification({
      userId: r.student._id,
      email: r.student.email,
      type: "DUE_REMINDER",
      subject,
      text,
      html,
    });
  }

  return records.length;
}



// 2) Overdue fines notifications
export async function notifyOverdueFines() {
  const now = new Date();

  const fines = await Fine.find({
    isPaid: false,
    dueDate: { $lt: now },
  })
    .populate("member")
    .populate({
      path: "borrowRecord",
      populate: { path: "book" },
    });

  for (const fine of fines) {
    if (!fine.member?.email) continue;

    const bookTitle = fine.borrowRecord?.book?.title || "the borrowed book";

    const subject = "⚠️ Overdue fine reminder";
    const text = `Hi ${fine.member.name},

You have an unpaid overdue fine of ₹${fine.amount} for "${bookTitle}".

Please clear your dues at the earliest.

- Library`;

    const html = `
      <div style="font-family: Arial, sans-serif; background-color:#fff3e0; padding:20px;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #ffe0b2;">
          <div style="background:#e64a19;color:#ffffff;padding:16px 24px;">
            <h2 style="margin:0;font-size:20px;">Overdue fine reminder</h2>
          </div>
          <div style="padding:24px;color:#333333;">
            <p>Hi <strong>${fine.member.name}</strong>,</p>
            <p>You have an unpaid overdue fine with the library.</p>
            <div style="border-left:4px solid #e64a19;padding-left:12px;margin:12px 0;">
              <p style="margin:0;"><strong>Book:</strong> ${bookTitle}</p>
              <p style="margin:0;"><strong>Amount:</strong> ₹${fine.amount}</p>
            </div>
            <p>Please clear your dues at the earliest to continue borrowing books.</p>
          </div>
          <div style="background:#fbe9e7;color:#777777;padding:10px 24px;font-size:12px;text-align:center;">
            This reminder was generated automatically by your Library Management System.
          </div>
        </div>
      </div>
    `;

    await sendEmailWithNotification({
      userId: fine.member._id,
      email: fine.member.email,
      type: "OVERDUE_FINE",
      subject,
      text,
      html,
    });
  }

  return fines.length;
}



// 3) Reservation available notifications (future)
export async function notifyReservationAvailable() {
  // Later: use sendEmailWithNotification with type "RESERVATION_AVAILABLE"
  return 0;
}



// 4) Low stock alerts to admins (beautiful HTML)
export async function notifyLowStock(bookId) {
  const book = await Book.findById(bookId);
  if (!book) return 0;

  const LOW_STOCK_THRESHOLD = 2;
  if (book.availableCopies > LOW_STOCK_THRESHOLD) return 0;

  const admins = await User.find({ role: "ADMIN", isApproved: true });

  for (const admin of admins) {
    if (!admin.email) continue;

    const subject = "📉 Low stock alert – Action required";

    const text = `Hi ${admin.name || "Admin"},

The book "${book.title}" is low on stock.

Available copies: ${book.availableCopies}

Please review and consider updating the stock or ordering new copies.

- Library`;

    const html = `
      <div style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f7fb;padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e0e7ff;box-shadow:0 10px 25px rgba(15,23,42,0.08);">
                <!-- Top accent bar -->
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg,#6366f1,#ec4899);"></td>
                </tr>

                <!-- Header -->
                <tr>
                  <td style="padding:24px 32px 16px 32px;background:radial-gradient(circle at top left,#eef2ff 0,#ffffff 45%);">
                    <table role="presentation" width="100%">
                      <tr>
                        <td align="left">
                          <div style="font-size:13px;letter-spacing:1.8px;text-transform:uppercase;color:#6366f1;font-weight:bold;">
                            Library Dashboard Alert
                          </div>
                          <div style="font-size:22px;font-weight:700;color:#111827;margin-top:6px;">
                            Low stock on a popular title
                          </div>
                        </td>
                        <td align="right" style="font-size:12px;color:#6b7280;">
                          <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:#eef2ff;color:#4f46e5;font-weight:600;">
                            Low stock
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Hero / Illustration -->
                <tr>
                  <td style="padding:0 32px 8px 32px;">
                    <table role="presentation" width="100%" style="border-radius:14px;background:linear-gradient(135deg,#eef2ff,#fdf2ff);">
                      <tr>
                        <td style="padding:18px 20px 6px 20px;">
                          <table role="presentation" width="100%">
                            <tr>
                              <td align="left" style="font-size:13px;color:#4b5563;">
                                Hi <strong>${admin.name || "Admin"}</strong>,
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top:6px;font-size:14px;color:#4b5563;">
                                The following book has reached the low stock threshold in your library inventory.
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top:10px;padding-bottom:4px;">
                                <div style="display:inline-block;padding:8px 12px;border-radius:10px;background:#ffffff;color:#6d28d9;font-size:12px;font-weight:600;border:1px solid #e5e7eb;">
                                  📉 Immediate attention recommended
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Book details card -->
                <tr>
                  <td style="padding:8px 32px 4px 32px;">
                    <table role="presentation" width="100%" style="border-radius:14px;border:1px solid #e5e7eb;background:#ffffff;">
                      <tr>
                        <td style="padding:18px 20px 6px 20px;">
                          <table role="presentation" width="100%">
                            <tr>
                              <td style="font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:1.2px;">
                                Book summary
                              </td>
                              <td align="right">
                                <span style="font-size:11px;color:#9ca3af;">
                                  ID: ${String(book._id)}
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 20px 18px 20px;">
                          <table role="presentation" width="100%">
                            <tr>
                              <td style="font-size:15px;font-weight:700;color:#111827;padding-bottom:6px;">
                                ${book.title}
                              </td>
                            </tr>
                            ${
                              book.author
                                ? `<tr>
                                     <td style="font-size:13px;color:#6b7280;padding-bottom:4px;">
                                       <strong style="color:#4b5563;">Author:</strong> ${book.author}
                                     </td>
                                   </tr>`
                                : ""
                            }
                            ${
                              book.isbn
                                ? `<tr>
                                     <td style="font-size:13px;color:#6b7280;padding-bottom:4px;">
                                       <strong style="color:#4b5563;">ISBN:</strong> ${book.isbn}
                                     </td>
                                   </tr>`
                                : ""
                            }
                            <tr>
                              <td style="padding-top:8px;">
                                <table role="presentation" width="100%">
                                  <tr>
                                    <td style="font-size:13px;color:#374151;">
                                      <strong style="color:#111827;">Available copies:</strong>
                                      <span style="display:inline-block;margin-left:6px;padding:4px 10px;border-radius:999px;background:#fee2e2;color:#b91c1c;font-weight:600;font-size:12px;">
                                        ${book.availableCopies} in shelf
                                      </span>
                                    </td>
                                    <td align="right" style="font-size:12px;color:#6b7280;">
                                      Threshold: ${LOW_STOCK_THRESHOLD}
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Call to action -->
                <tr>
                  <td style="padding:8px 32px 24px 32px;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td style="font-size:13px;color:#4b5563;padding-bottom:12px;">
                          Consider updating the stock in the LMS or placing a new order to ensure availability for students.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <a href="${process.env.LMS_ADMIN_URL || "#"}" 
                             style="display:inline-block;background:linear-gradient(90deg,#4f46e5,#6366f1);color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 18px;border-radius:999px;box-shadow:0 8px 18px rgba(79,70,229,0.35);">
                            Open admin dashboard
                          </a>
                          <span style="font-size:11px;color:#9ca3af;margin-left:8px;">
                            or adjust inventory manually in your system
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:14px 32px 20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td style="font-size:11px;color:#9ca3af;">
                          This notification was generated automatically by your Library Management System.
                        </td>
                        <td align="right" style="font-size:11px;color:#9ca3af;">
                          © ${new Date().getFullYear()} Your Library
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `;

    await sendEmailWithNotification({
      userId: admin._id,
      email: admin.email,
      type: "LOW_STOCK",
      subject,
      text,
      html,
    });
  }

  return admins.length;
}



// 5) Damaged book reports to admins/librarians
export async function notifyDamageReported(damage) {
  const book = await Book.findById(damage.bookId);
  const reporter = await User.findById(damage.reportedBy);

  const staff = await User.find({
    role: { $in: ["ADMIN", "LIBRARIAN"] },
    isApproved: true,
  });

  for (const u of staff) {
    if (!u.email) continue;

    const subject = "📕 Damaged book reported";
    const text = `A damaged book was reported.

Title: ${book ? book.title : "Unknown"}
Reported by: ${reporter ? reporter.name : "Unknown"}
Comment: ${damage.comment || "No comment"}
`;

    const html = `
      <div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">
          <div style="background:#8e24aa;color:#ffffff;padding:16px 24px;">
            <h2 style="margin:0;font-size:20px;">Damaged book reported</h2>
          </div>
          <div style="padding:24px;color:#333333;">
            <p>A damaged book has been reported by a user.</p>
            <div style="border-left:4px solid #8e24aa;padding-left:12px;margin:12px 0;">
              <p style="margin:0;"><strong>Title:</strong> ${book ? book.title : "Unknown"}</p>
              <p style="margin:0;"><strong>Reported by:</strong> ${
                reporter ? reporter.name : "Unknown"
              }</p>
              <p style="margin:0;"><strong>Comment:</strong> ${
                damage.comment || "No comment"
              }</p>
            </div>
          </div>
          <div style="background:#f1f3f4;color:#777777;padding:10px 24px;font-size:12px;text-align:center;">
            Please inspect the book and update its status in the LMS.
          </div>
        </div>
      </div>
    `;

    await sendEmailWithNotification({
      userId: u._id,
      email: u.email,
      type: "DAMAGE_REPORTED",
      subject,
      text,
      html,
    });
  }

  return staff.length;
}



// 6) Membership expiry reminders (for students)
export async function notifyMembershipExpiry(daysAhead = 7) {
  const now = new Date();
  const target = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  const users = await User.find({
    role: "STUDENT",
    membershipExpiry: {
      $gte: now,
      $lte: target,
    },
    isApproved: true,
  });

  for (const user of users) {
    if (!user.email) continue;

    const template = buildMembershipReminderEmail(
      user,
      user.membershipExpiry
    );

    await sendEmailWithNotification({
      userId: user._id,
      email: user.email,
      type: "MEMBERSHIP_EXPIRY",
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  return users.length;
}
