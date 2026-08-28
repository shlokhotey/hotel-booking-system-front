import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';

/**
 * HotelMap — reusable MapLibre GL map that plots markers for a list of hotels.
 *
 * Props
 * ─────
 * hotels   {Array}   Array of objects with at minimum { id, name, lat, lng }.
 *                    - lat / lng  are numeric degrees.
 * height   {string}  CSS height string (default "400px").
 * className {string} Extra Tailwind classes for the wrapper div.
 *
 * The map automatically fits its viewport to contain all valid markers.
 * If only one marker is present it zooms to level 13.
 */
export default function HotelMap({ hotels = [], height = '400px', className = '' }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef([]);

  // ── Initialise map once ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      // OpenStreetMap raster tiles — no API key required
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [0, 20],
      zoom: 2,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Re-plot markers whenever hotels prop changes ───────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove stale markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Filter to hotels that carry valid coordinates
    const valid = hotels.filter(
      (h) => typeof h.lat === 'number' && typeof h.lng === 'number'
               && isFinite(h.lat) && isFinite(h.lng)
    );

    if (valid.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();

    valid.forEach((hotel) => {
      const lngLat = [hotel.lng, hotel.lat];

      // Build a custom HTML marker element styled to match the app palette
      const el = document.createElement('div');
      el.style.cssText = [
        'width:30px',
        'height:30px',
        'border-radius:50% 50% 50% 0',
        'transform:rotate(-45deg)',
        'background:#007faf',
        'border:2px solid #fff',
        'box-shadow:0 2px 6px rgba(0,0,0,0.35)',
        'cursor:pointer',
      ].join(';');

      // Popup content
      const popup = new maplibregl.Popup({ offset: 22, closeButton: false, maxWidth: '220px' })
        .setHTML(
          `<div style="font-family:system-ui,sans-serif;padding:4px 2px">
            <p style="margin:0 0 2px;font-weight:700;font-size:13px;color:#191e3b;line-height:1.3">
              ${hotel.name}
            </p>
            ${hotel.location ? `<p style="margin:0;font-size:11px;color:#5e6d77">${hotel.location}</p>` : ''}
          </div>`
        );

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(lngLat)
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend(lngLat);
    });

    // Fit map to bounds — single marker gets a fixed zoom
    const fitOptions = { padding: 60, maxZoom: 15, duration: 600 };
    if (valid.length === 1) {
      map.flyTo({ center: [valid[0].lng, valid[0].lat], zoom: 13, duration: 600 });
    } else {
      // Wait for map to be fully loaded before fitting
      if (map.loaded()) {
        map.fitBounds(bounds, fitOptions);
      } else {
        map.once('load', () => map.fitBounds(bounds, fitOptions));
      }
    }
  }, [hotels]);

  return (
    <div
      className={`rounded-xl overflow-hidden border border-gray-200 shadow-sm ${className}`}
      style={{ height }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
