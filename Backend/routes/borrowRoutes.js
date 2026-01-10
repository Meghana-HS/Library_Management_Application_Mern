// Backend/routes/borrowRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  issueBook,
  returnBook,
  myBorrowed,
  getAllBorrowRecords,
} from "../controllers/borrowController.js";

const router = express.Router();

// Admin / Librarian — view all borrow records
router.get(
  "/all",
  authMiddleware,
  requireRole(["ADMIN", "LIBRARIAN"]),
  getAllBorrowRecords
);

// Student — view own records
router.get(
  "/my",
  authMiddleware,
  requireRole(["STUDENT"]),
  myBorrowed
);

// Issue a book
router.post(
  "/issue",
  authMiddleware,
  requireRole(["ADMIN", "LIBRARIAN"]),
  issueBook
);

// Return a book
router.post(
  "/return/:id",
  authMiddleware,
  requireRole(["ADMIN", "LIBRARIAN"]),
  returnBook
);

export default router;
