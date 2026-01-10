// Backend/controllers/recommendationController.js
import Request from "../models/Request.js";
import BorrowRecord from "../models/BorrowRecord.js";
import Book from "../models/Book.js";

/**
 * GET /api/recommendations/for-user
 * Uses borrow + request history to recommend other books for this user
 */
export const getUserRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1) All books this user has interacted with
    const userRequests = await Request.find({ user: userId }).select("book");
    const userBorrows = await BorrowRecord.find({ student: userId }).select("book");

    const seenBookIds = new Set([
      ...userRequests.map(r => String(r.book)),
      ...userBorrows.map(b => String(b.book)),
    ]);

    if (seenBookIds.size === 0) {
      return res.json([]); // nothing to recommend yet
    }

    // 2) All other requests/borrows of those books by other users
    const relatedRequests = await Request.find({
      book: { $in: Array.from(seenBookIds) },
      user: { $ne: userId },
    }).select("user book");

    const relatedBorrows = await BorrowRecord.find({
      book: { $in: Array.from(seenBookIds) },
      student: { $ne: userId },
    }).select("student book");

    const otherUserIds = new Set([
      ...relatedRequests.map(r => String(r.user)),
      ...relatedBorrows.map(b => String(b.student)),
    ]);

    if (otherUserIds.size === 0) {
      return res.json([]);
    }

    // 3) Books those other users liked (excluding books user already saw)
    const otherUsersRequests = await Request.find({
      user: { $in: Array.from(otherUserIds) },
    }).select("book");

    const otherUsersBorrows = await BorrowRecord.find({
      student: { $in: Array.from(otherUserIds) },
    }).select("book");

    const candidateCounts = new Map(); // bookId -> count

    const addCounts = arr => {
      arr.forEach(doc => {
        const id = String(doc.book);
        if (seenBookIds.has(id)) return; // skip already seen
        candidateCounts.set(id, (candidateCounts.get(id) || 0) + 1);
      });
    };

    addCounts(otherUsersRequests);
    addCounts(otherUsersBorrows);

    // 4) Sort candidates by count (co-occurrence) desc
    const sortedIds = Array.from(candidateCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // top 10
      .map(([bookId]) => bookId);

    const books = await Book.find({ _id: { $in: sortedIds } }).select(
      "title author coverImage category availableCopies"
    );

    // optional: preserve sort order
    const booksById = new Map(books.map(b => [String(b._id), b]));
    const ordered = sortedIds
      .map(id => booksById.get(id))
      .filter(Boolean);

    res.json(ordered);
  } catch (err) {
    console.error("Error in getUserRecommendations", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/recommendations/for-book/:bookId
 * “People who requested this also requested…”
 */
export const getBookRecommendations = async (req, res) => {
  try {
    const { bookId } = req.params;

    // 1) Find all users who requested/borrowed this book
    const reqs = await Request.find({ book: bookId }).select("user");
    const borrows = await BorrowRecord.find({ book: bookId }).select("student");

    const userIds = new Set([
      ...reqs.map(r => String(r.user)),
      ...borrows.map(b => String(b.student)),
    ]);

    if (userIds.size === 0) return res.json([]);

    // 2) Other books those users interacted with
    const otherReqs = await Request.find({
      user: { $in: Array.from(userIds) },
      book: { $ne: bookId },
    }).select("book");

    const otherBorrows = await BorrowRecord.find({
      student: { $in: Array.from(userIds) },
      book: { $ne: bookId },
    }).select("book");

    const candidateCounts = new Map();

    const addCounts = arr => {
      arr.forEach(doc => {
        const id = String(doc.book);
        if (id === String(bookId)) return;
        candidateCounts.set(id, (candidateCounts.get(id) || 0) + 1);
      });
    };

    addCounts(otherReqs);
    addCounts(otherBorrows);

    const sortedIds = Array.from(candidateCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id]) => id);

    if (sortedIds.length === 0) return res.json([]);

    const books = await Book.find({ _id: { $in: sortedIds } }).select(
      "title author coverImage category availableCopies"
    );

    const booksById = new Map(books.map(b => [String(b._id), b]));
    const ordered = sortedIds
      .map(id => booksById.get(id))
      .filter(Boolean);

    res.json(ordered);
  } catch (err) {
    console.error("Error in getBookRecommendations", err);
    res.status(500).json({ message: "Server error" });
  }
};
