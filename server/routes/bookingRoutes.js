const express = require('express');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// All booking routes require authentication
router.use(requireAuth);

// GET /api/bookings — get all bookings for the logged-in user
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ bookedAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('GET /bookings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/bookings — create a new booking
router.post('/', async (req, res) => {
  const { roomId, hotelId, hotelName, roomType, checkIn, checkOut, guests, totalPrice } = req.body;
  if (!roomId || !hotelId || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'roomId, hotelId, checkIn, checkOut are required' });
  }
  try {
    const booking = await Booking.create({
      userId: req.userId,
      roomId,
      hotelId,
      hotelName,
      roomType,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'confirmed',
    });

    // Mark the room as unavailable
    await Hotel.updateOne(
      { id: hotelId, 'rooms.id': roomId },
      { $set: { 'rooms.$.available': false } }
    );

    res.status(201).json(booking);
  } catch (err) {
    console.error('POST /bookings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/bookings/:id/cancel — cancel a booking
router.put('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.userId });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Re-open the room
    await Hotel.updateOne(
      { id: booking.hotelId, 'rooms.id': booking.roomId },
      { $set: { 'rooms.$.available': true } }
    );

    res.json(booking);
  } catch (err) {
    console.error('PUT /bookings/:id/cancel error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/bookings/:id — hard delete (admin / future use)
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
