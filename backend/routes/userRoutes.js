import express from 'express';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Session from '../models/Sessions.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// DELETE ACCOUNT
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. delete sessions
    await Session.deleteMany({ userId });

    // 2. delete clients
    await Client.deleteMany({ userId });

    // 3. delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;