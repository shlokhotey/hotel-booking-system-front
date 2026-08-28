import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { csvHotelsApi } from '../lib/api.js';
import { Search, Star, MapPin, Phone, Globe, ChevronLeft, ChevronRight, X, Map } from 'lucide-react';
import HotelMap from './HotelMap.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert "FourStar" → 4 */
function ratingToStars(str) {
  const map = { onestar: 1, twostar: 2, threestar: 3, fourstar: 4, fivestar: 5 };
  return map[(str || '').toLowerCase().replace(/\s/g, '')] || 0;
}

/** Return a stable Unsplash placeholder keyed to the hotel name. */
function placeholderImage(name) {
  const keywords = ['hotel', 'resort', 'lobby', 'travel', 'architecture'];
  const idx = (name || '').length % keywords.length;
  return `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=60`;
}

// ── Star renderer ─────────────────────────────────────────────────────────────

function StarRating({ count }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3 h-3 ${n <= count ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
        />
      ))}
    </span>
  );
}

// ── Single hotel card ─────────────────────────────────────────────────────────

function CsvHotelCard({ hotel }) {
  const stars = ratingToStars(hotel.hotelRating);
  const facilities = hotel.hotelFacilities
    ? hotel.hotelFacilities.split(/\s{2,}|\t/).filter(Boolean).slice(0, 5)
    : [];

  return (
    <article className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-gray-100 flex-shrink-0">
        <img
          src={placeholderImage(hotel.hotelName)}
          alt={hotel.hotelName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {stars > 0 && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-0.5">
            <StarRating count={stars} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
            {hotel.hotelName}
          </h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">
              {[hotel.cityName, hotel.countyName].filter(Boolean).join(', ')}
            </span>
          </p>
          {hotel.address && (
            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{hotel.address}</p>
          )}
        </div>

        {hotel.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
            {hotel.description}
          </p>
        )}

        {facilities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {facilities.map((f, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wide"
              >
                {f.length > 22 ? f.slice(0, 22) + '…' : f}
              </span>
            ))}
          </div>
        )}

        {/* Footer links */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-[11px] text-gray-400 gap-2">
          {hotel.phoneNumber && (
            <span className="flex items-center gap-1 truncate">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{hotel.phoneNumber}</span>
            </span>
          )}
          {hotel.hotelWebsiteUrl && (
            <a
              href={hotel.hotelWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 hover:text-blue-700 ml-auto flex-shrink-0"
            >
              <Globe className="w-3 h-3" />
              <span>Website</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const STAR_OPTIONS = [
  { label: '5 Star', value: '5' },
  { label: '4 Star', value: '4' },
  { label: '3 Star', value: '3' },
  { label: '2 Star', value: '2' },
  { label: '1 Star', value: '1' },
];

export default function HotelExplorer() {
  const [query,       setQuery]       = useState('');
  const [country,     setCountry]     = useState('');
  const [city,        setCity]        = useState('');
  const [starFilter,  setStarFilter]  = useState([]);
  const [page,        setPage]        = useState(1);
  const [result,      setResult]      = useState({ hotels: [], total: 0, totalPages: 0 });
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [showMap,     setShowMap]     = useState(false);

  // Debounce input: only fire API after 400 ms of silence
  const debounceRef = useRef(null);

  const fetchHotels = useCallback((params) => {
    setLoading(true);
    setError('');
    csvHotelsApi
      .getAll(params)
      .then((data) => setResult(data))
      .catch(() => setError('Could not load hotels. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  // Re-fetch whenever filters / page change (with debounce on text fields)
  useEffect(() => {
    const params = {
      q:       query.trim(),
      country: country.trim(),
      city:    city.trim(),
      rating:  starFilter.join(','),
      page,
      limit:   12,
    };
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchHotels(params), 400);
    return () => clearTimeout(debounceRef.current);
  }, [query, country, city, starFilter, page, fetchHotels]);

  // Reset page to 1 when filters change
  const handleFilterChange = (setter) => (value) => {
    setPage(1);
    setter(value);
  };

  const toggleStar = (v) =>
    handleFilterChange(setStarFilter)(
      starFilter.includes(v) ? starFilter.filter((s) => s !== v) : [...starFilter, v]
    );

  const clearFilters = () => {
    setQuery('');
    setCountry('');
    setCity('');
    setStarFilter([]);
    setPage(1);
  };

  const hasActiveFilters = query || country || city || starFilter.length;

  /**
   * Parse the "lat|lng" map field from CSV hotel records into numeric coords.
   * Hotels without a valid map field are silently excluded from map markers.
   */
  const mapMarkers = useMemo(() =>
    result.hotels
      .map((h) => {
        if (!h.map) return null;
        const parts = h.map.split('|');
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (!isFinite(lat) || !isFinite(lng)) return null;
        return {
          id:       h.hotelCode,
          name:     h.hotelName,
          location: [h.cityName, h.countyName].filter(Boolean).join(', '),
          lat,
          lng,
        };
      })
      .filter(Boolean),
  [result.hotels]);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-8">

      {/* ── Page heading ── */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Explore Hotels Worldwide
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browsing {result.total.toLocaleString()} properties from our global dataset
          </p>
        </div>
        <button
          onClick={() => setShowMap((v) => !v)}
          className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg border transition-colors flex-shrink-0 ${
            showMap
              ? 'bg-brand-primary text-white border-brand-primary'
              : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary'
          }`}
        >
          <Map className="w-4 h-4" />
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>

      {/* ── Filters row ── */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 shadow-sm flex flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search hotel name, city or country…"
            value={query}
            onChange={(e) => handleFilterChange(setQuery)(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Country */}
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => handleFilterChange(setCountry)(e.target.value)}
          className="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* City */}
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => handleFilterChange(setCity)(e.target.value)}
          className="w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* Star filters */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {STAR_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => toggleStar(value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                starFilter.includes(value)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors ml-auto"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* ── Status / error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* ── Map panel ── */}
      {showMap && (
        <div className="mb-6">
          {mapMarkers.length > 0 ? (
            <HotelMap hotels={mapMarkers} height="420px" />
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center h-32 text-sm text-gray-400">
              <MapPin className="w-4 h-4 mr-2 opacity-50" />
              No location data available for the current results.
            </div>
          )}
        </div>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : result.hotels.length === 0 && !error ? (
        <div className="text-center py-24 text-gray-400">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-gray-500">No hotels match your filters.</p>
          <p className="text-sm mt-1">Try broadening your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {result.hotels.map((h) => (
            <CsvHotelCard key={h.hotelCode} hotel={h} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-blue-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span className="text-sm text-gray-500 font-medium">
            Page {page} of {result.totalPages.toLocaleString()}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
            disabled={page === result.totalPages}
            className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-blue-300 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
