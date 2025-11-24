import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (userId: string, fullName: string) => void;
  onSwitchToAdmin: () => void;
}

export function Login({ onLoginSuccess, onSwitchToAdmin }: LoginProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!phone || !password) {
      setError('Tous les champs sont requis');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erreur de connexion');
        return;
      }

      // Store user info and redirect
      localStorage.setItem('userId', data.data.userId);
      localStorage.setItem('userType', 'CLIENT');
      onLoginSuccess(data.data.userId, data.data.fullName);
    } catch (err) {
      setError('Erreur réseau. Vérifiez votre connexion.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/images/logo.png" alt="Chef Étoile" className="h-16 w-16" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-center text-chef-black mb-2">
          Connexion Client
        </h1>
        <p className="text-center text-stone-500 mb-8">
          Accédez à votre espace personnel
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-2">
              Numéro de téléphone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="ex: +228 90 00 00 00"
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chef-gold"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chef-gold"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-500 hover:text-stone-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-chef-gold text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-stone-300"></div>
          <span className="text-stone-500 text-sm">ou</span>
          <div className="flex-1 h-px bg-stone-300"></div>
        </div>

        {/* Admin Login Link */}
        <div className="text-center">
          <p className="text-stone-600 mb-3">Admin ou Livreur ?</p>
          <button
            onClick={onSwitchToAdmin}
            className="text-chef-gold font-medium hover:text-yellow-600 transition-colors"
          >
            Accès administrateur
          </button>
        </div>

        {/* Register Link (if needed) */}
        <div className="mt-6 pt-6 border-t border-stone-200 text-center">
          <p className="text-stone-600 text-sm">
            Pas encore inscrit ?{' '}
            <a href="#" className="text-chef-gold font-medium hover:text-yellow-600">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
