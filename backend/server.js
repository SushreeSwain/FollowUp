import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import clientRoutes from './routes/ClientRoutes.js';

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use('/api/clients', clientRoutes);

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

    app.listen(process.env.PORT || 5001, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
  });