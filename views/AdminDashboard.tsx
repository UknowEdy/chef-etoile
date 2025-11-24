import React, { useState, useEffect } from 'react';
import { Loader2, LogOut, CheckCircle, XCircle, DollarSign, Users } from 'lucide-react';

interface Payment {
  _id: string;
  userId: {
    fullName: string;
    phone: string;
  };
  amount: number;
  status: string;
  proofImage?: string;
  createdAt: string;
}

interface Stats {
  activeSubscriptions: number;
  weeklyRevenue: number;
  topDishes: Array<{ name: string; likes: number }>;
  pendingPayments: number;
}

interface AdminDashboardProps {
  userId: string;
  userName: string;
  userType: string;
  onLogout: () => void;
  onViewMenu: () => void;
  onViewPayments: () => void;
}

export function AdminDashboard({
  userId,
  userName,
  userType,
  onLogout,
  onViewMenu,
  onViewPayments
}: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchPendingPayments();
  }, []);

  const fetchStats = async () => {
    try {
      // In production, create a /api/admin/stats endpoint
      // For now, we'll use placeholder data
      setStats({
        activeSubscriptions: 0,
        weeklyRevenue: 0,
        topDishes: [],
        pendingPayments: 0
      });
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const response = await fetch('/api/payments/pending');
      const data = await response.json();
      if (response.ok) {
        setPayments(data.data);
      }
    } catch (err) {
      console.error('Fetch payments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: userId })
      });

      if (response.ok) {
        fetchPendingPayments();
      }
    } catch (err) {
      console.error('Verify payment error:', err);
    }
  };

  const handleRejectPayment = async (paymentId: string, reason: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        fetchPendingPayments();
      }
    } catch (err) {
      console.error('Reject payment error:', err);
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
      <div className="bg-stone-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">Dashboard Admin</h1>
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

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">Abonnés actifs</p>
                <p className="font-serif text-3xl font-bold text-chef-black">
                  {stats?.activeSubscriptions || 0}
                </p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">Revenu hebdo</p>
                <p className="font-serif text-3xl font-bold text-chef-black">
                  {(stats?.weeklyRevenue || 0).toLocaleString('fr-FR')} FCFA
                </p>
              </div>
              <DollarSign className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">Paiements en attente</p>
                <p className="font-serif text-3xl font-bold text-chef-black">
                  {payments.length}
                </p>
              </div>
              <DollarSign className="text-yellow-500" size={32} />
            </div>
          </div>
        </div>

        {/* Top Dishes */}
        {stats?.topDishes && stats.topDishes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-serif text-2xl font-bold text-chef-black mb-4">
              Plats populaires
            </h2>
            <div className="space-y-3">
              {stats.topDishes.map((dish, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
                  <span className="font-medium text-chef-black">{dish.name}</span>
                  <span className="text-chef-gold font-bold">{dish.likes} likes</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Payments */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="font-serif text-2xl font-bold text-chef-black mb-4">
            Paiements à vérifier
          </h2>

          {payments.length === 0 ? (
            <p className="text-stone-600">Aucun paiement en attente</p>
          ) : (
            <div className="space-y-4">
              {payments.map(payment => (
                <div key={payment._id} className="border border-stone-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-chef-black">
                        {payment.userId.fullName}
                      </p>
                      <p className="text-sm text-stone-600">
                        {payment.userId.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-chef-gold">
                        {payment.amount.toLocaleString('fr-FR')} FCFA
                      </p>
                      <p className="text-xs text-stone-500">
                        {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  {payment.proofImage && (
                    <div className="mb-4 p-2 bg-stone-50 rounded">
                      <img
                        src={payment.proofImage}
                        alt="Proof"
                        className="max-h-48 max-w-xs mx-auto rounded"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerifyPayment(payment._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      <CheckCircle size={18} />
                      Vérifier
                    </button>
                    <button
                      onClick={() => handleRejectPayment(payment._id, 'Preuve de paiement insuffisante')}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      <XCircle size={18} />
                      Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Management Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={onViewMenu}
            className="bg-chef-gold text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
          >
            Gestion du menu
          </button>
          <button
            onClick={onViewPayments}
            className="bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Tous les paiements
          </button>
        </div>
      </div>
    </div>
  );
}
