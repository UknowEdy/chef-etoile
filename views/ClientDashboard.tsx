import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  LogOut,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { ReadyButtonAuth } from '../components/ReadyButtonAuth';
import { User as UserType } from '../types';

interface ClientDashboardProps {
  user: UserType;
  onLogout: () => void;
  onBack: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ClientDashboard({ user: initialUser, onLogout, onBack }: ClientDashboardProps) {
  const [user, setUser] = useState<UserType>(initialUser);
  const [loading, setLoading] = useState(false);

  // Rafraîchir les données utilisateur
  const refreshUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error('Erreur refresh:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <div className="min-h-screen bg-chef-cream">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-chef-orange rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-bold">
              Chef<span className="text-chef-gold">★</span>
            </span>
          </div>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Carte profil */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-chef-orange/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-chef-orange" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-chef-black">{user.fullName}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {user.phone}
              </p>
            </div>
            <button
              onClick={refreshUserData}
              disabled={loading}
              className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 flex items-start gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{user.address}</span>
            </p>
          </div>
        </div>

        {/* Status actuel */}
        {user.readyToReceive && (
          <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-800">Signal actif</h3>
                <p className="text-sm text-green-600">
                  Le livreur peut voir votre position
                </p>
                {user.readyAt && (
                  <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    Depuis {new Date(user.readyAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GPS Position */}
        {user.location && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-chef-orange" />
              Dernière position enregistrée
            </h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 font-mono">
                Lat: {user.location.lat.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Lng: {user.location.lng.toFixed(6)}
              </p>
              {user.location.updatedAt && (
                <p className="text-xs text-gray-400 mt-2">
                  Mise à jour: {new Date(user.location.updatedAt).toLocaleString('fr-FR')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ReadyButton */}
        <div className="mb-6">
          <h2 className="font-semibold mb-4 text-chef-black">
            Prêt à recevoir votre livraison ?
          </h2>
          <ReadyButtonAuth
            userId={user._id}
            isReady={user.readyToReceive}
            readyAt={user.readyAt}
            onSuccess={refreshUserData}
          />
        </div>

        {/* Info */}
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <h3 className="font-semibold text-chef-orange text-sm mb-2">
            Comment ça marche ?
          </h3>
          <ol className="text-xs text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-chef-orange text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
              <span>Quand vous êtes à votre adresse de livraison, cliquez sur "Je suis prêt"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-chef-orange text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
              <span>Votre position GPS est envoyée au livreur</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-chef-orange text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
              <span>Le livreur optimise sa tournée et vient vous livrer</span>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}
