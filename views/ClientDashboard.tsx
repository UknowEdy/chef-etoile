import React, { useState, useEffect } from 'react';
import { Copy, Share2, Loader2, LogOut } from 'lucide-react';

interface Subscription {
  _id: string;
  planType: string;
  status: string;
  mealsRemaining: number;
  mealsPerWeek: number;
  pricePerWeek: number;
  referralBonusMeals?: number;
}

interface User {
  _id: string;
  fullName: string;
  phone: string;
  referralCode?: string;
  qrCodeId?: string;
}

interface ClientDashboardProps {
  userId: string;
  userName: string;
  onLogout: () => void;
  onViewMenu: () => void;
}

export function ClientDashboard({
  userId,
  userName,
  onLogout,
  onViewMenu
}: ClientDashboardProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchSubscription();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setUser(data.data);
      }
    } catch (err) {
      console.error('Fetch user error:', err);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await fetch(`/api/subscriptions/user/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setSubscription(data.data);
      } else {
        // No active subscription
        setSubscription(null);
      }
    } catch (err) {
      console.error('Fetch subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const shareReferralCode = () => {
    const message = `Rejoignez Chef Étoile avec mon code de parrainage: ${user?.referralCode}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getMealPercentage = () => {
    if (!subscription) return 0;
    return ((subscription.mealsPerWeek - (subscription.mealsRemaining || 0)) / subscription.mealsPerWeek) * 100;
  };

  const getPlanLabel = (planType: string) => {
    return planType === 'COMPLETE' ? 'Abonnement complet' : 'Abonnement partiel';
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
        <div className="max-w-4xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">Bienvenue, {userName}</h1>
            <p className="text-stone-300">Gérez votre abonnement et vos préférences</p>
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

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Subscription Card */}
        {subscription ? (
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-chef-gold">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-chef-black">
                  {getPlanLabel(subscription.planType)}
                </h2>
                <p className="text-stone-600 mt-1">
                  {subscription.pricePerWeek.toLocaleString('fr-FR')} FCFA/semaine
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                subscription.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {subscription.status === 'ACTIVE' ? 'Actif' : 'En attente'}
              </span>
            </div>

            {/* Meals Progress */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-stone-700">Repas restants cette semaine</p>
                <p className="text-2xl font-bold text-chef-gold">
                  {subscription.mealsRemaining || 0}/{subscription.mealsPerWeek}
                </p>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-3">
                <div
                  className="bg-chef-gold h-3 rounded-full transition-all"
                  style={{ width: `${getMealPercentage()}%` }}
                />
              </div>
            </div>

            {/* Bonus Meals */}
            {(subscription.referralBonusMeals || 0) > 0 && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-800">
                  🎁 {subscription.referralBonusMeals} repas gratuit(s) grâce au parrainage
                </p>
              </div>
            )}

            <button
              onClick={onViewMenu}
              className="mt-6 w-full bg-chef-gold text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              Voir le menu de la semaine
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-dashed border-stone-300">
            <h2 className="font-serif text-2xl font-bold text-chef-black mb-4">
              Pas d'abonnement actif
            </h2>
            <p className="text-stone-600 mb-6">
              Créez un abonnement pour commencer à recevoir les repas Chef Étoile
            </p>
            <button className="bg-chef-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
              Souscrire maintenant
            </button>
          </div>
        )}

        {/* QR Code Section */}
        {user?.qrCodeId && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-serif text-xl font-bold text-chef-black mb-4">
              Votre QR Code de livraison
            </h3>
            <p className="text-stone-600 mb-4">
              Le livreur scanera ce code pour confirmer votre livraison
            </p>
            <div className="flex flex-col items-center py-6 bg-stone-50 rounded-lg border-2 border-dashed border-stone-300">
              <div className="bg-white p-4 rounded-lg mb-4">
                {/* SVG QR Code Placeholder - In production, use a QR code library */}
                <div className="w-48 h-48 bg-stone-200 flex items-center justify-center rounded">
                  <span className="text-stone-500 text-center text-sm">
                    QR Code<br/>{user.qrCodeId.substring(0, 16)}...
                  </span>
                </div>
              </div>
              <p className="text-sm text-stone-500 text-center">
                ID: {user.qrCodeId}
              </p>
            </div>
          </div>
        )}

        {/* Referral Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="font-serif text-xl font-bold text-chef-black mb-2">
            Parrainage
          </h3>
          <p className="text-stone-600 mb-4">
            Invitez vos amis et recevez 1 repas gratuit pour 5 amis abonnés
          </p>

          {user?.referralCode && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={user.referralCode}
                  readOnly
                  className="flex-1 px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg font-mono text-sm"
                />
                <button
                  onClick={copyReferralCode}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    copiedCode
                      ? 'bg-green-500 text-white'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  <Copy size={18} />
                  {copiedCode ? 'Copié!' : 'Copier'}
                </button>
              </div>

              <button
                onClick={shareReferralCode}
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <Share2 size={18} />
                Partager sur WhatsApp
              </button>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-serif text-xl font-bold text-chef-black mb-4">
            Informations du compte
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-stone-600">Nom complet</p>
              <p className="font-medium text-chef-black">{userName}</p>
            </div>
            <div>
              <p className="text-sm text-stone-600">Téléphone</p>
              <p className="font-medium text-chef-black">{user?.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
