// Backend/services/emailService.js
import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("EMAIL_USER in emailService =", process.env.EMAIL_USER);
console.log("EMAIL_PASS set in emailService =", !!process.env.EMAIL_PASS);

// Gmail transporter (you can swap to SendGrid SMTP if you want)
const transporter = nodemailer.createTransport({
  service: "gmail", // uses smtp.gmail.com etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generic send function (still used everywhere)
export async function sendEmail(to, subject, text, html) {
  return transporter.sendMail({
    from: `"LMS Notifications" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

/**
 * Role-specific HTML templates
 * (your existing welcome templates – kept as they were)
 */

function studentWelcomeTemplate(user) {
  const name = user.name || "there";
  return {
    subject: "Welcome to Your Student Library Portal",
    text: `Hi ${name},
Welcome to the Library Management System as a STUDENT.

You can now:
- Browse and search books
- Place holds and track due dates
- Build your personal reading history

Happy learning!
- LMS Team`,
    html: `
    <div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">
        <div style="background:#3949ab; color:#ffffff; padding:16px 24px;">
          <h2 style="margin:0;">Welcome to your Student Library Portal</h2>
        </div>
        <div style="padding:24px; color:#333333;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your student account is ready. Discover books, track deadlines, and grow your reading journey in one place.</p>
          <ul>
            <li>Browse and search the full library catalog.</li>
            <li>Place holds and see your active loans.</li>
            <li>View upcoming due dates and avoid fines.</li>
          </ul>
          <p>Use the same email you registered with to sign in.</p>
        </div>
        <div style="background:#f1f3f4; color:#777777; padding:10px 24px; font-size:12px; text-align:center;">
          – Library Management System Team
        </div>
      </div>
    </div>
    `,
  };
}

function librarianWelcomeTemplate(user) {
  const name = user.name || "there";
  return {
    subject: "Welcome to the Librarian Dashboard",
    text: `Hi ${name},
Welcome to the Library Management System as a LIBRARIAN.

You now have tools to manage catalog and loans for your readers.

- LMS Team`,
    html: `
    <div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">
        <div style="background:#00897b; color:#ffffff; padding:16px 24px;">
          <h2 style="margin:0;">Welcome to your Librarian Dashboard</h2>
        </div>
        <div style="padding:24px; color:#333333;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>You now have powerful tools to curate the collection and support every reader on campus.</p>
          <ul>
            <li>Manage and update book records.</li>
            <li>Approve and monitor borrow requests.</li>
            <li>Help students keep track of their due dates.</li>
          </ul>
        </div>
        <div style="background:#f1f3f4; color:#777777; padding:10px 24px; font-size:12px; text-align:center;">
          – Library Management System Team
        </div>
      </div>
    </div>
    `,
  };
}

function adminWelcomeTemplate(user) {
  const name = user.name || "there";
  return {
    subject: "Welcome, Library Admin",
    text: `Hi ${name},
Welcome to the Library Management System as an ADMIN.

You can manage users, policies, and overall system configuration.

- LMS Team`,
    html: `
    <div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">
        <div style="background:#e53935; color:#ffffff; padding:16px 24px;">
          <h2 style="margin:0;">Welcome, Library Administrator</h2>
        </div>
        <div style="padding:24px; color:#333333;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>You have full visibility and control over users, roles, policies, and system health.</p>
          <ul>
            <li>Configure lending rules and fines.</li>
            <li>Approve librarians and students.</li>
            <li>Monitor key activity and system usage.</li>
          </ul>
          <p>Handle admin operations carefully and keep your credentials secure.</p>
        </div>
        <div style="background:#f1f3f4; color:#777777; padding:10px 24px; font-size:12px; text-align:center;">
          – Library Management System Team
        </div>
      </div>
    </div>
    `,
  };
}

// Existing welcome mail helper
export async function sendWelcomeEmail(user) {
  const role = (user.role || "STUDENT").toUpperCase();

  let template;
  if (role === "LIBRARIAN") {
    template = librarianWelcomeTemplate(user);
  } else if (role === "ADMIN") {
    template = adminWelcomeTemplate(user);
  } else {
    template = studentWelcomeTemplate(user);
  }

  await sendEmail(user.email, template.subject, template.text, template.html);
}

/**
 * NEW: Password reset template
 */
export function buildPasswordResetEmail(user, resetLink) {
  const subject = "Reset your LMS password";
  const text = `Hi ${user.name},

We received a request to reset your password.

Click this link to reset your password:
${resetLink}

If you did not request this, you can ignore this email.`;

  const html = `
  <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">
      <div style="background:#1e88e5;color:#ffffff;padding:16px 24px;">
        <h2 style="margin:0;font-size:20px;">Reset your LMS password</h2>
      </div>
      <div style="padding:24px;color:#333333;">
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>We received a request to reset the password for your Library Management System account.</p>
        <p>Click the button below to choose a new password. This link will expire soon.</p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${resetLink}" style="background:#1e88e5;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:4px;display:inline-block;">
            Reset Password
          </a>
        </p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
      <div style="background:#f1f3f4;color:#777777;padding:10px 24px;font-size:12px;text-align:center;">
        This email was sent automatically by your Library Management System.
      </div>
    </div>
  </div>
  `;
  return { subject, text, html };
}

/**
 * NEW: Loan receipt template (on issue)
 */
export function buildLoanReceiptEmail(user, book, dueDate) {
  const subject = `Loan receipt: ${book.title}`;
  const text = `Hi ${user.name},

You borrowed "${book.title}".

Due date: ${dueDate.toDateString()}.

Please return or renew the book before the due date to avoid fines.`;

  const html = `
  <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;border:1px solid #e0e0e0;overflow:hidden;">
      <div style="background:#43a047;color:#ffffff;padding:16px 24px;">
        <h2 style="margin:0;font-size:20px;">Loan receipt</h2>
      </div>
      <div style="padding:24px;color:#333333;">
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>You have successfully borrowed the following item from the library:</p>
        <div style="border-left:4px solid #43a047;padding-left:12px;margin:12px 0;">
          <p style="margin:0;"><strong>Title:</strong> ${book.title}</p>
          <p style="margin:0;"><strong>Author:</strong> ${book.author || "N/A"}</p>
          <p style="margin:0;"><strong>Due date:</strong> ${dueDate.toDateString()}</p>
        </div>
        <p>Please return or renew this item before the due date to avoid fines.</p>
      </div>
      <div style="background:#f1f3f4;color:#777777;padding:10px 24px;font-size:12px;text-align:center;">
        Thank you for using the Library Management System.
      </div>
    </div>
  </div>
  `;
  return { subject, text, html };
}

/**
 * NEW: Membership expiry reminder template
 */
export function buildMembershipReminderEmail(user, expiryDate) {
  const subject = "Membership expiring soon";
  const text = `Hi ${user.name},

Your library membership is expiring on ${expiryDate.toDateString()}.

Please renew soon to continue using library services.`;

  const html = `
  <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;border:1px solid #e0e0e0;overflow:hidden;">
      <div style="background:#fb8c00;color:#ffffff;padding:16px 24px;">
        <h2 style="margin:0;font-size:20px;">Membership expiring soon</h2>
      </div>
      <div style="padding:24px;color:#333333;">
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Your library membership is scheduled to expire on <strong>${expiryDate.toDateString()}</strong>.</p>
        <p>Please renew your membership to continue borrowing books and accessing all services.</p>
      </div>
      <div style="background:#f1f3f4;color:#777777;padding:10px 24px;font-size:12px;text-align:center;">
        Generated automatically by the Library Management System.
      </div>
    </div>
  </div>
  `;
  return { subject, text, html };
}
