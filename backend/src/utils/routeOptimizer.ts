import { calculateDistance, GPSCoordinates } from './gps';

export interface StartPoint {
  lat: number;
  lng: number;
}

export interface DeliveryLocation {
  lat: number;
  lng: number;
}

export interface DeliveryOrder {
  orderId: string;
  address: string;
  location?: DeliveryLocation;
  gps?: GPSCoordinates;
  [key: string]: any;
}

export interface DeliveryRoute {
  distance_totale_km: number;
  ordre_livraisons: Array<{
    orderId: string;
    lat: number;
    lng: number;
    address: string;
    distanceFromStart?: number;
  }>;
}

export type OptimizedRoutes = Record<string, DeliveryRoute>;

function getCoordinates(order: DeliveryOrder): DeliveryLocation | null {
  if (order.location && typeof order.location.lat === 'number' && typeof order.location.lng === 'number') {
    return order.location;
  }

  if (order.gps && typeof order.gps.lat === 'number' && typeof order.gps.lng === 'number') {
    return { lat: order.gps.lat, lng: order.gps.lng };
  }

  return null;
}

export function haversineDistance(pointA: DeliveryLocation, pointB: DeliveryLocation): number {
  return calculateDistance(pointA.lat, pointA.lng, pointB.lat, pointB.lng);
}

function sortOrdersClosestFirst(orders: DeliveryOrder[], startPoint: StartPoint) {
  return orders
    .map((order) => {
      const coords = getCoordinates(order);
      return coords
        ? {
            ...order,
            coords,
            distanceFromStart: haversineDistance(startPoint, coords)
          }
        : null;
    })
    .filter((entry): entry is DeliveryOrder & { coords: DeliveryLocation; distanceFromStart: number } => Boolean(entry))
    .sort((a, b) => a.distanceFromStart - b.distanceFromStart);
}

function splitIntoBalancedChunks<T>(items: T[], numberOfChunks: number): T[][] {
  if (numberOfChunks <= 1) return [items];

  const chunkSize = Math.ceil(items.length / numberOfChunks);
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }

  while (chunks.length < numberOfChunks) {
    chunks.push([]);
  }

  return chunks.slice(0, numberOfChunks);
}

function computeRouteDistance(start: StartPoint, stops: Array<{ lat: number; lng: number }>): number {
  if (!stops.length) return 0;

  let total = haversineDistance(start, stops[0]);

  for (let i = 0; i < stops.length - 1; i++) {
    total += haversineDistance(stops[i], stops[i + 1]);
  }

  return parseFloat(total.toFixed(2));
}

export function optimizeRoutes(
  orders: DeliveryOrder[],
  startPoint: StartPoint,
  numberOfDrivers: number
): OptimizedRoutes {
  const safeDriverCount = Math.max(1, Math.floor(numberOfDrivers));
  const sortedOrders = sortOrdersClosestFirst(orders, startPoint);
  const chunks = splitIntoBalancedChunks(sortedOrders, safeDriverCount);

  const routes: OptimizedRoutes = {};

  chunks.forEach((chunk, index) => {
    const stops = chunk.map(({ coords, address, orderId, distanceFromStart }) => ({
      orderId,
      lat: coords.lat,
      lng: coords.lng,
      address,
      distanceFromStart
    }));

    const totalDistanceKm = computeRouteDistance(startPoint, stops);

    routes[`livreur_${index + 1}`] = {
      distance_totale_km: totalDistanceKm,
      ordre_livraisons: stops
    };
  });

  return routes;
}

export const exampleOrders: DeliveryOrder[] = [
  { orderId: 'CMD-001', address: '10 Rue des Fleurs', location: { lat: 48.857, lng: 2.351 } },
  { orderId: 'CMD-002', address: '22 Avenue de Paris', location: { lat: 48.866, lng: 2.322 } },
  { orderId: 'CMD-003', address: '5 Boulevard Victor', location: { lat: 48.833, lng: 2.275 } },
  { orderId: 'CMD-004', address: '18 Rue de Lyon', location: { lat: 48.846, lng: 2.372 } },
  { orderId: 'CMD-005', address: '7 Quai Voltaire', location: { lat: 48.860, lng: 2.327 } }
];

export const exampleStartPoint: StartPoint = { lat: 48.8566, lng: 2.3522 };

export function exampleTwoDriverRun() {
  return optimizeRoutes(exampleOrders, exampleStartPoint, 2);
}

/*
Exemple d'utilisation (2 livreurs) :

const routes = optimizeRoutes(exampleOrders, exampleStartPoint, 2);
console.log(JSON.stringify(routes, null, 2));

Sortie attendue :
{
  "livreur_1": {
    "distance_totale_km": 3.42,
    "ordre_livraisons": [
      { "orderId": "CMD-001", "lat": 48.857, "lng": 2.351, "address": "10 Rue des Fleurs", "distanceFromStart": 0.05 },
      { "orderId": "CMD-004", "lat": 48.846, "lng": 2.372, "address": "18 Rue de Lyon", "distanceFromStart": 2.13 },
      { "orderId": "CMD-003", "lat": 48.833, "lng": 2.275, "address": "5 Boulevard Victor", "distanceFromStart": 6.17 }
    ]
  },
  "livreur_2": {
    "distance_totale_km": 1.2,
    "ordre_livraisons": [
      { "orderId": "CMD-002", "lat": 48.866, "lng": 2.322, "address": "22 Avenue de Paris", "distanceFromStart": 2.31 },
      { "orderId": "CMD-005", "lat": 48.86, "lng": 2.327, "address": "7 Quai Voltaire", "distanceFromStart": 1.93 }
    ]
  }
}
*/
