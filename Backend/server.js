// Backend/server.js
import dotenv from 'dotenv';
dotenv.config(); // load .env FIRST

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { OAuth2Client } from "google-auth-library";

// DB
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import membershipPlanRoutes from './routes/membershipPlanRoutes.js';
import fineRoutes from './routes/fineRoutes.js';
import membershipRequestRoutes from './routes/membershipRequestRoutes.js';
import emailTestRoutes from './routes/emailTestRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// ✅ NEW: priority request routes
import priorityRequestRoutes from './routes/priorityRequestRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';

// Ensure Admin
import { ensureAdminExists } from './controllers/adminController.js';

const app = express();

// ===== CORS =====
const allowedOrigins = [
  https://6962580c9b1d4b1b9f83b690--starlit-semolina-2b245a.netlify.app,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://your-frontend-domain.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, mobile
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('❌ CORS blocked: Not allowed by server'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ===== Body parsers =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Static folder for uploads =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/membership-plans', membershipPlanRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/membership-requests', membershipRequestRoutes);
app.use('/api/email', emailTestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/recommendations', recommendationRoutes);

// ✅ mount priority queue API
app.use('/api/priority-requests', priorityRequestRoutes);

// Health check
app.get('/', (req, res) => res.send('Library backend running'));

// ===== Start server after DB connects =====
const PORT = process.env.PORT || 8000;

connectDB()
  .then(async () => {
    console.log('DB connected, about to call ensureAdminExists');
    try {
      await ensureAdminExists();
      console.log('ensureAdminExists finished');
    } catch (e) {
      console.error('ensureAdminExists threw error:', e);
    }
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch(err => console.error('❌ Database connection failed:', err));
