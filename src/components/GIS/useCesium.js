import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for CesiumJS initialization and viewer management.
 * Provides a reusable way to initialize Cesium and manage the viewer lifecycle.
 */
export function useCesium(containerRef, options = {}) {
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [cesiumReady, setCesiumReady] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const initAttemptedRef = useRef(false);

  // Check for Cesium availability with timeout
  useEffect(() => {
    let timeoutId;
    let checkCount = 0;
    const maxChecks = 100; // 10 seconds max

    const checkCesium = () => {
      checkCount++;
      if (window.Cesium) {
        setCesiumReady(true);
        console.log('Cesium loaded successfully');
      } else if (checkCount >= maxChecks) {
        console.error('Cesium failed to load after 10 seconds');
        if (mountedRef.current) {
          setError('CesiumJS failed to load. Check network connection and CDN availability.');
        }
      } else {
        timeoutId = setTimeout(checkCesium, 100);
      }
    };
    checkCesium();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Initialize Cesium Viewer
  // Initialize Cesium Viewer
  useEffect(() => {
    // Prevent multiple initializations
    if (initAttemptedRef.current) return;
    if (!cesiumReady || !containerRef.current || viewerRef.current) {
      return;
    }

    initAttemptedRef.current = true;

    const initCesium = async () => {
      try {
        const Cesium = window.Cesium;
        // ... (rest of your initialization logic)

        viewerRef.current = newViewer;
        setViewer(newViewer);

        if (options.onReady) {
          options.onReady(newViewer);
        }
      } catch (err) {
        console.error('Cesium initialization error:', err);
        if (mountedRef.current) setError(err.message);
      }
    };

    initCesium();

    return () => {
      mountedRef.current = false;
      initAttemptedRef.current = false;
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying viewer:', e);
        }
        viewerRef.current = null;
        setViewer(null);
      }
    };
  }, [cesiumReady, containerRef]); // Removed volatile 'options' dependency

  // Utility function to fly to a location
  const flyToLocation = useCallback((longitude, latitude, height = 1500, heading = 0, pitch = -60) => {
    if (!viewer) return;

    const Cesium = window.Cesium;
    const destination = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
    const orientation = {
      heading: Cesium.Math.toRadians(heading),
      pitch: Cesium.Math.toRadians(pitch),
      roll: 0.0,
    };
    viewer.camera.flyTo({ destination, orientation, duration: 2 });
  }, [viewer]);

  // Utility function to set camera view directly (no animation)
  const setView = useCallback((longitude, latitude, height = 1500, heading = 0, pitch = -60) => {
    if (!viewer) return;

    const Cesium = window.Cesium;
    const destination = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
    const orientation = {
      heading: Cesium.Math.toRadians(heading),
      pitch: Cesium.Math.toRadians(pitch),
      roll: 0.0,
    };
    viewer.camera.setView({ destination, orientation });
  }, [viewer]);

  // Utility function to zoom in
  const zoomIn = useCallback((amount = 500) => {
    if (!viewer) return;
    viewer.camera.zoomIn(amount);
  }, [viewer]);

  // Utility function to zoom out
  const zoomOut = useCallback((amount = 500) => {
    if (!viewer) return;
    viewer.camera.zoomOut(amount);
  }, [viewer]);

  // Utility function to switch between 2D/3D modes
  const setSceneMode = useCallback((mode) => {
    if (!viewer) return;

    const Cesium = window.Cesium;
    if (mode === '2d') {
      viewer.scene.mode = Cesium.SceneMode.SCENE2D;
    } else if (mode === '3d') {
      viewer.scene.mode = Cesium.SceneMode.SCENE3D;
    } else if (mode === 'columbus') {
      viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
    }
  }, [viewer]);

  // Utility function to add/remove entities
  const addEntity = useCallback((entity) => {
    if (!viewer) return null;
    return viewer.entities.add(entity);
  }, [viewer]);

  const removeEntity = useCallback((entity) => {
    if (!viewer || !entity) return;
    viewer.entities.remove(entity);
  }, [viewer]);

  const removeAllEntities = useCallback(() => {
    if (!viewer) return;
    viewer.entities.removeAll();
  }, [viewer]);

  return {
    viewer,
    cesiumReady,
    error,
    flyToLocation,
    setView,
    zoomIn,
    zoomOut,
    setSceneMode,
    addEntity,
    removeEntity,
    removeAllEntities,
  };
}

