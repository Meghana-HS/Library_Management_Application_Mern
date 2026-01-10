// Backend/controllers/priorityRequestController.js

import PriorityRequest from "../models/PriorityRequest.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

// Simple scorer: can extend with membership, fines etc.
function computePriorityScore(user) {
  let base = 0;
  if (user.role === "LIBRARIAN") base = 100;
  else if (user.role === "STUDENT") base = 50;
  // You can add more rules here (e.g. seniority, membershipPlan, etc.)
  return base;
}

// POST /api/priority-requests
// body: { bookId }
export async function createPriorityRequest(req, res) {
  try {
    const { bookId } = req.body;
    const studentId = req.user.id;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "STUDENT" || !student.isApproved) {
      return res
        .status(400)
        .json({ message: "Only approved students can request" });
    }

    // Do not duplicate pending priority request for same book + student
    const existing = await PriorityRequest.findOne({
      book: bookId,
      student: studentId,
      status: "PENDING",
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have a pending priority request for this book",
      });
    }

    const priorityScore = computePriorityScore(student);

    const pr = new PriorityRequest({
      book: bookId,
      student: studentId,
      priorityScore,
    });

    await pr.save();

    return res.status(201).json({
      message: "Priority request created",
      request: pr,
    });
  } catch (err) {
    console.error("createPriorityRequest error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// GET /api/priority-requests/my
// Student view: own requests + GLOBAL & PER-BOOK rank
export async function getMyPriorityRequests(req, res) {
  try {
    const studentId = req.user.id;

    // 1) Global pending list, across ALL students and ALL books
    const all = await PriorityRequest.find({ status: "PENDING" })
      .populate("book", "title author")
      .sort({ priorityScore: -1, createdAt: 1 });

    // 2) Group by book to get per-book queues
    const byBook = new Map(); // bookId -> [requests ordered]
    for (const r of all) {
      const bookId = r.book._id.toString();
      if (!byBook.has(bookId)) byBook.set(bookId, []);
      byBook.get(bookId).push(r);
    }

    // 3) Filter to current student's requests and attach ranks
    const myWithRanks = all
      .filter((r) => r.student.toString() === studentId)
      .map((r) => {
        const globalIndex = all.findIndex(
          (x) => x._id.toString() === r._id.toString()
        );

        const bookId = r.book._id.toString();
        const bookQueue = byBook.get(bookId) || [];
        const bookIndex = bookQueue.findIndex(
          (x) => x._id.toString() === r._id.toString()
        );

        return {
          ...r.toObject(),
          globalRank: globalIndex + 1,
          bookRank: bookIndex + 1,
        };
      });

    return res.json(myWithRanks);
  } catch (err) {
    console.error("getMyPriorityRequests error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// OPTIONAL: global queue for librarian dashboard
// GET /api/priority-requests
export async function getGlobalPriorityQueue(req, res) {
  try {
    const requests = await PriorityRequest.find({ status: "PENDING" })
      .populate("book", "title author")
      .populate("student", "name email")
      .sort({ priorityScore: -1, createdAt: 1 });

    const withRank = requests.map((r, index) => ({
      ...r.toObject(),
      globalRank: index + 1,
    }));

    return res.json(withRank);
  } catch (err) {
    console.error("getGlobalPriorityQueue error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
