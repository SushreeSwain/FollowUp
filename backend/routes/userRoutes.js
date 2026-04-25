import express from 'express';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Session from '../models/Sessions.js';
import authMiddleware from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';

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


// UPDATE PASSWORD
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // 1. validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both fields required' });
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(newPassword)) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters and include a number',
      });
    }

    // 2. get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 3. check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    if (currentPassword === newPassword) {
        return res.status(400).json({
            error: 'New password must be different from current password',
        });
    }

    // 4. hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. update
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/reminders', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { enabled } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { remindersEnabled: enabled },
      { new: true }
    );

    res.json({
      message: 'Reminders updated',
      remindersEnabled: user.remindersEnabled,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;