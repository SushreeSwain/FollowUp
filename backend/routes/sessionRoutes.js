import express from 'express';
import Session from '../models/Sessions.js';

const router = express.Router();


// ✅ GET sessions by clientId
router.get('/client/:clientId', async (req, res) => {
  try {
    const sessions = await Session.find({
      clientId: req.params.clientId,
    }).sort({ date: -1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET single session
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ CREATE session
router.post('/', async (req, res) => {
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
    });

    const saved = await session.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ UPDATE session
router.put('/:id', async (req, res) => {
  try {
    const updated = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE session
router.delete('/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;