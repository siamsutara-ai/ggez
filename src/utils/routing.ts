/**
 * Real road routing utility using OSRM (Open Source Routing Machine)
 * with robust fallback to realistic road geometry and distance.
 */

export interface RouteGeometry {
  coordinates: [number, number][]; // [lat, lng] array for Leaflet polyline
  distanceKm: number;
  durationMinutes: number;
  isRealRoad: boolean;
}

export async function fetchRealRoadRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<RouteGeometry> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(4000), // 4 second timeout
    });

    if (response.ok) {
      const data = await response.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
        const durationMinutes = Math.max(
          3,
          Math.round(route.duration / 60)
        );

        // Convert geojson [lng, lat] to Leaflet [lat, lng]
        const coordinates: [number, number][] = route.geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]]
        );

        return {
          coordinates,
          distanceKm: Math.max(0.5, distanceKm),
          durationMinutes,
          isRealRoad: true,
        };
      }
    }
  } catch (err) {
    // Fallback if offline or API blocked
  }

  // Fallback calculation using Haversine with road curvature factor (1.28x)
  return createFallbackRoute(startLat, startLng, endLat, endLng);
}

function createFallbackRoute(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): RouteGeometry {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLine = R * c;
  const distanceKm = Math.max(0.5, Math.round(straightLine * 1.28 * 10) / 10);
  const durationMinutes = Math.max(3, Math.round((distanceKm / 45) * 60 + 2));

  // Generate intermediate curved points so line is visually attractive
  const midLat = (lat1 + lat2) / 2 + (lon2 - lon1) * 0.06;
  const midLon = (lon1 + lon2) / 2 + (lat1 - lat2) * 0.06;

  return {
    coordinates: [
      [lat1, lon1],
      [midLat, midLon],
      [lat2, lon2],
    ],
    distanceKm,
    durationMinutes,
    isRealRoad: false,
  };
}

/**
 * Search Thai places/subdistricts using Nominatim
 */
export async function searchThaiLocation(query: string) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&countrycodes=th&limit=5`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'th,en',
      },
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = await res.json();
      return data.map((item: any) => ({
        name: item.display_name.split(',')[0],
        fullName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));
    }
  } catch (e) {
    // ignore
  }
  return [];
}
