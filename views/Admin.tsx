import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Navigation, RefreshCw, TrendingUp, Users, Calendar, Loader, ExternalLink } from 'lucide-react';
import { getDeliveryRoute, getDeliveryStats, getAllOrders } from '../utils/api';
import { Order, OrderStatus, PlanType, MealTime } from '../types';

interface AdminProps {
  onBack: () => void;
}

export const Admin: React.FC<AdminProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'delivery' | 'all'>('delivery');
  const [deliveryOrders, setDeliveryOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);

    try {
      const [statsResponse, routeResponse, ordersResponse] = await Promise.all([
        getDeliveryStats(),
        getDeliveryRoute(),
        getAllOrders()
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      if (routeResponse.success && routeResponse.data) {
        setDeliveryOrders(routeResponse.data);
      }

      if (ordersResponse.success && ordersResponse.data) {
        setAllOrders(ordersResponse.data);
      }
    } catch (error) {
      console.error('Erreur chargement données admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-700';
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-700';
      case OrderStatus.READY:
        return 'bg-green-100 text-green-700';
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'bg-purple-100 text-purple-700';
      case OrderStatus.DELIVERED:
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getPlanBadge = (plan: PlanType, pref: MealTime) => {
    if (plan === PlanType.COMPLETE) {
      return (
        <span className="px-2 py-1 text-xs font-bold bg-chef-black text-chef-gold rounded-md">
          COMPLET
        </span>
      );
    }
    const label = pref === MealTime.LUNCH ? 'MIDI' : 'SOIR';
    return (
      <span className="px-2 py-1 text-xs font-bold bg-white border border-stone-300 text-stone-600 rounded-md">
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Admin Header */}
      <div className="bg-chef-black text-white p-4 shadow-md">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-xl font-bold">Chef★ Admin</h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-center justify-between">
              <div>
                <p className="text-stone-500 text-xs uppercase font-bold">Commandes Actives</p>
                <p className="text-2xl font-bold text-chef-black">{stats.activeOrders}</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-center justify-between">
              <div>
                <p className="text-stone-500 text-xs uppercase font-bold">Clients Total</p>
                <p className="text-2xl font-bold text-chef-black">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-center justify-between">
              <div>
                <p className="text-stone-500 text-xs uppercase font-bold">Revenu Total</p>
                <p className="text-2xl font-bold text-chef-green">
                  {stats.totalRevenue.toLocaleString()} F
                </p>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'delivery'
                ? 'bg-chef-orange text-white shadow-lg'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Tournée GPS ({deliveryOrders.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-chef-orange text-white shadow-lg'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            Toutes les commandes ({allOrders.length})
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Loader className="w-12 h-12 text-chef-orange animate-spin mx-auto mb-4" />
            <p className="text-stone-600">Chargement des données...</p>
          </div>
        ) : activeTab === 'delivery' ? (
          <DeliveryRouteView orders={deliveryOrders} getPlanBadge={getPlanBadge} />
        ) : (
          <AllOrdersView orders={allOrders} getStatusColor={getStatusColor} getPlanBadge={getPlanBadge} />
        )}
      </div>
    </div>
  );
};

// ============= DELIVERY ROUTE VIEW (TOURNÉE GPS) =============
interface DeliveryRouteViewProps {
  orders: Order[];
  getPlanBadge: (plan: PlanType, pref: MealTime) => JSX.Element;
}

const DeliveryRouteView: React.FC<DeliveryRouteViewProps> = ({ orders, getPlanBadge }) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
        <MapPin className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h3 className="font-bold text-xl text-chef-black mb-2">
          Aucune commande prête
        </h3>
        <p className="text-stone-600">
          Les clients qui cliquent sur "Je suis prêt" apparaîtront ici, triés automatiquement par distance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Navigation className="w-5 h-5 text-green-700" />
          <div className="flex-1">
            <h4 className="font-bold text-green-900">
              Tournée optimisée - {orders.length} livraison(s)
            </h4>
            <p className="text-sm text-green-700">
              Triées automatiquement du plus proche au plus loin avec l'algorithme Haversine
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Cards */}
      {orders.map((order) => (
        <div
          key={order._id || order.id}
          className="bg-white border-2 border-stone-200 rounded-2xl p-6 hover:shadow-lg transition-all"
        >
          <div className="flex items-start gap-4">
            {/* Numéro d'ordre */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-chef-orange text-white rounded-2xl flex items-center justify-center">
                <span className="font-bold text-2xl">#{order.deliveryOrder}</span>
              </div>
            </div>

            {/* Infos client */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-chef-black">{order.customerName}</h3>
                  <p className="text-sm text-stone-500">{order.phone}</p>
                </div>
                {getPlanBadge(order.plan, order.mealPreference)}
              </div>

              <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-stone-700">{order.address}</p>
              </div>

              {/* Distance & GPS */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-chef-orange font-bold">
                  <Navigation className="w-4 h-4" />
                  {order.distanceFormatted || `${order.distance?.toFixed(2)} km`}
                </div>
                {order.estimatedTime && (
                  <div className="text-stone-600">
                    ⏱️ ~{order.estimatedTime} min
                  </div>
                )}
              </div>

              {order.allergies && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-xs text-red-800">
                    ⚠️ <strong>Allergies:</strong> {order.allergies}
                  </p>
                </div>
              )}
            </div>

            {/* Action button */}
            <div className="flex-shrink-0">
              <a
                href={order.mapsLink || (order.gps ? `https://www.google.com/maps/dir/?api=1&destination=${order.gps.lat},${order.gps.lng}` : '#')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg"
              >
                <MapPin className="w-5 h-5" />
                Ouvrir Maps
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============= ALL ORDERS VIEW =============
interface AllOrdersViewProps {
  orders: Order[];
  getStatusColor: (status: OrderStatus) => string;
  getPlanBadge: (plan: PlanType, pref: MealTime) => JSX.Element;
}

const AllOrdersView: React.FC<AllOrdersViewProps> = ({ orders, getStatusColor, getPlanBadge }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="p-4 border-b border-stone-100">
        <h2 className="font-bold text-lg">Liste des Abonnements</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Formule</th>
              <th className="p-4 font-medium">Adresse</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Prix</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map((order) => (
              <tr key={order._id || order.id} className="hover:bg-stone-50/50">
                <td className="p-4">
                  <div className="font-bold text-chef-black">{order.customerName}</div>
                  <div className="text-xs text-stone-400">{order.phone}</div>
                  {order.allergies && (
                    <span className="text-xs text-red-500 font-bold mt-1 block">⚠️ Allergies</span>
                  )}
                </td>
                <td className="p-4">{getPlanBadge(order.plan, order.mealPreference)}</td>
                <td className="p-4 max-w-xs truncate text-stone-600">{order.address}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-chef-orange">
                  {order.totalPrice.toLocaleString()} F
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
