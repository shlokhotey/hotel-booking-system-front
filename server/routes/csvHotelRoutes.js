const express  = require('express');
const CsvHotel = require('../models/CsvHotel');

const router = express.Router();

/**
 * GET /api/csv-hotels
 * Query params:
 *   q          — free-text search on hotelName / cityName / countyName
 *   country    — filter by countyName (case-insensitive)
 *   city       — filter by cityName (case-insensitive)
 *   rating     — comma-separated star counts, e.g. "4,5"  (mapped from HotelRating text)
 *   page       — 1-based page number (default 1)
 *   limit      — results per page (default 20, max 100)
 */
router.get('/', async (req, res) => {
  try {
    const { q, country, city, rating, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (q) {
      filter.$or = [
        { hotelName:  { $regex: q, $options: 'i' } },
        { cityName:   { $regex: q, $options: 'i' } },
        { countyName: { $regex: q, $options: 'i' } },
        { address:    { $regex: q, $options: 'i' } },
      ];
    }
    if (country) filter.countyName = { $regex: country, $options: 'i' };
    if (city)    filter.cityName   = { $regex: city,    $options: 'i' };

    if (rating) {
      // Map numeric star strings back to HotelRating text values
      const starMap = { '1': 'OneStar', '2': 'TwoStar', '3': 'ThreeStar', '4': 'FourStar', '5': 'FiveStar' };
      const ratings = rating.split(',').map((s) => starMap[s.trim()]).filter(Boolean);
      if (ratings.length) filter.hotelRating = { $in: ratings };
    }

    const pageNum  = Math.max(1, parseInt(page,  10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip     = (pageNum - 1) * pageSize;

    const [hotels, total] = await Promise.all([
      CsvHotel.find(filter)
        .select('-__v -createdAt -updatedAt')
        .skip(skip)
        .limit(pageSize)
        .lean(),
      CsvHotel.countDocuments(filter),
    ]);

    res.json({
      total,
      page: pageNum,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      hotels,
    });
  } catch (err) {
    console.error('GET /api/csv-hotels error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/csv-hotels/:hotelCode
 */
router.get('/:hotelCode', async (req, res) => {
  try {
    const hotel = await CsvHotel.findOne({ hotelCode: req.params.hotelCode }).lean();
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
