import React, { useState, useEffect } from 'react';
import { MapPin, Loader, CheckCircle, AlertCircle, Navigation, Clock } from 'lucide-react';
import { captureGPSPosition, isGPSAvailable } from '../utils/gps';

interface ReadyButtonAuthProps {
  userId: string;
  isReady?: boolean;
  readyAt?: string;
  onSuccess?: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ReadyButtonAuth: React.FC<ReadyButtonAuthProps> = ({
  userId,
  isReady = false,
  readyAt,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentlyReady, setCurrentlyReady] = useState(isReady);
  const [gpsSupported, setGpsSupported] = useState(true);

  useEffect(() => {
    setGpsSupported(isGPSAvailable());
  }, []);

  useEffect(() => {
    setCurrentlyReady(isReady);
  }, [isReady]);

  const handleReadyClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Vérifier si GPS disponible
      if (!isGPSAvailable()) {
        throw new Error('La géolocalisation n\'est pas disponible sur cet appareil');
      }

      // Capturer la position GPS
      const coords = await captureGPSPosition();

      // Récupérer le token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }

      // Envoyer au backend
      const response = await fetch(`${API_URL}/api/auth/ready/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          readyToReceive: true,
          lat: coords.lat,
          lng: coords.lng
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'envoi de la position');
      }

      // Mise à jour du localStorage avec les nouvelles données utilisateur
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      setCurrentlyReady(true);
      setShowSuccess(true);

      // Notification visuelle
      setTimeout(() => {
        setShowSuccess(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 3000);

    } catch (err: any) {
      console.error('Erreur Ready Button:', err);
      setError(err.message || 'Une erreur est survenue');

      // Masquer l'erreur après 5 secondes
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReady = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }

      const response = await fetch(`${API_URL}/api/auth/ready/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          readyToReceive: false
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'annulation');
      }

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      setCurrentlyReady(false);

    } catch (err: any) {
      console.error('Erreur annulation:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Affichage si déjà prêt
  if (currentlyReady && !showSuccess) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="font-bold text-green-900 text-lg mb-2">
            Signal envoyé !
          </h3>
          <p className="text-green-700 text-sm mb-3">
            Votre position a été transmise. Le livreur préparera sa tournée sous peu.
          </p>
          {readyAt && (
            <p className="text-green-600 text-xs flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" />
              Prêt depuis {new Date(readyAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>

        {/* Bouton annuler */}
        <button
          onClick={handleCancelReady}
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-medium text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <>Annuler le signal</>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Message d'information */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Navigation className="w-5 h-5 text-chef-orange flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-chef-black text-sm mb-1">
              Prêt pour la livraison ?
            </h4>
            <p className="text-xs text-stone-600">
              Cliquez sur le bouton ci-dessous pour envoyer votre position GPS au livreur.
              Assurez-vous d'être à votre adresse de livraison.
            </p>
          </div>
        </div>
      </div>

      {/* Alerte GPS non supporté */}
      {!gpsSupported && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-yellow-800">
                La géolocalisation n'est pas disponible sur votre appareil.
                Vous pouvez quand même contacter le livreur par téléphone.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bouton principal */}
      <button
        onClick={handleReadyClick}
        disabled={isLoading || !gpsSupported}
        className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
          isLoading || !gpsSupported
            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600 active:scale-98'
        }`}
      >
        {isLoading ? (
          <>
            <Loader className="w-6 h-6 animate-spin" />
            <span>Capture de la position...</span>
          </>
        ) : showSuccess ? (
          <>
            <CheckCircle className="w-6 h-6" />
            <span>Signal envoyé !</span>
          </>
        ) : (
          <>
            <MapPin className="w-6 h-6" />
            <span>Je suis prêt</span>
          </>
        )}
      </button>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-red-900 text-sm mb-1">Erreur</h4>
              <p className="text-xs text-red-700">{error}</p>
              <p className="text-xs text-red-600 mt-2">
                Vérifiez que la localisation est activée dans les paramètres de votre navigateur.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadyButtonAuth;
