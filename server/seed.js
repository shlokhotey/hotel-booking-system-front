/**
 * One-time seed script — populates the Hotel collection from the frontend mockData.
 * Run with: node server/seed.js
 * Requires MONGO_URI to be set in server/.env
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');

const mockHotels = [
  {
    id: 'h1',
    name: 'Radisson Blu Hotel Nagpur',
    location: 'Wardha Road, Nagpur',
    rating: 5,
    reviews: 2450,
    description: 'A premium luxury hotel offering modern architecture, a lavish outdoor pool, health club, and 5 distinct dining options.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    amenities: ['Free WiFi', 'Outdoor Pool', 'Spa & Wellness', 'Fitness Center', 'Multiple Restaurants', 'Valet Parking'],
    rooms: [
      { id: 'h1_1', type: 'Superior Room', price: 7500, capacity: 2, description: 'Standard luxury room with pool views.', available: true, amenities: ['WiFi', 'AC', 'Mini Bar'], imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
      { id: 'h1_2', type: 'Business Class Room', price: 10500, capacity: 2, description: 'Access to the executive lounge.', available: true, amenities: ['WiFi', 'Lounge Access', 'Breakfast'], imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800' },
      { id: 'h1_3', type: 'Executive Suite', price: 18500, capacity: 3, description: 'Spacious suite with skyline views.', available: true, amenities: ['Living Room', 'Bathtub', 'Skyline View'], imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800' },
      { id: 'h1_4', type: 'Family Premium Room', price: 14000, capacity: 4, description: 'Two interconnected rooms for families.', available: true, amenities: ['Interconnected', 'Kids Kit', 'WiFi'], imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800' },
    ],
  },
  {
    id: 'h2',
    name: 'Le Méridien Nagpur',
    location: 'Wardha Road, Nagpur',
    rating: 5,
    reviews: 1820,
    description: 'Sumptuous comfort defines this sanctuary. Features a sun-drenched outdoor pool and sophisticated interiors.',
    imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Bar/Lounge', 'Airport Shuttle'],
    rooms: [
      { id: 'h2_1', type: 'Classic Room', price: 6500, capacity: 2, description: 'Elegant room with modern art.', available: true, amenities: ['WiFi', 'AC', 'Art Decor'], imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80' },
      { id: 'h2_2', type: 'Club Room', price: 9500, capacity: 2, description: 'Pool view with club lounge benefits.', available: true, amenities: ['Club Access', 'Pool View', 'WiFi'], imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800' },
      { id: 'h2_3', type: 'Le Méridien Suite', price: 21000, capacity: 4, description: 'Premium suite with a deep soaking tub.', available: true, amenities: ['Soaking Tub', 'Butler Service', 'VIP'], imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800' },
    ],
  },
  {
    id: 'h3',
    name: 'Hotel Centre Point',
    location: 'Ramdaspeth, Nagpur',
    rating: 4,
    reviews: 950,
    description: 'An upscale stay blending warmth and elegance in the heart of the city.',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    amenities: ['Free WiFi', 'Restaurant', 'Gym', 'Banquet Hall'],
    rooms: [
      { id: 'h3_1', type: 'Standard Room', price: 4500, capacity: 2, description: 'Comfortable room for business or leisure.', available: true, amenities: ['WiFi', 'TV', 'Desk'], imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },
      { id: 'h3_2', type: 'Executive Room', price: 6200, capacity: 2, description: 'Modern decor with extra desk space.', available: true, amenities: ['WiFi', 'Mini Bar', 'Coffee'], imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800' },
      { id: 'h3_3', type: 'Family Suite', price: 9800, capacity: 4, description: 'Dedicated kids corner and large beds.', available: true, amenities: ['Kids Corner', 'WiFi', 'Large Bed'], imageUrl: 'https://images.unsplash.com/photo-1566115327231-6111483a67fb?auto=format&fit=crop&q=80&w=800' },
    ],
  },
  {
    id: 'h4',
    name: 'The Pride Hotel Nagpur',
    location: 'Sonegaon, Nagpur',
    rating: 4,
    reviews: 1100,
    description: 'Experience serene luxury near the airport with a health club and indoor pool.',
    imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    amenities: ['Free WiFi', 'Indoor Pool', 'Fitness Center', 'Spa'],
    rooms: [
      { id: 'h4_1', type: 'Deluxe Room', price: 4000, capacity: 2, description: 'Modern room near the airport.', available: true, amenities: ['WiFi', 'Pool View', 'AC'], imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'h4_2', type: 'Executive Suite', price: 9500, capacity: 3, description: 'Separate meeting space and parlor.', available: true, amenities: ['Meeting Space', 'Parlor', 'WiFi'], imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800' },
    ],
  },
  {
    id: 'h5',
    name: 'Ginger Nagpur City Center',
    location: 'Sitabuldi, Nagpur',
    rating: 3,
    reviews: 750,
    description: 'A smart, budget-friendly hotel offering essential modern comforts in a vibrant setting.',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    amenities: ['Free WiFi', 'Air Conditioning', 'In-house Dining'],
    rooms: [
      { id: 'h5_1', type: 'Standard Room', price: 2800, capacity: 2, description: 'Budget stay with all essentials.', available: true, amenities: ['WiFi', 'AC', 'Safe'], imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'h5_2', type: 'Family Standard', price: 4900, capacity: 4, description: 'Cost-effective for small families.', available: true, amenities: ['WiFi', 'AC', 'Sofa Bed'], imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800' },
    ],
  },
  {
    id: 'h6',
    name: 'Treebo Trend The Pavilion',
    location: 'Mohan Nagar, Nagpur',
    rating: 3,
    reviews: 420,
    description: 'A highly-rated budget stay focusing on cleanliness and comfort near the railway station.',
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    amenities: ['Free WiFi', 'Breakfast Included', 'Restaurant'],
    rooms: [
      { id: 'h6_1', type: 'Oak (Standard)', price: 1800, capacity: 2, description: 'Simple and clean budget room.', available: true, amenities: ['WiFi', 'Breakfast', 'AC'], imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'h6_2', type: 'Mahogany (Premium Family)', price: 3800, capacity: 4, description: 'Largest rooms for groups of four.', available: true, amenities: ['WiFi', 'Breakfast', 'AC', 'Water'], imageUrl: 'https://images.unsplash.com/photo-1576675784432-994941412b3d?auto=format&fit=crop&q=80&w=800' },
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await Hotel.deleteMany({});
  await Hotel.insertMany(mockHotels);
  console.log(`Seeded ${mockHotels.length} hotels`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
