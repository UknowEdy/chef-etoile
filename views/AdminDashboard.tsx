import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  MapPin,
  Route,
  RefreshCw,
  Download,
  LogOut,
  ChefHat,
  Clock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Truck,
  BarChart3
} from 'lucide-react';

interface Client {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  location: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
  readyAt: string;
}

interface DeliveryRoute {
  livreurIndex: number;
  clients: Client[];
  totalDistance: number;
  estimatedTime: number;
}

interface RoutingResult {
  routes: DeliveryRoute[];
  totalClients: number;
  totalDistance: number;
  totalEstimatedTime: number;
}

interface Stats {
  totalClients: number;
  readyClients: number;
  totalLivreurs: number;
  totalAdmins: number;
}

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Couleurs pour les différentes routes
const ROUTE_COLORS = [
  '#ea580c', // Orange
  '#2563eb', // Bleu
  '#16a34a', // Vert
  '#dc2626', // Rouge
  '#9333ea', // Violet
  '#ca8a04', // Jaune
  '#0891b2', // Cyan
  '#be185d', // Rose
  '#84cc16', // Lime
  '#6366f1', // Indigo
];

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [readyClients, setReadyClients] = useState<Client[]>([]);
  const [routes, setRoutes] = useState<RoutingResult | null>(null);
  const [numLivreurs, setNumLivreurs] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [leafletMap, setLeafletMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [polylines, setPolylines] = useState<any[]>([]);

  const token = localStorage.getItem('token');

  // Charger Leaflet dynamiquement
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.L) {
      // Charger CSS Leaflet
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Charger JS Leaflet
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else if (window.L) {
      setMapLoaded(true);
    }
  }, []);

  // Initialiser la carte
  useEffect(() => {
    if (mapLoaded && !leafletMap && window.L) {
      const map = window.L.map('delivery-map').setView([6.1256, 1.2229], 13);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Marqueur cuisine
      const kitchenIcon = window.L.divIcon({
        html: `<div style="background: #ea580c; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>`,
        className: 'kitchen-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      window.L.marker([6.1256, 1.2229], { icon: kitchenIcon })
        .addTo(map)
        .bindPopup('<b>Cuisine Chef★</b><br>Point de départ');

      setLeafletMap(map);
    }
  }, [mapLoaded, leafletMap]);

  // Charger les données
  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      const [statsRes, clientsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/admin/clients/ready`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const statsData = await statsRes.json();
      const clientsData = await clientsRes.json();

      if (statsData.success) setStats(statsData.data);
      if (clientsData.success) setReadyClients(clientsData.data);
    } catch (err) {
      console.error('Erreur chargement données:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Mettre à jour la carte avec les clients
  useEffect(() => {
    if (!leafletMap || !window.L) return;

    // Supprimer les anciens marqueurs
    markers.forEach(m => leafletMap.removeLayer(m));
    polylines.forEach(p => leafletMap.removeLayer(p));

    const newMarkers: any[] = [];
    const newPolylines: any[] = [];

    if (routes) {
      // Afficher les routes
      routes.routes.forEach((route, routeIndex) => {
        const color = ROUTE_COLORS[routeIndex % ROUTE_COLORS.length];
        const points: [number, number][] = [[6.1256, 1.2229]]; // Départ cuisine

        route.clients.forEach((client, clientIndex) => {
          points.push([client.location.lat, client.location.lng]);

          const icon = window.L.divIcon({
            html: `<div style="background: ${color}; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); color: white; font-weight: bold; font-size: 12px;">${clientIndex + 1}</div>`,
            className: 'client-marker',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const marker = window.L.marker([client.location.lat, client.location.lng], { icon })
            .addTo(leafletMap)
            .bindPopup(`
              <b>${client.fullName}</b><br>
              <small>Livreur ${route.livreurIndex} - Arrêt ${clientIndex + 1}</small><br>
              📍 ${client.address}<br>
              📞 ${client.phone}
            `);
          newMarkers.push(marker);
        });

        // Tracer la ligne
        const polyline = window.L.polyline(points, {
          color,
          weight: 4,
          opacity: 0.7,
          dashArray: '10, 10'
        }).addTo(leafletMap);
        newPolylines.push(polyline);
      });

      // Ajuster la vue
      if (newMarkers.length > 0) {
        const group = window.L.featureGroup([...newMarkers, ...newPolylines]);
        leafletMap.fitBounds(group.getBounds().pad(0.1));
      }
    } else {
      // Afficher juste les clients prêts
      readyClients.forEach(client => {
        const icon = window.L.divIcon({
          html: `<div style="background: #fbbf24; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><svg width="12" height="12" viewBox="0 0 24 24" fill="#171717"><circle cx="12" cy="12" r="10"/></svg></div>`,
          className: 'ready-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = window.L.marker([client.location.lat, client.location.lng], { icon })
          .addTo(leafletMap)
          .bindPopup(`
            <b>${client.fullName}</b><br>
            📍 ${client.address}<br>
            📞 ${client.phone}
          `);
        newMarkers.push(marker);
      });

      if (newMarkers.length > 0) {
        const group = window.L.featureGroup(newMarkers);
        leafletMap.fitBounds(group.getBounds().pad(0.2));
      }
    }

    setMarkers(newMarkers);
    setPolylines(newPolylines);
  }, [leafletMap, readyClients, routes]);

  // Générer les routes
  const handleGenerateRoutes = async () => {
    if (!token) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/admin/routes/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ numLivreurs })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur génération');
      }

      setRoutes(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Exporter les routes
  const handleExportRoutes = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/routes/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ numLivreurs })
      });

      const text = await response.text();
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tournees_${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur export:', err);
    }
  };

  // Réinitialiser les statuts
  const handleResetReady = async () => {
    if (!token || !confirm('Réinitialiser tous les clients prêts ?')) return;

    try {
      await fetch(`${API_URL}/api/admin/reset-ready`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoutes(null);
      fetchData();
    } catch (err) {
      console.error('Erreur reset:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-chef-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-chef-orange rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif">
                Chef<span className="text-chef-gold">★</span> Admin
              </h1>
              <p className="text-xs text-gray-400">Gestion des livraisons</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{user?.fullName || user?.email}</span>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalClients || 0}</p>
                <p className="text-xs text-gray-500">Clients total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.readyClients || 0}</p>
                <p className="text-xs text-gray-500">Prêts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalLivreurs || 0}</p>
                <p className="text-xs text-gray-500">Livreurs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{routes?.totalDistance.toFixed(1) || '0'}</p>
                <p className="text-xs text-gray-500">km total</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Carte */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-chef-orange" />
                  Carte des livraisons
                </h2>
                <button
                  onClick={fetchData}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <div id="delivery-map" className="h-96 w-full" />
            </div>

            {/* Contrôles de génération */}
            <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Route className="w-5 h-5 text-chef-orange" />
                Générer les tournées
              </h3>

              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nombre de livreurs</label>
                  <select
                    value={numLivreurs}
                    onChange={(e) => setNumLivreurs(Number(e.target.value))}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-chef-orange focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n} livreur{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleGenerateRoutes}
                  disabled={loading || readyClients.length === 0}
                  className="px-6 py-2 bg-chef-orange text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Route className="w-5 h-5" />
                  )}
                  Générer
                </button>

                {routes && (
                  <>
                    <button
                      onClick={handleExportRoutes}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Exporter
                    </button>
                    <button
                      onClick={handleResetReady}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Réinitialiser
                    </button>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Liste des clients / routes */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-chef-orange" />
                  {routes ? 'Tournées générées' : 'Clients prêts'}
                </h2>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {routes ? (
                  // Affichage des routes générées
                  routes.routes.map((route, routeIndex) => (
                    <div key={routeIndex} className="border-b last:border-0">
                      <div
                        className="p-3 flex items-center gap-3"
                        style={{ backgroundColor: `${ROUTE_COLORS[routeIndex % ROUTE_COLORS.length]}15` }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: ROUTE_COLORS[routeIndex % ROUTE_COLORS.length] }}
                        >
                          {route.livreurIndex}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Livreur {route.livreurIndex}</p>
                          <p className="text-xs text-gray-500">
                            {route.clients.length} clients • {route.totalDistance.toFixed(1)} km • ~{route.estimatedTime} min
                          </p>
                        </div>
                      </div>
                      {route.clients.map((client, clientIndex) => (
                        <div key={client._id} className="px-4 py-2 border-t border-gray-100 flex items-start gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: ROUTE_COLORS[routeIndex % ROUTE_COLORS.length] }}
                          >
                            {clientIndex + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{client.fullName}</p>
                            <p className="text-xs text-gray-500 truncate">{client.address}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3" />
                              {client.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : readyClients.length > 0 ? (
                  // Affichage des clients prêts
                  readyClients.map(client => (
                    <div key={client._id} className="p-4 border-b last:border-0 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-chef-gold rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-chef-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{client.fullName}</p>
                          <p className="text-sm text-gray-500 truncate">{client.address}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {client.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(client.readyAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucun client prêt</p>
                    <p className="text-sm mt-1">Les clients apparaîtront ici quand ils seront prêts à recevoir.</p>
                  </div>
                )}
              </div>

              {routes && (
                <div className="p-4 bg-gray-50 border-t">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-chef-orange">{routes.totalClients}</p>
                      <p className="text-xs text-gray-500">Clients</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-chef-orange">{routes.totalDistance.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">km total</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-chef-orange">{routes.totalEstimatedTime}</p>
                      <p className="text-xs text-gray-500">min max</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Déclaration pour TypeScript
declare global {
  interface Window {
    L: any;
  }
}
