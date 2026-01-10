// Backend/routes/authRoutes.js
import express from "express";
import { register, login } from "../controllers/authController.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";
import { googleLogin } from "../controllers/googleAuthController.js";

const router = express.Router();

/**
 * REGISTER route
 * - STUDENT → JSON only
 * - LIBRARIAN → multipart/form-data with idProof
 */
router.post(
  "/register",
  (req, res, next) => {
    const contentType = req.headers["content-type"] || "";

    // Multipart → run multer first
    if (contentType.startsWith("multipart/form-data")) {
      return uploadSingle("idProof")(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });
        next();
      });
    }

    // JSON → continue normally
    next();
  },
  register
);

// Email/password login
router.post("/login", login);

// Google register/login (both)
router.post("/google", googleLogin);

export default router;
