import express from 'express';
import Client from '../models/Client.js';

const router = express.Router();

// GET all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//SEARCH client
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;

    const clients = await Client.find({
      name: { $regex: query, $options: 'i' },
    });

    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD new client
router.post('/', async (req, res) => {
  try {
    const { name, contactInfo, info } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const client = new Client({ name, contactInfo, info });
    const savedClient = await client.save();

    res.status(201).json(savedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE client
router.put('/:id', async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE client
router.delete('/:id', async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;