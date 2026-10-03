import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Layers, Maximize2, Minimize2, Target, Navigation, ZoomIn, ZoomOut, Fullscreen, RotateCcw } from '@lucide/react';
import { getSafeValue } from '../../utils/formatters';

export default function GeospatialView({ parcel, measuredArea, setMeasuredArea }) {
  const mapContainerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const latitude = parcel.location?.latitude;
  const longitude = parcel.location?.longitude;
  const boundaryCoordinates = parcel.location?.boundaryCoordinates;

  useEffect(() => {
    const initMap = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMapLoaded(true);
      } catch (err) {
        console.error('Map load error:', err);
        setMapError(true);
      }
    };

    if (latitude && longitude) {
      initMap();
    } else {
      setMapError(true);
    }
  }, [latitude, longitude]);

  const handleMapClick = (e) => {
    if (!measuredArea) return;
    console.log('Map clicked for measurement at:', e.clientX, e.clientY);
  };

  if (mapError || !latitude || !longitude) {
    return (
      <div className="h-[600px] lg:h-[700px] rounded-2xl bg-zinc-900/40 border border-white/10 p-6 backdrop-blur-xl relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        <div className="h-full flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-zinc-500" />
            </div>
            <h3 className="text-lg font-normal text-white mb-2">Geospatial View Unavailable</h3>
            <p className="text-zinc-400 mb-4">
              {latitude && longitude ? 'Unable to load geospatial data. Please try again.' : 'No coordinates available for this parcel.'}
            </p>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 mt-4 max-w-md mx-auto">
              <p className="text-xs text-zinc-500 mb-2">Parcel Coordinates:</p>
              <p className="font-mono text-sm text-zinc-400">
                {latitude && longitude ? `${latitude}, ${longitude}` : 'Coordinates not available'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] lg:h-[700px] rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Geospatial View</h3>
            <p className="text-[11px] text-zinc-400">Google Earth Integration</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div ref={null} className="absolute inset-0">
        {/* Simulated Google Earth View */}
        <div className="absolute inset-0 relative">
          {/* Simulated satellite imagery background */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-emerald-900/20 to-zinc-900" />

          {/* Grid overlay to simulate satellite imagery */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />

          {/* Simulated parcel boundary polygon */}
          {boundaryCoordinates && boundaryCoordinates.length >= 3 && (
            <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon
                points={boundaryCoordinates.map((coord, i) =>
                  `${((coord.lat - (latitude - 0.01)) / 0.02) * 100}% ${((coord.lng - (longitude - 0.01)) / 0.02) * 100}%`
                ).join(' ')}
                fill="rgba(16, 185, 129, 0.2)"
                stroke="#10B981"
                strokeWidth="0.5"
                strokeDasharray="5,3"
              />
            </svg>
          )

          {/* Center marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-lg" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] text-emerald-400 font-mono font-medium whitespace-nowrap">
              Parcel Center
            </div>
          </div>

          {/* Boundary coordinates display */}
          {boundaryCoordinates && boundaryCoordinates.length >= 3 && (
            <div className="absolute bottom-4 left-4 right-4 max-w-md mx-auto bg-black/80 backdrop-blur-xl rounded-xl p-3 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Parcel Boundary</span>
                <span className="text-[10px] text-zinc-400">{boundaryCoordinates.length} vertices</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px] text-zinc-400">
                {boundaryCoordinates.slice(0, 4).map((coord, i) => (
                  <div key={i} className="flex justify-between">
                    <span>Vertex {i + 1}:</span>
                    <span className="font-mono text-white">{coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}</span>
                  </div>
                )}
                {boundaryCoordinates.length > 4 && (
                  <span className="text-[10px] text-zinc-500">+ {boundaryCoordinates.length - 4} more vertices</span>
                )
              }
            </div>
          )

          {/* Center coordinates display */}
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xl rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span className="text-zinc-400">Center:</span>
              <span className="font-mono text-white">{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            <button
              className="p-2 rounded-xl bg-white/10 hover:bg-white/10 text-white transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-5" />
            </button>
            <button
              className="p-2 rounded-xl bg-white/10 hover:bg-white/10 text-white transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-xl bg-white/10 hover:bg-white/10 text-white transition-colors"
              aria-label="Reset view"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Layer Controls */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-black/80 backdrop-blur-xl rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Layers</span>
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-3 h-3 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500" />
                  <span>Parcel Boundary</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-3 h-3 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500" />
                  <span>Satellite Imagery</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input type="checkbox" className="w-3 h-3 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500" />
                  <span>Cadastral Overlay</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input type="checkbox" className="w-3 h-3 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500" />
                  <span>Road Network</span>
                </label>
              </div>
            </div>

            {/* Parcel Info Card */}
            <div className="absolute top-4 right-4 w-56 bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Parcel Location</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Latitude</span>
                  <span className="font-mono text-white">{latitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Longitude</span>
                  <span className="font-mono text-white">{longitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Boundary Points</span>
                  <span className="font-mono text-white">{boundaryCoordinates?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Fullscreen overlay */}
            {isFullscreen && (
              <div className="absolute inset-0 z-50 fixed bg-black/95 backdrop-blur-sm">
                <div className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/10 text-white transition-colors" onClick={() => setIsFullscreen(false)}>
                  <Minimize2 className="w-6 h-6" />
                </div>
                <div className="absolute top-4 left-4 p-2">
                  <button className="p-2 rounded-xl bg-white/10 hover:bg-white/10 text-white transition-colors" onClick={() => setIsFullscreen(false)}>
                    <Minimize2 className="w-6 h-6" />
                  </button>
                </div>
                <div className="h-full w-full flex items-center justify-center">
                  <div className="w-full h-full max-w-4xl max-h-[90vh] rounded-xl overflow-hidden">
                    <GeospatialView parcel={parcel} measuredArea={measuredArea} setMeasuredArea={setMeasuredArea} />
                  </div>
                </div>
              </div>
            );
          }