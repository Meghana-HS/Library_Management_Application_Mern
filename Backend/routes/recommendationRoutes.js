// Backend/routes/recommendationRoutes.js
import express from "express";
import  authMiddleware  from "../middleware/authMiddleware.js";
import {
  getUserRecommendations,
  getBookRecommendations,
} from "../controllers/recommendationController.js";

const router = express.Router();

// must be logged in to use
router.get("/for-user", authMiddleware, getUserRecommendations);

// can be public or protected, your choice
router.get("/for-book/:bookId", authMiddleware, getBookRecommendations);

export default router;
