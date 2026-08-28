/**
 * One-time seed script — reads /home/stonecold/Downloads/hotels.csv and
 * populates the MongoDB 'csvhotels' collection.
 *
 * Run from the project root:
 *   cd server && node seed-csv.js
 *
 * Or use the npm script:
 *   npm run seed:csv
 *
 * Requires MONGO_URI to be set in server/.env
 *
 * The CSV has ~4.6 M lines. Records are inserted in batches of 500 to keep
 * memory usage low. Duplicate hotelCodes are skipped via ordered:false.
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const fs       = require('fs');
const path     = require('path');
const csv      = require('csv-parser');
const mongoose = require('mongoose');
const CsvHotel = require('./models/CsvHotel');

const CSV_PATH   = '/home/stonecold/Downloads/hotels.csv';
const BATCH_SIZE = 500;

/** Map the CSV's HotelRating strings to a numeric star count (for display). */
function ratingToStars(raw) {
  const map = {
    onestar:   1,
    twostar:   2,
    threestar: 3,
    fourstar:  4,
    fivestar:  5,
  };
  return map[(raw || '').toLowerCase().replace(/\s/g, '')] || 0;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Drop existing CSV-sourced data so re-runs are idempotent
  await CsvHotel.deleteMany({});
  console.log('Cleared existing csvhotels collection');

  let batch   = [];
  let total   = 0;
  let skipped = 0;

  await new Promise((resolve, reject) => {
    const stream = fs.createReadStream(CSV_PATH, { encoding: 'utf8' })
      .pipe(csv({
        // The CSV has a leading space in every header after the first; trim them
        mapHeaders: ({ header }) => header.trim(),
        // Skip rows where HotelCode is missing / blank
        skipLines: 0,
      }));

    stream.on('data', (row) => {
      const code = (row['HotelCode'] || '').trim();
      const name = (row['HotelName'] || '').trim();

      if (!code || !name) {
        skipped++;
        return;
      }

      batch.push({
        hotelCode:       code,
        hotelName:       name,
        countyCode:      (row['countyCode']        || '').trim(),
        countyName:      (row['countyName']         || '').trim(),
        cityCode:        (row['cityCode']           || '').trim(),
        cityName:        (row['cityName']           || '').trim(),
        hotelRating:     (row['HotelRating']        || '').trim(),
        address:         (row['Address']            || '').trim(),
        attractions:     (row['Attractions']        || '').trim(),
        description:     (row['Description']        || '').trim(),
        faxNumber:       (row['FaxNumber']          || '').trim(),
        hotelFacilities: (row['HotelFacilities']    || '').trim(),
        map:             (row['Map']                || '').trim(),
        phoneNumber:     (row['PhoneNumber']        || '').trim(),
        pinCode:         (row['PinCode']            || '').trim(),
        hotelWebsiteUrl: (row['HotelWebsiteUrl']    || '').trim(),
      });

      // Flush batch
      if (batch.length >= BATCH_SIZE) {
        // Pause the stream while we flush
        stream.pause();
        const toInsert = batch.splice(0);
        CsvHotel.insertMany(toInsert, { ordered: false })
          .then((docs) => {
            total += docs.length;
            if (total % 10000 < BATCH_SIZE) {
              process.stdout.write(`\r  Inserted ${total.toLocaleString()} records...`);
            }
            stream.resume();
          })
          .catch((err) => {
            // ordered:false means duplicates are skipped, not thrown
            const inserted = err.result?.nInserted || 0;
            total += inserted;
            stream.resume();
          });
      }
    });

    stream.on('end', () => {
      // Flush remaining batch
      if (batch.length === 0) {
        resolve();
        return;
      }
      CsvHotel.insertMany(batch, { ordered: false })
        .then((docs) => { total += docs.length; resolve(); })
        .catch((err) => {
          total += err.result?.nInserted || 0;
          resolve();
        });
    });

    stream.on('error', reject);
  });

  console.log(`\nDone. Inserted ${total.toLocaleString()} hotels (${skipped} rows skipped).`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
