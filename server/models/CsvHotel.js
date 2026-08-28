const mongoose = require('mongoose');

/**
 * Mongoose schema for the hotels imported from hotels.csv.
 * Column names are trimmed (the CSV has a leading space on every header
 * after the first).
 */
const csvHotelSchema = new mongoose.Schema(
  {
    hotelCode:       { type: String, required: true, unique: true, index: true },
    hotelName:       { type: String, required: true },
    countyCode:      { type: String, default: '' },
    countyName:      { type: String, default: '' },
    cityCode:        { type: String, default: '' },
    cityName:        { type: String, default: '' },
    hotelRating:     { type: String, default: '' },  // e.g. "FourStar", "ThreeStar"
    address:         { type: String, default: '' },
    attractions:     { type: String, default: '' },
    description:     { type: String, default: '' },
    faxNumber:       { type: String, default: '' },
    hotelFacilities: { type: String, default: '' },
    // "lat|lng" string stored as-is; split client-side when needed
    map:             { type: String, default: '' },
    phoneNumber:     { type: String, default: '' },
    pinCode:         { type: String, default: '' },
    hotelWebsiteUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

// Text index for full-text search across name / city / description
csvHotelSchema.index({ hotelName: 'text', cityName: 'text', countyName: 'text' });

module.exports = mongoose.model('CsvHotel', csvHotelSchema);
