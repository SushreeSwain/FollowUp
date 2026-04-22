import express from 'express';
import Client from '../models/Client.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all clients
router.get('/', authMiddleware, async (req, res) => {
  try {
    const clients = await Client.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH client
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const query = req.query.query;

    const clients = await Client.find({
      userId: req.user.userId,
      name: { $regex: query, $options: 'i' },
    });

    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET client by ID (FIXED)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (client.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD new client
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, contactInfo, info } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const client = new Client({
      name,
      contactInfo,
      info,
      userId: req.user.userId,
    });

    const savedClient = await client.save();

    res.status(201).json(savedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE client (FIXED)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (client.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE client (FIXED)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (client.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Client.findByIdAndDelete(req.params.id);

    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;