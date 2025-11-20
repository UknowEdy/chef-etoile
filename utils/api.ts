import { Order, APIResponse, DeliveryRoute } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Utilitaire pour les requêtes fetch avec gestion d'erreurs
 */
async function fetchAPI<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<APIResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  } catch (error: any) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message || 'Erreur de connexion au serveur'
    };
  }
}

// ============= ORDERS API =============

/**
 * Créer une nouvelle commande
 */
export async function createOrder(orderData: Partial<Order>): Promise<APIResponse<Order>> {
  return fetchAPI<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
}

/**
 * Récupérer toutes les commandes
 */
export async function getAllOrders(filters?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<APIResponse<Order[]>> {
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.page) queryParams.append('page', filters.page.toString());
  if (filters?.limit) queryParams.append('limit', filters.limit.toString());

  const query = queryParams.toString();
  return fetchAPI<Order[]>(`/orders${query ? `?${query}` : ''}`);
}

/**
 * Récupérer une commande par ID
 */
export async function getOrderById(id: string): Promise<APIResponse<Order>> {
  return fetchAPI<Order>(`/orders/${id}`);
}

/**
 * Mettre à jour le statut d'une commande
 */
export async function updateOrderStatus(
  id: string,
  status: string,
  gps?: { lat: number; lng: number }
): Promise<APIResponse<Order>> {
  return fetchAPI<Order>(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, gps })
  });
}

/**
 * Mettre à jour les coordonnées GPS (Bouton "Je suis prêt")
 */
export async function updateOrderGPS(
  id: string,
  lat: number,
  lng: number
): Promise<APIResponse<Order>> {
  return fetchAPI<Order>(`/orders/${id}/gps`, {
    method: 'PUT',
    body: JSON.stringify({ lat, lng })
  });
}

// ============= DELIVERY API =============

/**
 * Récupérer la tournée optimisée (tri GPS automatique)
 */
export async function getDeliveryRoute(): Promise<DeliveryRoute> {
  return fetchAPI<Order[]>('/delivery/route');
}

/**
 * Récupérer les livraisons actives
 */
export async function getActiveDeliveries(): Promise<APIResponse<Order[]>> {
  return fetchAPI<Order[]>('/delivery/active');
}

/**
 * Démarrer une livraison
 */
export async function startDelivery(id: string): Promise<APIResponse<Order>> {
  return fetchAPI<Order>(`/delivery/${id}/start`, {
    method: 'PUT'
  });
}

/**
 * Terminer une livraison
 */
export async function completeDelivery(id: string): Promise<APIResponse<Order>> {
  return fetchAPI<Order>(`/delivery/${id}/complete`, {
    method: 'PUT'
  });
}

/**
 * Calculer la distance depuis la cuisine
 */
export async function calculateDistance(
  lat: number,
  lng: number
): Promise<APIResponse<{
  distance: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  mapsLink: string;
}>> {
  return fetchAPI(`/delivery/calculate-distance?lat=${lat}&lng=${lng}`);
}

/**
 * Récupérer les statistiques de livraison
 */
export async function getDeliveryStats(): Promise<APIResponse<{
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  activeOrders: number;
  totalRevenue: number;
}>> {
  return fetchAPI('/delivery/stats');
}
