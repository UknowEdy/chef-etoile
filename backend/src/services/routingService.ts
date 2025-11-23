import { IUser } from '../models/User.js';
import { calculateDistance } from '../utils/gps.js';

// Coordonnées de la cuisine (point de départ)
const KITCHEN_LAT = parseFloat(process.env.KITCHEN_LAT || '6.1256');
const KITCHEN_LNG = parseFloat(process.env.KITCHEN_LNG || '1.2229');

export interface ClientWithDistance extends Partial<IUser> {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  location: {
    lat: number;
    lng: number;
    updatedAt: Date;
  };
  distanceFromKitchen?: number;
  readyAt?: Date;
}

export interface DeliveryRoute {
  livreurIndex: number;
  clients: ClientWithDistance[];
  totalDistance: number;
  estimatedTime: number;
}

export interface RoutingResult {
  routes: DeliveryRoute[];
  totalClients: number;
  totalDistance: number;
  totalEstimatedTime: number;
}

/**
 * Calcule la distance entre deux points
 */
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return calculateDistance(lat1, lng1, lat2, lng2);
}

/**
 * Algorithme Nearest Neighbor pour optimiser l'ordre de livraison
 * Commence par la cuisine et choisit toujours le client le plus proche
 */
function optimizeRoute(clients: ClientWithDistance[]): ClientWithDistance[] {
  if (clients.length <= 1) return clients;

  const optimized: ClientWithDistance[] = [];
  const remaining = [...clients];

  // Point de départ: cuisine
  let currentLat = KITCHEN_LAT;
  let currentLng = KITCHEN_LNG;

  while (remaining.length > 0) {
    // Trouver le client le plus proche
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const distance = getDistance(
        currentLat,
        currentLng,
        remaining[i].location.lat,
        remaining[i].location.lng
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    // Ajouter le client le plus proche à la route optimisée
    const nearest = remaining.splice(nearestIndex, 1)[0];
    optimized.push(nearest);

    // Mettre à jour la position actuelle
    currentLat = nearest.location.lat;
    currentLng = nearest.location.lng;
  }

  return optimized;
}

/**
 * Clustering géographique simple basé sur la distance
 * Divise les clients en groupes basés sur leur proximité
 */
function clusterClients(clients: ClientWithDistance[], numClusters: number): ClientWithDistance[][] {
  if (clients.length === 0) return [];
  if (numClusters >= clients.length) {
    // Un client par livreur
    return clients.map(c => [c]);
  }

  // Trier les clients par distance depuis la cuisine
  const sortedClients = clients
    .map(client => ({
      ...client,
      distanceFromKitchen: getDistance(
        KITCHEN_LAT,
        KITCHEN_LNG,
        client.location.lat,
        client.location.lng
      )
    }))
    .sort((a, b) => (a.distanceFromKitchen || 0) - (b.distanceFromKitchen || 0));

  // Diviser en clusters équitables
  const clusters: ClientWithDistance[][] = Array.from({ length: numClusters }, () => []);
  const clientsPerCluster = Math.ceil(clients.length / numClusters);

  sortedClients.forEach((client, index) => {
    const clusterIndex = Math.floor(index / clientsPerCluster);
    if (clusterIndex < numClusters) {
      clusters[clusterIndex].push(client);
    } else {
      // S'il y a des clients restants, les ajouter au dernier cluster
      clusters[numClusters - 1].push(client);
    }
  });

  // Retirer les clusters vides
  return clusters.filter(cluster => cluster.length > 0);
}

/**
 * Calcule la distance totale d'une route
 */
function calculateTotalDistance(clients: ClientWithDistance[]): number {
  if (clients.length === 0) return 0;

  let totalDistance = 0;
  let currentLat = KITCHEN_LAT;
  let currentLng = KITCHEN_LNG;

  for (const client of clients) {
    totalDistance += getDistance(
      currentLat,
      currentLng,
      client.location.lat,
      client.location.lng
    );
    currentLat = client.location.lat;
    currentLng = client.location.lng;
  }

  return totalDistance;
}

/**
 * Estime le temps de livraison (30 km/h en moyenne + 5 min par livraison)
 */
function estimateDeliveryTime(distance: number, numClients: number): number {
  const travelTimeMinutes = (distance / 30) * 60; // 30 km/h
  const deliveryTimeMinutes = numClients * 5; // 5 min par livraison
  return Math.ceil(travelTimeMinutes + deliveryTimeMinutes);
}

/**
 * Génère les tournées de livraison optimisées
 */
export function generateDeliveryRoutes(
  clients: ClientWithDistance[],
  numLivreurs: number
): RoutingResult {
  // Filtrer les clients avec des coordonnées valides
  const validClients = clients.filter(
    c => c.location && typeof c.location.lat === 'number' && typeof c.location.lng === 'number'
  );

  if (validClients.length === 0) {
    return {
      routes: [],
      totalClients: 0,
      totalDistance: 0,
      totalEstimatedTime: 0
    };
  }

  // Limiter le nombre de livreurs
  const effectiveLivreurs = Math.min(numLivreurs, validClients.length, 10);

  // Clustering des clients
  const clusters = clusterClients(validClients, effectiveLivreurs);

  // Optimiser chaque route et calculer les stats
  const routes: DeliveryRoute[] = clusters.map((cluster, index) => {
    const optimizedClients = optimizeRoute(cluster);
    const totalDistance = calculateTotalDistance(optimizedClients);
    const estimatedTime = estimateDeliveryTime(totalDistance, optimizedClients.length);

    return {
      livreurIndex: index + 1,
      clients: optimizedClients,
      totalDistance: Math.round(totalDistance * 100) / 100,
      estimatedTime
    };
  });

  // Calculer les totaux
  const totalDistance = routes.reduce((sum, r) => sum + r.totalDistance, 0);
  const totalEstimatedTime = Math.max(...routes.map(r => r.estimatedTime), 0);

  return {
    routes,
    totalClients: validClients.length,
    totalDistance: Math.round(totalDistance * 100) / 100,
    totalEstimatedTime
  };
}

/**
 * Génère un rapport de livraison formaté
 */
export function generateDeliveryReport(result: RoutingResult): string {
  let report = `=== RAPPORT DE LIVRAISON ===\n\n`;
  report += `Total clients: ${result.totalClients}\n`;
  report += `Distance totale: ${result.totalDistance} km\n`;
  report += `Temps estimé max: ${result.totalEstimatedTime} minutes\n\n`;

  result.routes.forEach((route, index) => {
    report += `--- Livreur ${route.livreurIndex} ---\n`;
    report += `Clients: ${route.clients.length}\n`;
    report += `Distance: ${route.totalDistance} km\n`;
    report += `Temps estimé: ${route.estimatedTime} min\n\n`;

    route.clients.forEach((client, clientIndex) => {
      report += `  ${clientIndex + 1}. ${client.fullName}\n`;
      report += `     Tel: ${client.phone}\n`;
      report += `     Adresse: ${client.address}\n`;
      report += `     GPS: ${client.location.lat}, ${client.location.lng}\n\n`;
    });
  });

  return report;
}
