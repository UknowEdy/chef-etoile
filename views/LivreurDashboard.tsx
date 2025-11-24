import React, { useState, useEffect, useRef } from 'react';
import { Loader2, LogOut, CheckCircle, MapPin, Package } from 'lucide-react';

interface DeliveryOrder {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  status: string;
  qrCodeId?: string;
  mapsLink?: string;
  distance?: string;
  estimatedTime?: number;
}

interface LivreurDashboardProps {
  userId: string;
  userName: string;
  onLogout: () => void;
}

export function LivreurDashboard({
  userId,
  userName,
  onLogout
}: LivreurDashboardProps) {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchDeliveryOrders();
    getCurrentLocation();
    startLocationTracking();
  }, [userId]);

  const fetchDeliveryOrders = async () => {
    try {
      const response = await fetch(`/api/delivery/list?driverId=${userId}`);
      const data = await response.json();
      if (response.ok) {
        // Sort confirmed orders first
        const sorted = data.data.sort((a: DeliveryOrder, b: DeliveryOrder) => {
          if (a.status === 'CONFIRMED' && b.status !== 'CONFIRMED') return -1;
          if (a.status !== 'CONFIRMED' && b.status === 'CONFIRMED') return 1;
          return 0;
        });
        setOrders(sorted);
      } else {
        setError('Impossible de charger les commandes');
      }
    } catch (err) {
      setError('Erreur réseau');
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => console.error('Geolocation error:', err)
      );
    }
  };

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  };

  const handleStartDelivery = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setShowQrScanner(true);
  };

  const handleQrCodeScanned = (qrCode: string) => {
    if (selectedOrder && selectedOrder.qrCodeId === qrCode) {
      completeDelivery(selectedOrder._id, qrCode);
    } else {
      setError('QR code ne correspond pas');
    }
  };

  const handleManualConfirmation = async () => {
    if (!selectedOrder || !confirmationNumber) {
      setError('Numéro de confirmation requis');
      return;
    }

    completeDelivery(selectedOrder._id, confirmationNumber);
  };

  const completeDelivery = async (orderId: string, confirmation: string) => {
    try {
      const response = await fetch(`/api/delivery/${orderId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: userId,
          confirmation,
          location: currentLocation
        })
      });

      if (response.ok) {
        setShowQrScanner(false);
        setSelectedOrder(null);
        setConfirmationNumber('');
        fetchDeliveryOrders();
      } else {
        setError('Erreur lors de la livraison');
      }
    } catch (err) {
      setError('Erreur réseau');
      console.error('Complete delivery error:', err);
    }
  };

  const openMapsDirection = (order: DeliveryOrder) => {
    if (currentLocation && order.mapsLink) {
      window.open(order.mapsLink, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-chef-gold" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <div className="bg-stone-900 text-white py-8 px-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">Livraisons</h1>
            <p className="text-stone-300">Bienvenue, {userName}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-4 text-sm underline"
            >
              Fermer
            </button>
          </div>
        )}

        {currentLocation && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
            📍 Localisation: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
          </div>
        )}

        {/* QR Code Scanner Modal */}
        {showQrScanner && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="font-serif text-2xl font-bold text-chef-black mb-4">
                Confirmer la livraison
              </h2>
              <p className="text-stone-600 mb-6">
                À {selectedOrder.customerName}
              </p>

              <div className="space-y-4">
                {/* QR Scanner */}
                <div className="bg-stone-50 rounded-lg overflow-hidden border-2 border-dashed border-stone-300 p-4">
                  <video
                    ref={videoRef}
                    className="w-full rounded"
                    style={{ maxHeight: '250px' }}
                  />
                  <p className="text-xs text-stone-500 text-center mt-2">
                    (Scannez le QR code du client)
                  </p>
                </div>

                {/* Manual Confirmation */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Ou saisissez le numéro de confirmation
                  </label>
                  <input
                    type="text"
                    value={confirmationNumber}
                    onChange={(e) => setConfirmationNumber(e.target.value)}
                    placeholder="Ex: 123456"
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chef-gold"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowQrScanner(false);
                      setSelectedOrder(null);
                      setConfirmationNumber('');
                    }}
                    className="flex-1 px-4 py-3 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleManualConfirmation}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-chef-gold text-white rounded-lg hover:bg-yellow-600 font-medium"
                  >
                    <CheckCircle size={18} />
                    Livré
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-600 font-medium">Aucune livraison pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order._id}
                className={`rounded-xl shadow-lg p-6 border-l-4 ${
                  order.status === 'CONFIRMED'
                    ? 'bg-yellow-50 border-l-yellow-500'
                    : 'bg-white border-l-stone-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-chef-black">
                      {order.customerName}
                    </h3>
                    <p className="text-stone-600">
                      {order.phone}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'CONFIRMED'
                      ? 'bg-yellow-200 text-yellow-800'
                      : order.status === 'OUT_FOR_DELIVERY'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-green-200 text-green-800'
                  }`}>
                    {order.status === 'CONFIRMED' ? 'En attente de livreur' : order.status}
                  </span>
                </div>

                <div className="bg-stone-50 p-4 rounded-lg mb-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="text-stone-600 mt-0.5 flex-shrink-0" size={18} />
                    <p className="text-stone-700">{order.address}</p>
                  </div>
                  {order.distance && (
                    <p className="text-sm text-stone-600">
                      Distance: {order.distance}
                    </p>
                  )}
                  {order.estimatedTime && (
                    <p className="text-sm text-stone-600">
                      Temps estimé: {Math.round(order.estimatedTime / 60)} min
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  {order.mapsLink && (
                    <button
                      onClick={() => openMapsDirection(order)}
                      className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                    >
                      📍 Itinéraire
                    </button>
                  )}
                  <button
                    onClick={() => handleStartDelivery(order)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-chef-gold text-white rounded-lg hover:bg-yellow-600 font-medium transition-colors"
                  >
                    <CheckCircle size={18} />
                    Livrer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
