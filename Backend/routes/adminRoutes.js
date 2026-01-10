import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  getApprovedStudents,
  getPendingUsers,
  approveUser,
  rejectUser,
  getAllUsers
} from '../controllers/adminController.js';

const router = express.Router();

// Apply auth middleware only, then specify role per route
router.use(authMiddleware);

// Approved students - allow both ADMIN and LIBRARIAN
router.get('/approved-students', requireRole(['ADMIN', 'LIBRARIAN']), getApprovedStudents);

// Pending users - ADMIN only
router.get('/pending', requireRole(['ADMIN']), getPendingUsers);

// Approve user - ADMIN only
router.post('/approve/:id', requireRole(['ADMIN']), approveUser);

// Reject user - ADMIN only
router.delete('/reject/:id', requireRole(['ADMIN']), rejectUser);

// All users - ADMIN only
router.get('/users', requireRole(['ADMIN']), getAllUsers);

export default router;
