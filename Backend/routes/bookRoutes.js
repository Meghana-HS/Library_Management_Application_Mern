import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  addBook, listBooks, getBook, editBook, deleteBook
} from '../controllers/bookController.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';
const router = express.Router();

// public listing
router.get('/', listBooks);
router.get('/:id', getBook);

// librarian-only CRUD
router.post('/', authMiddleware, requireRole('LIBRARIAN'), uploadSingle('cover'), addBook);
router.put('/:id', authMiddleware, requireRole('LIBRARIAN'), uploadSingle('cover'), editBook);
router.delete('/:id', authMiddleware, requireRole('LIBRARIAN'), deleteBook);

export default router;
