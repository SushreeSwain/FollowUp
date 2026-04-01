import express from 'express';
import Session from '../models/Sessions.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ CREATE session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { clientId, date, title, notes } = req.body;

    if (!clientId || !date) {
      return res.status(400).json({
        error: 'clientId and date are required',
      });
    }

    const session = new Session({
      clientId,
      date,
      title,
      notes,
      userId: req.user.userId, 
    });

    const saved = await session.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 SEARCH session (FIXED: only one + user filtered)
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const query = req.query.query;

    const sessions = await Session.find({
      userId: req.user.userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { notes: { $regex: query, $options: 'i' } },
      ],
    });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET sessions by clientId
router.get('/client/:clientId', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({
      clientId: req.params.clientId,
      userId: req.user.userId,
    }).sort({ date: -1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET single session
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE session
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Session.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE session
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Session.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;