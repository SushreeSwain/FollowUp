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


// UPDATE EMAIL
router.put('/email', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { email } = req.body;

    // 1. validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // 2. check duplicate
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // 3. update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email },
      { new: true }
    );

    res.json({
      message: 'Email updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;