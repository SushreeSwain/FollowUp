import express from 'express';
import Session from '../models/Sessions.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ CREATE session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { clientId, date, title, notes, amount, isPaid} = req.body;

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
      amount: amount || 0,
      isPaid: isPaid || false,
      userId: req.user.userId,
    });

    const saved = await session.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 SEARCH session
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

// ✅ GET sessions by clientId (SAFE)
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

// ✅ GET single session (FIXED)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE session (FIXED)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { date, title, notes, amount, isPaid } = req.body;

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await Session.findByIdAndUpdate(
      req.params.id,
      {
        ...(date && { date }),
        ...(title !== undefined && { title }),
        ...(notes !== undefined && { notes }),
        ...(amount !== undefined && { amount }),
        ...(isPaid !== undefined && { isPaid }),
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE session (FIXED)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Session.findByIdAndDelete(req.params.id);

    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;