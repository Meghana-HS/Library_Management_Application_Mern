// Backend/controllers/borrowController.js

import BorrowRecord from "../models/BorrowRecord.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import PriorityRequest from "../models/PriorityRequest.js";
import { createFineForReturn } from "../services/fineService.js";
import {
  sendEmail,
  buildLoanReceiptEmail,
} from "../services/emailService.js";

// 📌 helper: issue a book copy to a given student
async function issueToStudent({ book, studentId, issuedBy, minutes }) {
  const numMinutes = Number(minutes) || 5;
  const dueDate = new Date();
  dueDate.setTime(dueDate.getTime() + numMinutes * 60 * 1000);

  const record = new BorrowRecord({
    book: book._id,
    student: studentId,
    issuedBy,
    dueDate,
    isReturned: false,
  });

  await record.save();

  // decrease stock
  book.availableCopies -= 1;
  await book.save();

  // DEBUG for low stock
  console.log("After issue, copies =", book.availableCopies);

  // 🔔 Low stock email to admins
  const LOW_STOCK_THRESHOLD = 2;
  if (book.availableCopies <= LOW_STOCK_THRESHOLD) {
    console.log("Entering low stock block");
    const admins = await User.find({ role: "ADMIN", isApproved: true });
    console.log("Admins found:", admins.map((a) => a.email));

    for (const admin of admins) {
      console.log("Sending low stock email to", admin.email);
      await sendEmail(
        admin.email,
        "Low stock book",
        `Book "${book.title}" is low on stock (available copies: ${book.availableCopies}).`
      );
    }
  } else {
    console.log(
      "No low stock, copies >",
      LOW_STOCK_THRESHOLD,
      "current:",
      book.availableCopies
    );
  }

  // 🔔 Loan receipt email to student
  try {
    await record.populate("student").populate("book");
    const template = buildLoanReceiptEmail(
      record.student,
      record.book,
      record.dueDate
    );
    await sendEmail(
      record.student.email,
      template.subject,
      template.text,
      template.html
    );
  } catch (err) {
    console.error("Loan receipt email error:", err);
  }

  return record;
}

// 📌 Issue a book directly (from admin panel form, NOT for priority queue)
export async function issueBook(req, res) {
  try {
    const { bookId, studentId, minutes } = req.body;

    if (!bookId || !studentId) {
      return res
        .status(400)
        .json({ message: "Book ID and Student ID are required." });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book not available." });
    }

    // 🚫 Block manual issue if there is any pending priority request for this book
    const pendingPriority = await PriorityRequest.findOne({
      book: book._id,
      status: "PENDING",
    });

    if (pendingPriority) {
      return res.status(400).json({
        message:
          "This book has pending priority requests. Please issue via the priority queue.",
      });
    }

    const student = await User.findOne({
      _id: studentId,
      isApproved: true,
      role: "STUDENT",
    });

    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found or not approved." });
    }

    // 🔹 Membership: enforce max active borrowed books
    const currentBorrowedCount = await BorrowRecord.countDocuments({
      student: studentId,
      isReturned: false,
    });

    const maxBooks = student.maxBorrowLimit || 2;

    if (currentBorrowedCount >= maxBooks) {
      return res.status(400).json({
        message: `Borrowing limit reached. This member can borrow maximum ${maxBooks} books at a time.`,
      });
    }

    const record = await issueToStudent({
      book,
      studentId,
      issuedBy: req.user.id,
      minutes,
    });

    res.status(201).json({ message: "Book issued successfully.", record });
  } catch (err) {
    console.error("Issue Book Error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
}

// 📌 Return a book; if copies become available, serve next priority request for this book
export async function returnBook(req, res) {
  try {
    const { id } = req.params;

    const record = await BorrowRecord.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }

    if (record.isReturned) {
      return res.status(400).json({ message: "Book already returned." });
    }

    record.isReturned = true;
    record.returnDate = new Date();
    await record.save();

    let book = await Book.findById(record.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    // Create fine on return (if overdue)
    let fineAmount = 0;
    try {
      const fine = await createFineForReturn({
        memberId: record.student, // User id for Fine.member
        borrowRecordId: record._id,
        dueDate: record.dueDate,
        returnedAt: record.returnDate,
      });

      if (fine && fine.amount) {
        fineAmount = fine.amount;
      }
    } catch (e) {
      console.error("CreateFineForReturn error:", e);
      // do not break return flow
    }

    // 🔔 Overdue fine email to student
    if (fineAmount > 0) {
      console.log("Fine amount for record", record._id, "=", fineAmount);
      const student = await User.findById(record.student);
      if (student) {
        console.log("Sending fine email to", student.email);
        await sendEmail(
          student.email,
          "Overdue fine",
          `Hi ${student.name},

Your book "${book ? book.title : ""}" was returned late.

Fine amount: ₹${fineAmount}.

Please pay the fine in your account.

- Library`
        );
      }
    }

    // 📌 After returning, if this book now has a free copy,
    //     issue it to the next student in the PRIORITY queue for THIS book.
    if (book && book.availableCopies > 0) {
      const nextPriority = await PriorityRequest.findOne({
        book: book._id,
        status: "PENDING",
      })
        .sort({ priorityScore: -1, createdAt: 1 })
        .populate("student");

      if (nextPriority) {
        console.log(
          "Issuing returned copy of",
          book.title,
          "to priority student",
          nextPriority.student._id
        );

        // mark request as fulfilled
        nextPriority.status = "FULFILLED";
        await nextPriority.save();

        // Optionally enforce membership limit here too
        const nextStudent = await User.findById(nextPriority.student._id);
        const activeCount = await BorrowRecord.countDocuments({
          student: nextStudent._id,
          isReturned: false,
        });
        const maxBooks = nextStudent.maxBorrowLimit || 2;
        if (activeCount < maxBooks) {
          await issueToStudent({
            book,
            studentId: nextPriority.student._id,
            issuedBy: req.user.id,
            minutes: 5,
          });
        } else {
          console.log(
            "Priority student reached limit, not auto-issuing for",
            nextStudent._id
          );
        }
      }
    }

    res.json({ message: "Book returned successfully.", record });
  } catch (err) {
    console.error("Return Book Error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
}

// 📌 Student — view own borrowed books
export async function myBorrowed(req, res) {
  try {
    const userId = req.user.id;
    const records = await BorrowRecord.find({ student: userId }).populate(
      "book"
    );
    res.json(records);
  } catch (err) {
    console.error("My Borrowed Error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
}

// 📌 Admin/Librarian — get ALL borrow records
export async function getAllBorrowRecords(req, res) {
  try {
    const records = await BorrowRecord.find()
      .populate("student", "name email")
      .populate("book", "title author")
      .populate("issuedBy", "name email");

    res.json(records);
  } catch (err) {
    console.error("Get All Borrow Records Error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
}
