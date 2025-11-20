import React, { useState } from 'react';
import { Header } from './components/Header';
import { Landing } from './views/Landing';
import { Checkout } from './views/Checkout';
import { Dashboard } from './views/Dashboard';
import { Admin } from './views/Admin';
import { ViewState, PlanType, MealTime } from './types';
import { CheckCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(PlanType.COMPLETE);
  const [mealPreference, setMealPreference] = useState<MealTime>(MealTime.BOTH);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');

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

        {/* Bouton pour aller au Dashboard - Pour dev/test */}
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

  return (
    <div className="min-h-screen flex flex-col">
      {currentView !== 'ADMIN' && currentView !== 'SUCCESS' && currentView !== 'DASHBOARD' && (
        <Header onNavigate={navigateTo} />
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
    </div>
  );
}
