import React, { useState, useEffect, useRef } from 'react';
import {
  ChefHat,
  LogOut,
  MapPin,
  Phone,
  ArrowLeft,
  CheckCircle,
  Truck,
  QrCode,
  Camera,
  X,
  Loader2,
  RefreshCw,
  Navigation,
  Clock,
  AlertCircle,
  Check,
  User
} from 'lucide-react';
import { User as UserType, Delivery, DeliveryStatus } from '../types';

interface LivreurDashboardProps {
  user: UserType;
  onLogout: () => void;
  onBack: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LivreurDashboard({ user, onLogout, onBack }: LivreurDashboardProps) {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, delivered: 0, pending: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 30000); // Refresh toutes les 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDeliveries = async () => {
    try {
      const [deliveriesRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/livreur/deliveries/today`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/livreur/stats/today`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const deliveriesData = await deliveriesRes.json();
      const statsData = await statsRes.json();

      if (deliveriesData.success) setDeliveries(deliveriesData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    if (!manualCode.trim()) {
      setError('Entrez un code de confirmation');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/livreur/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ confirmationNumber: manualCode.trim() })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Client trouvé !');
        setSelectedDelivery(data.data);
        setManualCode('');
        fetchDeliveries();
      } else {
        setError(data.error || 'Code non trouvé');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (deliveryId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/livreur/deliveries/${deliveryId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notes: 'Livré avec succès' })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Livraison confirmée !');
        setSelectedDelivery(null);
        fetchDeliveries();
      } else {
        setError(data.error || 'Erreur');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const openMaps = (lat: number, lng: number, address: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'in_progress': return 'En cours';
      case 'confirmed': return 'Confirmé';
      default: return 'En attente';
    }
  };

  if (loading && deliveries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-chef-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-chef-black text-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-chef-orange" />
            <span className="font-serif font-bold">Livreur</span>
          </div>
          <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-lg">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
            <button onClick={() => setError('')} className="ml-auto">&times;</button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <Check className="w-5 h-5" />
            {success}
            <button onClick={() => setSuccess('')} className="ml-auto">&times;</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-chef-black">{stats.total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            <p className="text-xs text-orange-600">À livrer</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-xs text-blue-600">En cours</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            <p className="text-xs text-green-600">Livrés</p>
          </div>
        </div>

        {/* Scanner */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-chef-orange" />
            Scanner / Vérifier
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={e => setManualCode(e.target.value.toUpperCase())}
              placeholder="Code confirmation (ex: CE...)"
              className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-chef-orange focus:outline-none"
            />
            <button
              onClick={handleScan}
              disabled={loading}
              className="px-4 bg-chef-orange text-white rounded-xl hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Détail livraison sélectionnée */}
        {selectedDelivery && (
          <div className="bg-chef-gold/10 rounded-2xl p-6 mb-6 border-2 border-chef-gold">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Client trouvé</h3>
              <button onClick={() => setSelectedDelivery(null)} className="text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{selectedDelivery.clientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <a href={`tel:${selectedDelivery.clientPhone}`} className="text-chef-orange">
                  {selectedDelivery.clientPhone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm">{selectedDelivery.clientAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-gray-400" />
                <span className="font-mono text-sm">{selectedDelivery.confirmationNumber}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {selectedDelivery.clientLocation && (
                <button
                  onClick={() => openMaps(
                    selectedDelivery.clientLocation.lat,
                    selectedDelivery.clientLocation.lng,
                    selectedDelivery.clientAddress
                  )}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600"
                >
                  <Navigation className="w-5 h-5" />
                  Naviguer
                </button>
              )}
              <button
                onClick={() => handleComplete(selectedDelivery._id)}
                disabled={loading}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                Livré
              </button>
            </div>
          </div>
        )}

        {/* Liste des livraisons */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-bold">Livraisons du jour</h2>
            <button onClick={fetchDeliveries} className="p-2 hover:bg-gray-100 rounded-lg">
              <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="divide-y max-h-96 overflow-y-auto">
            {deliveries.length > 0 ? (
              deliveries.map(delivery => (
                <div
                  key={delivery._id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    delivery.status === 'delivered' ? 'opacity-50' : ''
                  }`}
                  onClick={() => delivery.status !== 'delivered' && setSelectedDelivery(delivery)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{delivery.clientName}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(delivery.status)}`}>
                      {getStatusLabel(delivery.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {delivery.clientPhone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {delivery.mealType === 'LUNCH' ? 'Midi' : 'Soir'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {delivery.clientAddress}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aucune livraison pour aujourd'hui</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
