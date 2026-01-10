// Backend/routes/requestRoutes.js
import express from 'express';
import {
  createRequest,
  getAllRequests,
  updateRequestStatus,
  getMyRequests,
} from '../controllers/requestController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// student creates request
router.post(
  '/',
  authMiddleware,
  requireRole(['STUDENT']),
  createRequest
);

// student sees own requests
router.get(
  '/mine',
  authMiddleware,
  requireRole(['STUDENT']),
  getMyRequests
);

// librarian views all requests
router.get(
  '/',
  authMiddleware,
  requireRole(['LIBRARIAN', 'ADMIN']),
  getAllRequests
);

// librarian approves / rejects (auto-issue on approve)
router.patch(
  '/:id',
  authMiddleware,
  requireRole(['LIBRARIAN', 'ADMIN']),
  updateRequestStatus
);

export default router;