/**
 * Hook for managing parcel boundary entities on the map
 */
export function useParcelBoundary(viewer) {
  const boundaryEntityRef = useRef(null);
  const centerPointRef = useRef(null);

  const addBoundary = useCallback((coordinates, options = {}) => {
    if (!viewer || !coordinates || coordinates.length < 3) return;

    const Cesium = window.Cesium;

    // Remove existing boundary
    if (boundaryEntityRef.current) {
      viewer.entities.remove(boundaryEntityRef.current);
    }

    // Create positions array (close the polygon)
    const positions = coordinates.map(c =>
      Cesium.Cartesian3.fromDegrees(c.longitude ?? c.lng, c.latitude ?? c.lat, 0)
    );
    // Close the polygon
    positions.push(Cesium.Cartesian3.fromDegrees(
      coordinates[0].longitude ?? coordinates[0].lng,
      coordinates[0].latitude ?? coordinates[0].lat,
      0
    ));

    const entity = viewer.entities.add({
      name: options.name || 'Parcel Boundary',
      polygon: {
        hierarchy: positions,
        material: Cesium.Color.fromCssColorString(options.fillColor || '#10B981').withAlpha(options.fillAlpha ?? 0.3),
        outline: true,
        outlineColor: Cesium.Color.fromCssColorString(options.outlineColor || '#10B981'),
        outlineWidth: options.outlineWidth ?? 3,
        perPositionHeight: true,
        clampToGround: true,
      },
      polyline: {
        positions: positions,
        width: options.outlineWidth ?? 3,
        material: Cesium.Color.fromCssColorString(options.outlineColor || '#10B981'),
        clampToGround: true,
      },
    });

    boundaryEntityRef.current = entity;
    return entity;
  }, [viewer]);

  const addCenterPoint = useCallback((latitude, longitude, label, options = {}) => {
    if (!viewer) return;

    const Cesium = window.Cesium;

    // Remove existing center point
    if (centerPointRef.current) {
      viewer.entities.remove(centerPointRef.current);
    }

    const entity = viewer.entities.add({
      name: label,
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
      point: {
        pixelSize: options.pixelSize ?? 12,
        color: Cesium.Color.fromCssColorString(options.color || '#10B981'),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
      label: {
        text: label,
        font: options.font || '14pt Ubuntu',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -20),
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString(options.backgroundColor || '#10B981').withAlpha(0.8),
        backgroundPadding: new Cesium.Cartesian2(8, 4),
      },
    });

    centerPointRef.current = entity;
    return entity;
  }, [viewer]);

  const removeBoundary = useCallback(() => {
    if (!viewer) return;
    if (boundaryEntityRef.current) {
      viewer.entities.remove(boundaryEntityRef.current);
      boundaryEntityRef.current = null;
    }
  }, [viewer]);

  const removeCenterPoint = useCallback(() => {
    if (!viewer) return;
    if (centerPointRef.current) {
      viewer.entities.remove(centerPointRef.current);
      centerPointRef.current = null;
    }
  }, [viewer]);

  const clearAll = useCallback(() => {
    removeBoundary();
    removeCenterPoint();
  }, [removeBoundary, removeCenterPoint]);

  return {
    addBoundary,
    addCenterPoint,
    removeBoundary,
    removeCenterPoint,
    clearAll,
    boundaryEntity: boundaryEntityRef.current,
    centerPointEntity: centerPointRef.current,
  };
}

/**
 * Hook for measurement functionality (distance, area, perimeter)
 */
