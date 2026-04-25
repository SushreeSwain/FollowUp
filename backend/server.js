import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import clientRoutes from './routes/ClientRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import './cron/reminderJob.js';
import { sendEmail } from './utils/sendEmail.js';

sendEmail(
  'yourpersonalemail@gmail.com',
  'Test Email',
  'If you got this, email works 🎉'
);

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use('/api/clients', clientRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// test route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

app.get('/test', (req, res) => {
  res.json({ message: 'API working ✅' });
});

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
  });