import express from 'express';
import { sendWelcomeToAll } from '../controllers/emailTestController.js';

const router = express.Router();

router.get('/welcome-all', sendWelcomeToAll);

export default router;
