import React, { useEffect, useState } from 'react';
import { GoogleMap, DrawingManagerF, useJsApiLoader, Polygon } from '@react-google-maps/api';
import {
  INeighborhood,
  NeighborhoodAPI,
  NeighborhoodQuery,
  NeighborhoodResponse,
} from '@/utils/api/neighborhood.api';

interface LatLng {
  lat: number;
  lng: number;
}

interface PropsType {
  setMapCoordinates: (coords: [number, number][]) => void;
  updateData: INeighborhood | undefined;
}

const GeoFenceComponent = ({ setMapCoordinates, updateData }: PropsType) => {
  const [drawingEnabled, setDrawingEnabled] = useState<boolean>(true);
  const [drawingMode, setDrawingMode] = useState<google.maps.drawing.OverlayType | null>();
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodResponse>();
  const [polygons, setPolygons] = useState<
    { id: number; isActive: boolean; paths: { lat: number; lng: number }[] }[] | undefined
  >(undefined);
  const [mapCenter, setMapCenter] = useState<LatLng>(
    updateData
      ? { lat: updateData.center.coordinates[1], lng: updateData.center.coordinates[0] }
      : { lat: 38.9072, lng: -77.0369 },
  ); // Washington, D.C.

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY || '',
    libraries: ['geometry', 'drawing', 'places'],
  });

  const fetchNeighborhood = async (query?: NeighborhoodQuery) => {
    try {
      const res = await NeighborhoodAPI.getAll(query);
      if (res.status) {
        setNeighborhoods(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  function convertNeighborhoods(response: NeighborhoodResponse) {
    return response.data.map((n) => ({
      id: n.id,
      name: n.name,
      isActive: n.isActive,
      paths: n.location.coordinates[0].map(([lng, lat]) => ({
        lat,
        lng,
      })),
    }));
  }

  useEffect(() => {
    if (isLoaded && google.maps?.drawing) {
      setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (neighborhoods) {
      const polygons = convertNeighborhoods(neighborhoods);
      setPolygons(polygons);
    }
  }, [neighborhoods]);

  useEffect(() => {
    fetchNeighborhood();
  }, []);

  const getLatLngArray = (polygon: google.maps.LatLng[]) => {
    if (!polygon) return [];

    const latLngArray: LatLng[] = [];
    if (polygon.length > 0) {
      polygon.forEach((latLng) => {
        latLngArray.push({ lat: latLng.lat(), lng: latLng.lng() });
      });
    }
    return latLngArray;
  };

  const processCoordinates = (coordinates: LatLng[]): [number, number][] => {
    return coordinates.map((coord) => [coord.lat, coord.lng]);
  };

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    const paths = polygon.getPath().getArray();
    const coordinates = getLatLngArray(paths);

    setMapCoordinates(processCoordinates(coordinates));
    setDrawingEnabled(false);
    setDrawingMode(null);

    const path = polygon.getPath();
    path.addListener('set_at', () => onPolygonPathChanged(polygon));
    path.addListener('insert_at', () => onPolygonPathChanged(polygon));
    path.addListener('remove_at', () => onPolygonPathChanged(polygon));

    console.log('polygon, drawingEnabled : ', processCoordinates(coordinates), drawingEnabled);
  };

  const onPolygonPathChanged = (polygon: google.maps.Polygon) => {
    const paths = polygon.getPath().getArray();
    const coordinates = getLatLngArray(paths);
    setMapCoordinates(processCoordinates(coordinates));
  };

  const onPolygonLoad = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath();
    path.addListener('set_at', () => onPolygonPathChanged(polygon));
    path.addListener('insert_at', () => onPolygonPathChanged(polygon));
    path.addListener('remove_at', () => onPolygonPathChanged(polygon));
  };

  return (
    <div>
      {isLoaded ? (
        <div className="ok">
          <GoogleMap
            center={mapCenter}
            zoom={10}
            mapContainerStyle={{
              height: '30rem',
              width: '100%',
              borderRadius: '20px',
            }}
          >
            {/* Existing polygons */}
            {polygons &&
              polygons.map((polygon, index) => {
                const isEditable = updateData?.id === polygon.id;
                if (!isEditable && !polygon.isActive) {
                  return;
                }
                return (
                  <Polygon
                    key={index}
                    paths={polygon.paths}
                    onLoad={isEditable ? onPolygonLoad : undefined}
                    options={{
                      fillColor: isEditable ? '#2196F3' : '#4CAF50',
                      strokeColor: isEditable ? '#2196F3' : '#4CAF50',
                      fillOpacity: 0.4,
                      strokeWeight: 2,
                      clickable: true,
                      editable: isEditable,
                      draggable: isEditable,
                    }}
                  />
                );
              })}
            {/* New polygon */}
            {!updateData && (
              <DrawingManagerF
                drawingMode={drawingMode}
                onPolygonComplete={onPolygonComplete}
                options={{
                  drawingControl: drawingEnabled,
                  drawingControlOptions: {
                    drawingModes: [google.maps.drawing?.OverlayType?.POLYGON],
                  },
                  polygonOptions: {
                    fillColor: `#2196F3`,
                    strokeColor: `#2196F3`,
                    fillOpacity: 0.5,
                    strokeWeight: 2,
                    clickable: true,
                    editable: true,
                    draggable: true,
                    zIndex: 1,
                  },
                }}
              />
            )}
          </GoogleMap>
        </div>
      ) : (
        <div>no map</div>
      )}
    </div>
  );
};

export default GeoFenceComponent;
