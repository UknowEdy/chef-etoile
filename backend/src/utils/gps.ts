/**
 * Utilitaire GPS avec algorithme de Haversine
 * Calcule les distances entre coordonnées GPS et optimise les tournées
 */

export interface GPSCoordinates {
  lat: number;
  lng: number;
  timestamp?: Date;
}

/**
 * Convertit des degrés en radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Algorithme de Haversine - Calcule la distance entre deux points GPS
 * @param lat1 Latitude du point 1
 * @param lng1 Longitude du point 1
 * @param lat2 Latitude du point 2
 * @param lng2 Longitude du point 2
 * @returns Distance en kilomètres
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Rayon de la Terre en km

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Valide des coordonnées GPS
 */
export function validateCoordinates(coords: GPSCoordinates): boolean {
  const { lat, lng } = coords;

  // Vérifier que les valeurs sont des nombres valides
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }

  // Vérifier les plages valides
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return false;
  }

  // Vérifier que ce ne sont pas des valeurs nulles
  if (lat === 0 && lng === 0) {
    return false;
  }

  return true;
}

/**
 * Calcule la distance depuis les coordonnées de la cuisine
 */
export function calculateDistanceFromKitchen(
  clientLat: number,
  clientLng: number,
  kitchenLat: number = parseFloat(process.env.KITCHEN_LAT || '6.1256'),
  kitchenLng: number = parseFloat(process.env.KITCHEN_LNG || '1.2229')
): number {
  return calculateDistance(kitchenLat, kitchenLng, clientLat, clientLng);
}

/**
 * Génère un lien Google Maps pour navigation
 */
export function generateMapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Tri des commandes par distance (plus proche en premier)
 */
export interface OrderWithDistance {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  gps?: GPSCoordinates;
  distance?: number;
  deliveryOrder?: number;
  [key: string]: any;
}

export function sortOrdersByDistance(
  orders: OrderWithDistance[],
  kitchenLat?: number,
  kitchenLng?: number
): OrderWithDistance[] {
  const kLat = kitchenLat || parseFloat(process.env.KITCHEN_LAT || '6.1256');
  const kLng = kitchenLng || parseFloat(process.env.KITCHEN_LNG || '1.2229');

  // Filtrer les commandes avec GPS valides
  const ordersWithGPS = orders.filter(
    (order) => order.gps && validateCoordinates(order.gps)
  );

  // Calculer les distances
  const ordersWithDistance = ordersWithGPS.map((order) => ({
    ...order,
    distance: calculateDistance(
      kLat,
      kLng,
      order.gps!.lat,
      order.gps!.lng
    )
  }));

  // Trier par distance (du plus proche au plus loin)
  const sorted = ordersWithDistance.sort((a, b) => {
    const distA = a.distance || Infinity;
    const distB = b.distance || Infinity;
    return distA - distB;
  });

  // Ajouter le numéro d'ordre de livraison
  return sorted.map((order, index) => ({
    ...order,
    deliveryOrder: index + 1
  }));
}

/**
 * Estime le temps de trajet (approximation simple: 30 km/h en moyenne)
 */
export function estimateTravelTime(distanceKm: number): number {
  const avgSpeedKmPerHour = 30; // Vitesse moyenne en ville
  const timeInHours = distanceKm / avgSpeedKmPerHour;
  const timeInMinutes = Math.ceil(timeInHours * 60);
  return timeInMinutes;
}
