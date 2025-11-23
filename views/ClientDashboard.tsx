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
  RefreshCw,
  QrCode,
  Users,
  Gift,
  CreditCard,
  Copy,
  Check,
  AlertCircle,
  Calendar
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
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'referral'>('profile');

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

  const copyReferralCode = () => {
    if (user.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSubscriptionActive = user.subscription?.isActive;
  const referralProgress = (user.referralCount || 0) % 5;
  const freeMeals = user.freeMealsEarned || 0;

  return (
    <div className="min-h-screen bg-chef-cream">
      {/* Header */}
      <header className="bg-chef-black text-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-chef-orange rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold">
              Mon Espace<span className="text-chef-gold">★</span>
            </span>
          </div>
          <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-lg">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-white/10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'profile' ? 'bg-chef-orange' : 'hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4 mx-auto mb-1" />
            Profil
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'subscription' ? 'bg-chef-orange' : 'hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-4 h-4 mx-auto mb-1" />
            Abonnement
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'referral' ? 'bg-chef-orange' : 'hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 mx-auto mb-1" />
            Parrainage
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {activeTab === 'profile' && (
          <>
            {/* Carte profil */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-chef-orange/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-chef-orange" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-chef-black">{user.fullName}</h1>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {user.phone}
                  </p>
                </div>
                <button
                  onClick={refreshUserData}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 flex items-start gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{user.address || 'Adresse non renseignée'}</span>
                </p>
              </div>

              {/* Préférences alimentaires */}
              {(user.allergies || user.dietaryPreferences) && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium mb-2">Préférences alimentaires</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.dietaryPreferences?.isVegetarian && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Végétarien</span>
                    )}
                    {user.dietaryPreferences?.noFish && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Sans poisson</span>
                    )}
                    {user.dietaryPreferences?.noMeat && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Sans viande</span>
                    )}
                    {user.dietaryPreferences?.noPork && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Sans porc</span>
                    )}
                    {user.dietaryPreferences?.noSpicy && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Sans piment</span>
                    )}
                    {user.allergies && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        Allergies: {user.allergies}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Status prêt */}
            {user.readyToReceive && (
              <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800">Signal actif</h3>
                    <p className="text-sm text-green-600">Le livreur peut voir votre position</p>
                  </div>
                </div>
              </div>
            )}

            {/* ReadyButton */}
            {isSubscriptionActive && (
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
            )}
          </>
        )}

        {activeTab === 'subscription' && (
          <>
            {/* Statut abonnement */}
            <div className={`rounded-2xl p-6 mb-6 ${
              isSubscriptionActive
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-gray-100 border-2 border-gray-300'
            }`}>
              <div className="flex items-center gap-4 mb-4">
                {isSubscriptionActive ? (
                  <CheckCircle className="w-12 h-12 text-green-500" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                )}
                <div>
                  <h2 className="text-xl font-bold">
                    {isSubscriptionActive ? 'Abonnement Actif' : 'Pas d\'abonnement'}
                  </h2>
                  {isSubscriptionActive && user.subscription && (
                    <p className="text-sm text-gray-600">
                      {user.subscription.plan === 'COMPLETE' ? 'Formule Complète' : 'Formule Partielle'}
                      {' • '}
                      {user.subscription.mealPreference === 'BOTH' ? 'Midi + Soir' :
                       user.subscription.mealPreference === 'LUNCH' ? 'Midi' : 'Soir'}
                    </p>
                  )}
                </div>
              </div>

              {isSubscriptionActive && user.subscription?.endDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  Expire le {new Date(user.subscription.endDate).toLocaleDateString('fr-FR')}
                </div>
              )}

              {!isSubscriptionActive && (
                <p className="text-sm text-gray-500">
                  Souscrivez à un abonnement pour profiter de nos délicieux repas livrés chez vous.
                </p>
              )}
            </div>

            {/* QR Code et numéro de confirmation */}
            {isSubscriptionActive && user.confirmationNumber && (
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-chef-orange" />
                  Votre code livraison
                </h3>

                {/* QR Code visuel */}
                <div className="bg-chef-black rounded-xl p-6 text-center mb-4">
                  <div className="w-32 h-32 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-24 h-24 text-chef-black" />
                  </div>
                  <p className="text-chef-gold font-mono text-lg font-bold">
                    {user.confirmationNumber}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    Présentez ce code au livreur
                  </p>
                </div>

                <div className="text-center text-sm text-gray-500">
                  Le livreur scannera ce code ou vous demandera votre numéro de confirmation
                </div>
              </div>
            )}

            {/* Repas gratuits */}
            {freeMeals > 0 && (
              <div className="bg-chef-gold/20 rounded-2xl p-4 border border-chef-gold">
                <div className="flex items-center gap-3">
                  <Gift className="w-8 h-8 text-chef-gold" />
                  <div>
                    <p className="font-bold text-chef-black">{freeMeals} repas gratuit{freeMeals > 1 ? 's' : ''}</p>
                    <p className="text-sm text-gray-600">Gagnés grâce à vos parrainages</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'referral' && (
          <>
            {/* Code parrain */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-chef-orange" />
                Votre code parrain
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Partagez ce code avec vos amis. Quand 5 amis s'abonnent, vous gagnez 1 repas gratuit !
              </p>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-chef-black text-chef-gold font-mono text-xl font-bold py-3 px-4 rounded-xl text-center">
                  {user.referralCode || 'XXXXXX'}
                </div>
                <button
                  onClick={copyReferralCode}
                  className="p-3 bg-chef-orange text-white rounded-xl hover:bg-orange-700"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-2 text-center">Code copié !</p>
              )}
            </div>

            {/* Progression parrainage */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="font-bold mb-4">Progression</h3>

              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Filleuls inscrits</span>
                <span className="font-bold">{user.referralCount || 0}</span>
              </div>

              {/* Barre de progression */}
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-chef-orange transition-all"
                  style={{ width: `${(referralProgress / 5) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span>{referralProgress}/5 pour le prochain repas gratuit</span>
                <span>5</span>
              </div>

              {freeMeals > 0 && (
                <div className="mt-4 p-3 bg-chef-gold/20 rounded-xl">
                  <p className="text-center">
                    <Gift className="w-5 h-5 inline-block mr-2 text-chef-gold" />
                    <span className="font-bold">{freeMeals} repas gratuit{freeMeals > 1 ? 's' : ''}</span> gagnés !
                  </p>
                </div>
              )}
            </div>

            {/* Comment ça marche */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <h3 className="font-semibold text-chef-orange text-sm mb-3">
                Comment ça marche ?
              </h3>
              <ol className="text-xs text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-chef-orange text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                  <span>Partagez votre code parrain avec vos amis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-chef-orange text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                  <span>Vos amis s'inscrivent avec votre code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-chef-orange text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                  <span>À chaque 5 amis abonnés, vous gagnez 1 repas gratuit !</span>
                </li>
              </ol>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
