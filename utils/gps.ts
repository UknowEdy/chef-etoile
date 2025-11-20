import { GPSCoordinates } from '../types';

/**
 * Utilitaires GPS côté client
 */

export interface GPSError {
  code: number;
  message: string;
}

/**
 * Capture la position GPS du client
 * @returns Promise avec les coordonnées ou une erreur
 */
export function captureGPSPosition(): Promise<GPSCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'La géolocalisation n\'est pas supportée par votre navigateur'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date()
        });
      },
      (error) => {
        let message = 'Erreur de géolocalisation';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permission de localisation refusée. Veuillez activer la localisation dans les paramètres.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Position indisponible. Vérifiez votre connexion GPS.';
            break;
          case error.TIMEOUT:
            message = 'Délai d\'attente dépassé. Réessayez.';
            break;
        }

        reject({
          code: error.code,
          message
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Vérifie si la géolocalisation est disponible
 */
export function isGPSAvailable(): boolean {
  return 'geolocation' in navigator;
}

/**
 * Demande la permission de géolocalisation
 */
export async function requestGPSPermission(): Promise<boolean> {
  if (!isGPSAvailable()) {
    return false;
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state === 'granted';
  } catch (error) {
    // Fallback: essayer de capturer la position
    try {
      await captureGPSPosition();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Génère un lien Google Maps pour navigation
 */
export function generateMapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Ouvre Google Maps avec les coordonnées
 */
export function openInMaps(lat: number, lng: number): void {
  const link = generateMapsLink(lat, lng);
  window.open(link, '_blank');
}

/**
 * Formatte les coordonnées pour affichage
 */
export function formatCoordinates(coords: GPSCoordinates): string {
  return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
}

/**
 * Calcule la distance approximative entre deux points (formule Haversine simplifiée)
 * Note: Pour calcul précis, utiliser l'API backend
 */
export function calculateApproximateDistance(
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
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Valide des coordonnées GPS
 */
export function validateGPSCoordinates(coords: GPSCoordinates): boolean {
  const { lat, lng } = coords;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return false;
  }

  // Vérifier que ce ne sont pas des valeurs nulles (0, 0)
  if (lat === 0 && lng === 0) {
    return false;
  }

  return true;
}