export function useMeasurement(viewer) {
  const [measurements, setMeasurements] = useState([]);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurementMode, setMeasurementMode] = useState('distance'); // 'distance' or 'area'
  const tempPointsRef = useRef([]);
  const tempEntitiesRef = useRef([]);
  const handlerRef = useRef(null);

  const Cesium = window.Cesium;

  // Calculate geodesic distance between two points
  const calculateDistance = useCallback((lon1, lat1, lon2, lat2) => {
    if (!Cesium) return 0;
    const start = Cesium.Cartographic.fromDegrees(lon1, lat1);
    const end = Cesium.Cartographic.fromDegrees(lon2, lat2);
    const distance = Cesium.Ellipsoid.WGS84.geodesicDistance(start, end);
    return distance; // in meters
  }, [Cesium]);

  // Calculate polygon area using geodesic calculations
  const calculateArea = useCallback((coordinates) => {
    if (!Cesium || coordinates.length < 3) return 0;

    const positions = coordinates.map(c =>
      Cesium.Cartographic.fromDegrees(c.longitude ?? c.lng, c.latitude ?? c.lat)
    );

    // Approximate area using planar calculation on WGS84
    let area = 0;
    for (let i = 0; i < positions.length - 1; i++) {
      const p1 = positions[i];
      const p2 = positions[i + 1];
      area += p1.longitude * p2.latitude - p2.longitude * p1.latitude;
    }
    area = Math.abs(area) / 2;

    // Convert from square degrees to square meters (approximate)
    const degreeToMeter = 111320;
    return area * degreeToMeter * degreeToMeter;
  }, [Cesium]);

  const startMeasuring = useCallback((mode = 'distance') => {
    if (!viewer || !Cesium) return;

    setMeasurementMode(mode);
    setIsMeasuring(true);
    tempPointsRef.current = [];
    tempEntitiesRef.current = [];

    // Remove any existing temp entities
    tempEntitiesRef.current.forEach(e => viewer.entities.remove(e));
    tempEntitiesRef.current = [];

    // Add click handler
    handlerRef.current = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handlerRef.current.setInputAction((movement) => {
      if (!isMeasuring) return;

      const cartesian = viewer.scene.pickPosition(movement.position);
      if (!cartesian) return;

      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);

      tempPointsRef.current.push({ longitude, latitude });

      // Add temporary point marker
      const pointEntity = viewer.entities.add({
        position: cartesian,
        point: {
          pixelSize: 10,
          color: Cesium.Color.YELLOW,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
      tempEntitiesRef.current.push(pointEntity);

      // If we have at least 2 points, add line
      if (tempPointsRef.current.length >= 2) {
        const positions = tempPointsRef.current.map(p =>
          Cesium.Cartesian3.fromDegrees(p.longitude, p.latitude, 0)
        );

        const lineEntity = viewer.entities.add({
          polyline: {
            positions,
            width: 3,
            material: Cesium.Color.YELLOW.withAlpha(0.8),
            clampToGround: true,
          },
        });
        tempEntitiesRef.current.push(lineEntity);

        // Calculate and show distance for last segment
        const lastIdx = tempPointsRef.current.length - 1;
        const prevIdx = lastIdx - 1;
        const dist = calculateDistance(
          tempPointsRef.current[prevIdx].longitude,
          tempPointsRef.current[prevIdx].latitude,
          tempPointsRef.current[lastIdx].longitude,
          tempPointsRef.current[lastIdx].latitude
        );

        // Add distance label at midpoint
        const midLon = (tempPointsRef.current[prevIdx].longitude + tempPointsRef.current[lastIdx].longitude) / 2;
        const midLat = (tempPointsRef.current[prevIdx].latitude + tempPointsRef.current[lastIdx].latitude) / 2;

        const labelEntity = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(midLon, midLat, 50),
          label: {
            text: `${dist.toFixed(1)}m`,
            font: '12pt Ubuntu',
            fillColor: Cesium.Color.YELLOW,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
            backgroundPadding: new Cesium.Cartesian2(6, 3),
          },
        });
        tempEntitiesRef.current.push(labelEntity);
      }

      // If area mode and we have 3+ points, show area
      if (mode === 'area' && tempPointsRef.current.length >= 3) {
        const area = calculateArea(tempPointsRef.current);
        const lastPoint = tempPointsRef.current[tempPointsRef.current.length - 1];

        const areaLabel = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(lastPoint.longitude, lastPoint.latitude, 100),
          label: {
            text: `Area: ${(area / 10000).toFixed(2)} ha`,
            font: '12pt Ubuntu',
            fillColor: Cesium.Color.CYAN,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
            backgroundPadding: new Cesium.Cartesian2(6, 3),
          },
        });
        tempEntitiesRef.current.push(areaLabel);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }, [viewer, isMeasuring, calculateDistance, calculateArea]);

  const finishMeasuring = useCallback(() => {
    if (!viewer || !Cesium) return null;

    setIsMeasuring(false);

    if (handlerRef.current) {
      handlerRef.current.destroy();
      handlerRef.current = null;
    }

    if (tempPointsRef.current.length < 2) {
      // Clean up temp entities
      tempEntitiesRef.current.forEach(e => viewer.entities.remove(e));
      tempEntitiesRef.current = [];
      tempPointsRef.current = [];
      return null;
    }

    // Calculate total distance/perimeter
    let totalDistance = 0;
    for (let i = 1; i < tempPointsRef.current.length; i++) {
      totalDistance += calculateDistance(
        tempPointsRef.current[i - 1].longitude,
        tempPointsRef.current[i - 1].latitude,
        tempPointsRef.current[i].longitude,
        tempPointsRef.current[i].latitude
      );
    }

    let area = 0;
    if (measurementMode === 'area' && tempPointsRef.current.length >= 3) {
      // Close the polygon for area calculation
      const closedCoords = [...tempPointsRef.current, tempPointsRef.current[0]];
      area = calculateArea(closedCoords);
      totalDistance += calculateDistance(
        tempPointsRef.current[tempPointsRef.current.length - 1].longitude,
        tempPointsRef.current[tempPointsRef.current.length - 1].latitude,
        tempPointsRef.current[0].longitude,
        tempPointsRef.current[0].latitude
      );
    }

    // Create permanent measurement entity
    const measurement = {
      id: Date.now(),
      mode: measurementMode,
      points: [...tempPointsRef.current],
      totalDistance,
      area,
      timestamp: new Date().toISOString(),
    };

    // Replace temp entities with permanent ones
    tempEntitiesRef.current.forEach(e => viewer.entities.remove(e));
    tempEntitiesRef.current = [];

    // Add permanent polyline
    const positions = tempPointsRef.current.map(p =>
      Cesium.Cartesian3.fromDegrees(p.longitude, p.latitude, 0)
    );

    if (measurementMode === 'area' && tempPointsRef.current.length >= 3) {
      // Close polygon
      positions.push(Cesium.Cartesian3.fromDegrees(
        tempPointsRef.current[0].longitude,
        tempPointsRef.current[0].latitude,
        0
      ));
    }

    const permanentLine = viewer.entities.add({
      polyline: {
        positions,
        width: 3,
        material: measurementMode === 'area' ? Cesium.Color.CYAN.withAlpha(0.6) : Cesium.Color.YELLOW.withAlpha(0.8),
        clampToGround: true,
      },
      polygon: measurementMode === 'area' && tempPointsRef.current.length >= 3 ? {
        hierarchy: positions,
        material: Cesium.Color.CYAN.withAlpha(0.2),
        outline: true,
        outlineColor: Cesium.Color.CYAN,
        outlineWidth: 2,
        clampToGround: true,
      } : undefined,
    });

    measurement.entity = permanentLine;
    setMeasurements(prev => [...prev, measurement]);

    tempPointsRef.current = [];
    tempEntitiesRef.current = [];

    return measurement;
  }, [viewer, Cesium, measurementMode, calculateDistance, calculateArea]);

  const clearMeasurements = useCallback(() => {
    if (!viewer) return;

    // Remove all measurement entities
    measurements.forEach(m => {
      if (m.entity) {
        viewer.entities.remove(m.entity);
      }
    });
    setMeasurements([]);

    // Clear any temp entities
    if (handlerRef.current) {
      handlerRef.current.destroy();
      handlerRef.current = null;
    }
    tempEntitiesRef.current.forEach(e => viewer.entities.remove(e));
    tempEntitiesRef.current = [];
    tempPointsRef.current = [];
    setIsMeasuring(false);
  }, [viewer, measurements]);

  const removeMeasurement = useCallback((id) => {
    if (!viewer) return;

    const measurement = measurements.find(m => m.id === id);
    if (measurement?.entity) {
      viewer.entities.remove(measurement.entity);
    }
    setMeasurements(prev => prev.filter(m => m.id !== id));
  }, [viewer, measurements]);

  return {
    measurements,
    isMeasuring,
    measurementMode,
    setMeasurementMode,
    startMeasuring,
    finishMeasuring,
    clearMeasurements,
    removeMeasurement,
    calculateDistance,
    calculateArea,
  };
}