const express = require('express');
const Hotel = require('../models/Hotel');

const router = express.Router();

// GET /api/hotels — list all hotels (optionally filter by ?destination=)
router.get('/', async (req, res) => {
  try {
    const { destination } = req.query;
    const query = destination
      ? { $or: [
          { name: { $regex: destination, $options: 'i' } },
          { location: { $regex: destination, $options: 'i' } },
        ] }
      : {};
    const hotels = await Hotel.find(query);
    res.json(hotels);
  } catch (err) {
    console.error('GET /hotels error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/hotels/:id
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ id: req.params.id });
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/hotels/:hotelId/rooms/:roomId/availability
// Body: { available: boolean }
router.put('/:hotelId/rooms/:roomId/availability', async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ id: req.params.hotelId });
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    const room = hotel.rooms.find((r) => r.id === req.params.roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    room.available = req.body.available;
    await hotel.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/', (_req, res) => {
  res.send('API is running');
});

module.exports = router;
