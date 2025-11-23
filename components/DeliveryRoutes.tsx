import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Navigation,
  CheckCircle,
  Clock,
  Route,
  ChefHat,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface Client {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  readyAt?: string;
}

interface DeliveryRoute {
  livreurIndex: number;
  clients: Client[];
  totalDistance: number;
  estimatedTime: number;
}

interface DeliveryRoutesProps {
  route: DeliveryRoute;
  onRefresh?: () => void;
}

export const DeliveryRoutes: React.FC<DeliveryRoutesProps> = ({ route, onRefresh }) => {
  const [deliveredClients, setDeliveredClients] = useState<Set<string>>(new Set());
  const [currentClientIndex, setCurrentClientIndex] = useState(0);

  // Charger les livraisons sauvegardées
  useEffect(() => {
    const saved = localStorage.getItem(`delivered_${route.livreurIndex}`);
    if (saved) {
      setDeliveredClients(new Set(JSON.parse(saved)));
    }
  }, [route.livreurIndex]);

  // Sauvegarder les livraisons
  useEffect(() => {
    localStorage.setItem(
      `delivered_${route.livreurIndex}`,
      JSON.stringify([...deliveredClients])
    );
  }, [deliveredClients, route.livreurIndex]);

  const handleMarkDelivered = (clientId: string, index: number) => {
    setDeliveredClients(prev => new Set([...prev, clientId]));
    if (index === currentClientIndex && index < route.clients.length - 1) {
      setCurrentClientIndex(index + 1);
    }
  };

  const openInMaps = (client: Client) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${client.location.lat},${client.location.lng}`;
    window.open(url, '_blank');
  };

  const callClient = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const deliveredCount = deliveredClients.size;
  const totalCount = route.clients.length;
  const progress = totalCount > 0 ? (deliveredCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-chef-orange text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Tournée #{route.livreurIndex}</h2>
              <p className="text-orange-100 text-sm">
                {route.clients.length} clients • {route.totalDistance.toFixed(1)} km
              </p>
            </div>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Barre de progression */}
        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-orange-100 mt-2 text-right">
          {deliveredCount}/{totalCount} livrés • ~{route.estimatedTime} min
        </p>
      </div>

      {/* Point de départ */}
      <div className="px-4 py-3 bg-orange-50 border-b flex items-center gap-3">
        <div className="w-8 h-8 bg-chef-orange rounded-full flex items-center justify-center">
          <ChefHat className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-medium text-sm text-chef-black">Départ: Cuisine Chef★</p>
          <p className="text-xs text-gray-500">Point de départ de la tournée</p>
        </div>
      </div>

      {/* Liste des clients */}
      <div className="divide-y">
        {route.clients.map((client, index) => {
          const isDelivered = deliveredClients.has(client._id);
          const isCurrent = index === currentClientIndex && !isDelivered;

          return (
            <div
              key={client._id}
              className={`p-4 transition-colors ${
                isDelivered ? 'bg-green-50' : isCurrent ? 'bg-orange-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Numéro d'ordre */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                    isDelivered
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-chef-orange text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isDelivered ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>

                {/* Infos client */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${isDelivered ? 'text-green-700' : ''}`}>
                      {client.fullName}
                    </h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-chef-orange text-white text-xs rounded-full">
                        En cours
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">{client.address}</p>

                  {client.readyAt && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      Prêt depuis{' '}
                      {new Date(client.readyAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => callClient(client.phone)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Appeler
                    </button>
                    <button
                      onClick={() => openInMaps(client)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      GPS
                    </button>
                    {!isDelivered && (
                      <button
                        onClick={() => handleMarkDelivered(client._id, index)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors ml-auto"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Livré
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Résumé */}
      {deliveredCount === totalCount && totalCount > 0 && (
        <div className="p-4 bg-green-100 border-t border-green-200">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <CheckCircle className="w-6 h-6" />
            <span className="font-bold">Tournée terminée !</span>
          </div>
          <p className="text-center text-green-600 text-sm mt-1">
            Toutes les livraisons ont été effectuées
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryRoutes;
