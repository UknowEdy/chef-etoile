import React, { useState } from 'react';
import { Phone, Lock, User, ArrowRight, AlertCircle, ChefHat } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: any, token: string) => void;
  onSwitchToRegister?: () => void;
  onSwitchToAdmin?: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login({ onLoginSuccess, onSwitchToRegister, onSwitchToAdmin }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Formulaire
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { phone, password }
        : { phone, password, fullName, address };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      // Sauvegarder le token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-chef-cream flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-chef-orange rounded-2xl flex items-center justify-center shadow-lg">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold font-serif text-chef-black">
          Chef<span className="text-chef-gold">★</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? 'Connectez-vous à votre espace client' : 'Créez votre compte client'}
        </p>
      </div>

      {/* Formulaire */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nom complet (inscription uniquement) */}
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-chef-orange focus:border-transparent transition-all"
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>
            )}

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Numéro de téléphone
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-chef-orange focus:border-transparent transition-all"
                  placeholder="+228 90 XX XX XX"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-chef-orange focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Adresse (inscription uniquement) */}
            {!isLogin && (
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Adresse de livraison
                </label>
                <div className="mt-1">
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-chef-orange focus:border-transparent transition-all resize-none"
                    placeholder="Quartier, rue, repère..."
                  />
                </div>
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Bouton de soumission */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-chef-orange hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chef-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Se connecter' : "S'inscrire"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-chef-orange hover:text-orange-700 font-medium transition-colors"
              >
                {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
              </button>
            </div>

            {/* Lien vers Admin */}
            {onSwitchToAdmin && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={onSwitchToAdmin}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Accès administrateur →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
