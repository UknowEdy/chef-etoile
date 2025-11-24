import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (userId: string, fullName: string, userType: string) => void;
  onSwitchToClient: () => void;
}

export function AdminLogin({ onLoginSuccess, onSwitchToClient }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email || !password) {
      setError('Tous les champs sont requis');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erreur de connexion');
        return;
      }

      // Store user info and redirect
      localStorage.setItem('userId', data.data.userId);
      localStorage.setItem('userType', data.data.userType);
      onLoginSuccess(data.data.userId, data.data.fullName, data.data.userType);
    } catch (err) {
      setError('Erreur réseau. Vérifiez votre connexion.');
      console.error('Admin login error:', err);
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
          Connexion Admin
        </h1>
        <p className="text-center text-stone-500 mb-8">
          Accès administrateur et livreurs
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@chefetoile.com"
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

        {/* Back to Client Login */}
        <div className="text-center">
          <button
            onClick={onSwitchToClient}
            className="flex items-center justify-center gap-2 text-chef-gold font-medium hover:text-yellow-600 transition-colors mx-auto"
          >
            <ArrowLeft size={18} />
            Retour connexion client
          </button>
        </div>
      </div>
    </div>
  );
}
