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

// GET client by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
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
      userId: req.user.userId, // 🔥 IMPORTANT
    });

    const savedClient = await client.save();

    res.status(201).json(savedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE client
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Client.findOneAndUpdate(
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

// DELETE client
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Client.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;