import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import lectureRoutes from './routes/lectureRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// CORS configuration (allow requests from client app)
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

// Body Parser
app.use(express.json());

// API Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/timetable', timetableRoutes);
app.use('/api/v1/lectures', lectureRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/disputes', disputeRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/submissions', submissionRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `API Endpoint ${req.originalUrl} not found.` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EMU Platform Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/v1/health`);
});
