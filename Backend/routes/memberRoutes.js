// Backend/routes/memberRoutes.js
import express from 'express';
import {
  createMember,
  updateMember,
  deleteMember,
  getMembers,
  getMemberById,
} from '../controllers/memberController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin: manage members (must be logged in + ADMIN)
router.post('/', authMiddleware, adminMiddleware, createMember);
router.put('/:id', authMiddleware, adminMiddleware, updateMember);
router.delete('/:id', authMiddleware, adminMiddleware, deleteMember);

// Staff/admin: view members (any authenticated user)
router.get('/', authMiddleware, getMembers);
router.get('/:id', authMiddleware, getMemberById);

export default router;
