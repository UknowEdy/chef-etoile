import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InstallPWA } from './components/InstallPWA';
import { Landing } from './views/Landing';
import { Checkout } from './views/Checkout';
import { Dashboard } from './views/Dashboard';
import { Admin } from './views/Admin';
import Login from './views/Login';
import AdminLogin from './views/AdminLogin';
import AdminDashboard from './views/AdminDashboard';
import ClientDashboard from './views/ClientDashboard';
import { ViewState, PlanType, MealTime, User } from './types';
import { CheckCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(PlanType.COMPLETE);
  const [mealPreference, setMealPreference] = useState<MealTime>(MealTime.BOTH);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Vérifier le token au chargement
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);

        // Rediriger vers le bon dashboard selon le rôle
        if (parsedUser.role === 'admin') {
          setCurrentView('ADMIN_DASHBOARD');
        } else if (parsedUser.role === 'client') {
          setCurrentView('CLIENT_DASHBOARD');
        }
      } catch (e) {
        // Token invalide, nettoyer
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handlePlanSelection = (plan: PlanType, preference: MealTime) => {
    setSelectedPlan(plan);
    setMealPreference(preference);
    navigateTo('CHECKOUT');
  };

  const handleCheckoutSuccess = (orderId?: string) => {
    if (orderId) {
      setCurrentOrderId(orderId);
    }
    navigateTo('SUCCESS');
  };

  const handleLoginSuccess = (loggedInUser: User, userToken: string) => {
    setUser(loggedInUser);
    setToken(userToken);

    // Rediriger selon le rôle
    if (loggedInUser.role === 'admin') {
      navigateTo('ADMIN_DASHBOARD');
    } else {
      navigateTo('CLIENT_DASHBOARD');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigateTo('HOME');
  };

  // Success View Component (Internal)
  const SuccessView = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="font-serif text-3xl font-bold text-chef-black mb-4">Commande initiée !</h2>
      <p className="text-stone-500 mb-8 max-w-xs mx-auto">
        Vous avez été redirigé vers WhatsApp. Veuillez envoyer le message pré-rempli pour finaliser le
        paiement avec notre agent.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigateTo('HOME')}
          className="px-8 py-3 bg-stone-100 text-stone-800 rounded-lg font-medium hover:bg-stone-200 transition-colors"
        >
          Retour à l'accueil
        </button>

        {currentOrderId && (
          <button
            onClick={() => navigateTo('DASHBOARD')}
            className="px-8 py-3 bg-chef-orange text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Voir ma commande
          </button>
        )}
      </div>

      <p className="text-xs text-stone-400 mt-6">
        {currentOrderId && `ID de commande: ${currentOrderId}`}
      </p>
    </div>
  );

  // Déterminer si on doit afficher le header
  const showHeader = !['ADMIN', 'SUCCESS', 'DASHBOARD', 'LOGIN', 'ADMIN_LOGIN', 'ADMIN_DASHBOARD', 'CLIENT_DASHBOARD'].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <Header
          onNavigate={navigateTo}
          user={user}
          onLogin={() => navigateTo('LOGIN')}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-grow">
        {currentView === 'HOME' && <Landing onSelectPlan={handlePlanSelection} />}

        {currentView === 'CHECKOUT' && (
          <Checkout
            selectedPlan={selectedPlan}
            mealPreference={mealPreference}
            onBack={() => navigateTo('HOME')}
            onSuccess={handleCheckoutSuccess}
          />
        )}

        {currentView === 'SUCCESS' && <SuccessView />}

        {currentView === 'DASHBOARD' && currentOrderId && (
          <Dashboard orderId={currentOrderId} onBack={() => navigateTo('HOME')} />
        )}

        {currentView === 'ADMIN' && <Admin onBack={() => navigateTo('HOME')} />}

        {currentView === 'LOGIN' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToAdmin={() => navigateTo('ADMIN_LOGIN')}
          />
        )}

        {currentView === 'ADMIN_LOGIN' && (
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onSwitchToClient={() => navigateTo('LOGIN')}
          />
        )}

        {currentView === 'ADMIN_DASHBOARD' && user && (
          <AdminDashboard
            user={user}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'CLIENT_DASHBOARD' && user && (
          <ClientDashboard
            user={user}
            onLogout={handleLogout}
            onBack={() => navigateTo('HOME')}
          />
        )}
      </main>

      {/* Footer (only on Landing) */}
      {currentView === 'HOME' && (
        <footer className="bg-chef-black text-stone-400 py-10 text-center text-sm border-t border-white/10">
          <p className="font-serif text-white text-lg mb-2">
            Chef<span className="text-chef-gold">★</span>
          </p>
          <p className="mb-6">Lomé, Togo. &copy; 2025 Tous droits réservés.</p>
          <div className="flex justify-center gap-4 text-xs">
            <a href="#" className="hover:text-white">
              Conditions Générales
            </a>
            <a href="#" className="hover:text-white">
              Confidentialité
            </a>
          </div>
        </footer>
      )}

      {/* PWA Install Banner */}
      <InstallPWA />
    </div>
  );
}
