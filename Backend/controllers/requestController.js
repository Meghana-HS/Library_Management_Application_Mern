// Backend/controllers/requestController.js
import Request from "../models/Request.js";
import Book from "../models/Book.js";
import BorrowRecord from "../models/BorrowRecord.js";
import User from "../models/User.js";

// POST /api/requests  (student)
export const createRequest = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const existing = await Request.findOne({
      book: bookId,
      user: userId,
      status: "pending",
    });
    if (existing)
      return res.status(400).json({ message: "Request already pending" });

    // 🔹 OPTIONAL: enforce membership limit on queued+borrowed
    const user = await User.findById(userId);
    const maxBooks = user?.maxBorrowLimit || 2;

    const activeBorrowCount = await BorrowRecord.countDocuments({
      student: userId,
      isReturned: false,
    });

    const pendingOrApprovedRequests = await Request.countDocuments({
      user: userId,
      status: { $in: ["pending", "approved"] },
    });

    if (activeBorrowCount + pendingOrApprovedRequests >= maxBooks) {
      return res.status(400).json({
        message: `You have reached your limit of ${maxBooks} active/queued books.`,
      });
    }

    const request = await Request.create({ book: bookId, user: userId });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/requests  (librarian)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("book", "title author")
      .populate("user", "name email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/requests/mine  (student)
export const getMyRequests = async (req, res) => {
  try {
    // all requests of this user
    const requests = await Request.find({ user: req.user.id }).populate(
      "book",
      "title"
    );

    // all borrow records created from these requests
    const borrowRecords = await BorrowRecord.find({
      request: { $in: requests.map((r) => r._id) },
    }).select("request");

    const issuedSet = new Set(borrowRecords.map((b) => String(b.request)));

    // attach wasIssued flag
    const result = requests.map((r) => ({
      ...r.toObject(),
      wasIssued: issuedSet.has(String(r._id)),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/requests/:id  (librarian) – approve / reject + auto-issue on approve
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    if (status === "approved") {
      const book = await Book.findById(request.book);
      if (!book) {
        return res
          .status(404)
          .json({ message: "Book not found for request" });
      }
      if (book.availableCopies <= 0) {
        return res.status(400).json({ message: "Book not available" });
      }

      const numDays = 14; // default issue period
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + numDays);

      const record = new BorrowRecord({
        book: request.book,
        student: request.user,
        issuedBy: req.user.id, // librarian
        dueDate,
        isReturned: false,
        request: request._id,
      });

      await record.save();

      book.availableCopies -= 1;
      await book.save();
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
