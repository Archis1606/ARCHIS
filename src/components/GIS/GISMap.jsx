import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Globe,
  Map,
  Target,
  Maximize2,
  Minimize2,
  Ruler,
  Trash2,
  RotateCcw,
  MapPin,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCesium, useParcelBoundary, useMeasurement } from './useCesium';

/**
 * GISMap - Reusable CesiumJS map component for land parcel visualization
 *
 * Features:
 * - Dynamic parcel loading (fly to coordinates)
 * - 2D/3D/Columbus view modes
 * - Parcel boundary polygon display
 * - Measurement tools (distance, area, perimeter)
 * - Camera constraints (prevent excessive zoom out)
 * - Fullscreen support
 * - Clean, professional UI integrated with existing theme
 */
export default function GISMap({
  parcel,
  height = '500px',
  className = '',
  onParcelLoad,
  showControls = true,
  defaultViewMode = '3d',
}) {
  const containerRef = useRef(null);
  const [viewMode, setViewMode] = useState(defaultViewMode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMeasurePanel, setShowMeasurePanel] = useState(false);
  const [measurementMode, setMeasurementMode] = useState('distance');

  // Initialize Cesium with a stable callback reference
  // Initialize Cesium with a stable callback reference
  const handleCesiumReady = useCallback((v) => {
    if (v && v.scene) {
      const modeMap = {
        '3d': Cesium.SceneMode.SCENE3D,
        '2d': Cesium.SceneMode.SCENE2D,
        'columbus': Cesium.SceneMode.COLUMBUS_VIEW,
      };
      v.scene.mode = modeMap[viewMode] || Cesium.SceneMode.SCENE3D;
    }
  }, [viewMode]);

  const {
    viewer,
    cesiumReady,
    error,
    flyToLocation,
    setView,
    zoomIn,
    zoomOut,
    setSceneMode,
  } = useCesium(containerRef, {
    onReady: handleCesiumReady,
  });

  // Parcel boundary management - only when viewer exists
  const parcelBoundary = viewer ? useParcelBoundary(viewer) : {
    addBoundary: () => {},
    addCenterPoint: () => {},
    clearAll: () => {},
  };

  // Measurement tools - only when viewer exists
  const measurement = viewer ? useMeasurement(viewer) : {
    measurements: [],
    isMeasuring: false,
    measurementMode: 'distance',
    setMeasurementMode: () => {},
    startMeasuring: () => {},
    finishMeasuring: () => {},
    clearMeasurements: () => {},
    removeMeasurement: () => {},
  };

  // Sync measurement mode
  useEffect(() => {
    measurement.setMeasurementMode(measurementMode);
  }, [measurementMode, measurement]);

  // React to parcel changes - fly to new location
  useEffect(() => {
    if (!viewer || !parcel?.latitude || !parcel?.longitude) return;

    const { latitude, longitude, boundary, landPin } = parcel;

    // Clear previous parcel data
    parcelBoundary.clearAll();

    // Fly to parcel location
    flyToLocation(longitude, latitude, 1500, 0, -60);

    // Add boundary if available
    if (boundary && boundary.length >= 3) {
      parcelBoundary.addBoundary(boundary, { name: `Parcel: ${landPin}` });
    }

    // Add center point
    parcelBoundary.addCenterPoint(latitude, longitude, landPin || 'Parcel');

    // Notify parent
    if (onParcelLoad) {
      onParcelLoad(parcel);
    }
  }, [parcel, viewer, flyToLocation, parcelBoundary, onParcelLoad]);

  // Sync view mode with Cesium
  useEffect(() => {
    if (viewer) {
      setSceneMode(viewMode);
    }
  }, [viewMode, viewer, setSceneMode]);
  // Handle fullscreen
  useEffect(() => {
    if (isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [isFullscreen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!viewer) return;

      // Escape to exit fullscreen or measurement mode
      if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false);
        if (measurement.isMeasuring) measurement.finishMeasuring();
      }

      // Number keys for view modes
      if (e.key === '1') setViewMode('3d');
      if (e.key === '2') setViewMode('2d');
      if (e.key === '3') setViewMode('columbus');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewer, isFullscreen, measurement.isMeasuring, measurement.finishMeasuring]);

  // Render loading state while Cesium initializes
  if (!viewer) {
    return (
      <div
        className={`rounded-2xl bg-zinc-900/40 border border-white/10 relative overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-900/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white font-medium">
              {!cesiumReady ? 'Loading 3D Globe...' : 'Preparing map...'}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {!cesiumReady ? 'Initializing CesiumJS' : 'Building viewport'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div
        className={`rounded-2xl bg-zinc-900/40 border border-white/10 relative overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Map Unavailable</h3>
            <p className="text-zinc-400 text-sm">Failed to initialize 3D globe: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Map Container */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Control Panel */}
      {showControls && (
        <>
          {/* Header Controls */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">GIS Map</p>
                <p className="text-[10px] text-zinc-400">CesiumJS Interactive Map</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* View Mode Toggle */}
              <div className="flex bg-white/5 rounded-lg p-0.5" role="radiogroup" aria-label="View mode">
                {[
                  { id: '3d', icon: Globe, label: '3D' },
                  { id: '2d', icon: Map, label: '2D' },
                  { id: 'columbus', icon: MapPin, label: '2.5D' },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setViewMode(id)}
                    className={`px-2.5 py-1.5 rounded text-[10px] font-medium transition-all ${
                      viewMode === id
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                    aria-pressed={viewMode === id}
                    title={label}
                  >
                    <Icon className="w-3 h-3" />
                  </button>
                ))}
              </div>

              {/* Locate Parcel Button */}
              {parcel?.latitude && parcel?.longitude && (
                <button
                  onClick={() => flyToLocation(parcel.longitude, parcel.latitude, 1500, 0, -60)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Fly to parcel"
                  title="Fly to Parcel"
                >
                  <Target className="w-4 h-4" />
                </button>
              )}

              {/* Measurement Toggle */}
              <button
                onClick={() => {
                  if (measurement.isMeasuring) {
                    measurement.finishMeasuring();
                    setShowMeasurePanel(false);
                  } else {
                    setShowMeasurePanel(true);
                  }
                }}
                className={`p-2 rounded-lg transition-colors ${
                  measurement.isMeasuring
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                }`}
                aria-label={measurement.isMeasuring ? 'Finish measurement' : 'Start measurement'}
                title={measurement.isMeasuring ? 'Finish Measurement' : 'Measure Distance/Area'}
              >
                <Ruler className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Measurement Panel */}
          {(showMeasurePanel || measurement.isMeasuring) && (
            <div className="absolute top-14 right-3 z-10 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 p-3 min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Measurement</span>
                <button
                  onClick={() => {
                    setShowMeasurePanel(false);
                    if (measurement.isMeasuring) measurement.finishMeasuring();
                  }}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {/* Mode Toggle */}
                <div className="flex bg-white/5 rounded-lg p-0.5" role="radiogroup">
                  {[
                    { id: 'distance', icon: Ruler, label: 'Distance' },
                    { id: 'area', icon: Layers, label: 'Area' },
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setMeasurementMode(id)}
                      className={`flex items-center gap-1 px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                        measurementMode === id
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                      }`}
                      aria-pressed={measurementMode === id}
                    >
                      <Icon className="w-3 h-3" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1">
                  {!measurement.isMeasuring ? (
                    <button
                      onClick={() => measurement.startMeasuring(measurementMode)}
                      className="flex-1 px-2 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-medium transition-colors"
                    >
                      Start Measuring
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          const result = measurement.finishMeasuring();
                          if (result) setShowMeasurePanel(false);
                        }}
                        className="flex-1 px-2 py-1.5 rounded-lg bg-emerald-500 text-black font-medium text-[10px] hover:bg-emerald-400 transition-colors"
                      >
                        Finish
                      </button>
                      <button
                        onClick={() => {
                          measurement.clearMeasurements();
                          setShowMeasurePanel(false);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        title="Cancel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Measurement List */}
                {measurement.measurements.length > 0 && (
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Measurements</p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {measurement.measurements.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between p-1.5 bg-white/5 rounded text-[10px]"
                        >
                          <span className="text-zinc-300">
                            {m.mode === 'distance'
                              ? `${(m.totalDistance / 1000).toFixed(3)} km`
                              : `${(m.area / 10000).toFixed(2)} ha`}
                          </span>
                          <button
                            onClick={() => measurement.removeMeasurement(m.id)}
                            className="p-1 text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={measurement.clearMeasurements}
                        className="w-full px-2 py-1 text-[10px] text-zinc-400 hover:text-white"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}

                {!measurement.isMeasuring && measurement.measurements.length === 0 && (
                  <p className="text-[11px] text-zinc-500 text-center py-2">
                    Click on map to add points
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Coordinate Display */}
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <div className="bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 p-3 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Coordinates</span>
                {parcel?.latitude && parcel?.longitude && (
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {parcel.latitude.toFixed(6)}, {parcel.longitude.toFixed(6)}
                  </span>
                )}
              </div>
              {parcel?.boundary && (
                <p className="text-[10px] text-zinc-500">
                  Boundary: {parcel.boundary.length} vertices
                </p>
              )}
            </div>
          </div>

          {/* Compass/Reset Button */}
          <div className="absolute top-14 right-3 z-10">
            <button
              onClick={() => parcel?.latitude && parcel?.longitude && flyToLocation(parcel.longitude, parcel.latitude, 1500, 0, -60)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Reset view to parcel"
              title="Reset View"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1">
            <button
              onClick={() => zoomIn(500)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Zoom in"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" /></svg>
            </button>
            <button
              onClick={() => zoomOut(500)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Zoom out"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12" /></svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}