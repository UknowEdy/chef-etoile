import React, { useState } from 'react';
import { MapPin, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { captureGPSPosition, isGPSAvailable } from '../utils/gps';
import { updateOrderGPS } from '../utils/api';
import { OrderStatus } from '../types';

interface ReadyButtonProps {
  orderId: string;
  currentStatus: OrderStatus;
  onSuccess?: () => void;
}

export const ReadyButton: React.FC<ReadyButtonProps> = ({
  orderId,
  currentStatus,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Le bouton n'est actif que si la commande est CONFIRMED
  const isDisabled = currentStatus !== OrderStatus.CONFIRMED || isLoading;

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

      // Envoyer au backend
      const response = await updateOrderGPS(orderId, coords.lat, coords.lng);

      if (response.success) {
        setShowSuccess(true);

        // Notification visuelle
        setTimeout(() => {
          setShowSuccess(false);
          if (onSuccess) {
            onSuccess();
          }
        }, 3000);
      } else {
        throw new Error(response.error || 'Erreur lors de l\'envoi de la position');
      }
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

  // Affichage si déjà ready
  if (currentStatus === OrderStatus.READY || currentStatus === OrderStatus.OUT_FOR_DELIVERY) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="font-bold text-green-900 text-lg mb-2">
          {currentStatus === OrderStatus.READY ? 'Signal envoyé !' : 'En cours de livraison'}
        </h3>
        <p className="text-green-700 text-sm">
          {currentStatus === OrderStatus.READY
            ? 'Le livreur a reçu votre position et prépare la tournée'
            : 'Votre commande est en route vers vous !'}
        </p>
      </div>
    );
  }

  // Affichage si livré
  if (currentStatus === OrderStatus.DELIVERED) {
    return (
      <div className="bg-blue-50 border-2 border-blue-500 rounded-2xl p-6 text-center">
        <h3 className="font-bold text-blue-900 text-lg mb-2">Livraison terminée</h3>
        <p className="text-blue-700 text-sm">Bon appétit ! 🍽️</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Message d'information */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-chef-orange flex-shrink-0 mt-0.5" />
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

      {/* Bouton principal */}
      <button
        onClick={handleReadyClick}
        disabled={isDisabled}
        className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
          isDisabled
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
            <span>🟢 Je suis prêt</span>
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
                💡 Vérifiez que la localisation est activée dans les paramètres de votre navigateur.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Note si désactivé */}
      {isDisabled && !isLoading && currentStatus === OrderStatus.PENDING && (
        <p className="text-center text-xs text-stone-500">
          Le bouton sera activé une fois votre paiement confirmé
        </p>
      )}
    </div>
  );
};
