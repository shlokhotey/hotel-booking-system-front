const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  description: { type: String, default: '' },
  available: { type: Boolean, default: true },
  amenities: [{ type: String }],
  imageUrl: { type: String, default: '' },
});

const hotelSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    reviews: { type: Number, default: 0 },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    amenities: [{ type: String }],
    rooms: [roomSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hotel', hotelSchema);
