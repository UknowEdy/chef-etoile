import React, { useState } from 'react';
import { Check, Star, ChevronDown, ArrowRight } from 'lucide-react';
import { PLANS } from '../constants';
import { PlanType, MealTime } from '../types';

interface LandingProps {
  onSelectPlan: (plan: PlanType, preference: MealTime) => void;
}

export const Landing: React.FC<LandingProps> = ({ onSelectPlan }) => {
  const [expandedSimple, setExpandedSimple] = useState(false);

  const handleSimpleClick = () => {
    setExpandedSimple(!expandedSimple);
  };

  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative h-[75vh] w-full overflow-hidden bg-chef-black text-white flex items-end">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
            {/* Image style 'Festin' vue de dessus avec des tons chauds */}
            <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
                alt="Festin de plats africains vue de dessus" 
                className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 p-6 pb-12 max-w-4xl mx-auto w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-chef-orange/20 backdrop-blur-md rounded-full border border-chef-orange/40 mb-4">
                <Star className="w-3 h-3 text-chef-orange fill-chef-orange" />
                <span className="text-xs font-bold text-chef-orange uppercase tracking-wider">Premium Delivery Lomé</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-4">
                Déléguez la cuisine. <br/>
                <span className="text-chef-gold">Savourez l'excellence.</span>
            </h1>
            <p className="text-stone-200 text-lg mb-8 max-w-md">
                Abonnement hebdomadaire de repas gastronomiques africains, mijotés avec passion et livrés chez vous.
            </p>
            <button 
                onClick={scrollToPricing}
                className="bg-chef-orange text-white px-8 py-4 rounded-full font-medium text-lg flex items-center gap-2 hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-900/30"
            >
                Voir les formules <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-white py-8 border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
             <div>
                <p className="font-serif text-2xl font-bold text-chef-black">100%</p>
                <p className="text-xs text-chef-orange font-bold uppercase tracking-wide mt-1">Frais</p>
             </div>
             <div>
                <p className="font-serif text-2xl font-bold text-chef-black">Chef</p>
                <p className="text-xs text-chef-orange font-bold uppercase tracking-wide mt-1">Gourmet</p>
             </div>
             <div>
                <p className="font-serif text-2xl font-bold text-chef-black">24h</p>
                <p className="text-xs text-chef-orange font-bold uppercase tracking-wide mt-1">Support</p>
             </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-chef-black font-bold mb-3">Nos Formules Semaine</h2>
            <p className="text-stone-500">Du Lundi au Vendredi. Une explosion de saveurs chaque jour.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {PLANS.map((plan) => {
                const isComplete = plan.id === PlanType.COMPLETE;
                
                return (
                    <div 
                        key={plan.id}
                        className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                            isComplete 
                            ? 'bg-chef-black text-white border-chef-black shadow-xl scale-105 md:scale-105 z-10' 
                            : 'bg-white text-chef-black border-stone-200 hover:border-chef-orange/30'
                        }`}
                    >
                        {isComplete && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-chef-gold text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md shadow-amber-500/20">
                                Recommandé
                            </div>
                        )}

                        <h3 className={`font-serif text-2xl font-bold mb-2 ${isComplete ? 'text-white' : 'text-chef-black'}`}>
                            {plan.title}
                        </h3>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className={`text-3xl font-bold ${isComplete ? 'text-chef-gold' : 'text-chef-orange'}`}>
                                {plan.price.toLocaleString('fr-FR')} F
                            </span>
                            <span className={`text-sm ${isComplete ? 'text-stone-400' : 'text-stone-500'}`}>/ semaine</span>
                        </div>
                        <p className={`text-sm mb-6 ${isComplete ? 'text-stone-300' : 'text-stone-500'}`}>
                            {plan.description}
                        </p>

                        <ul className="space-y-3 mb-8">
                            {plan.features.map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm">
                                    <div className={`rounded-full p-0.5 ${isComplete ? 'bg-white/20' : 'bg-orange-50'}`}>
                                        <Check className={`w-3 h-3 ${isComplete ? 'text-chef-gold' : 'text-chef-orange'}`} />
                                    </div>
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>

                        {isComplete ? (
                            <button 
                                onClick={() => onSelectPlan(PlanType.COMPLETE, MealTime.BOTH)}
                                className="w-full py-4 rounded-xl bg-chef-gold text-chef-black font-bold hover:bg-amber-400 transition-colors text-center"
                            >
                                Je m'abonne
                            </button>
                        ) : (
                            <div className="space-y-3">
                                {!expandedSimple ? (
                                     <button 
                                        onClick={handleSimpleClick}
                                        className="w-full py-4 rounded-xl border-2 border-chef-black text-chef-black font-bold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Choisir cette formule <ChevronDown className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <div className="bg-orange-50 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                                        <p className="text-sm font-medium mb-3 text-center text-chef-orange">Votre préférence ?</p>
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <button 
                                                onClick={() => onSelectPlan(PlanType.SIMPLE, MealTime.LUNCH)}
                                                className="py-2 px-3 bg-white border border-orange-100 rounded-lg text-sm font-medium hover:border-chef-orange hover:text-chef-orange transition-all shadow-sm"
                                            >
                                                Déjeuner
                                            </button>
                                            <button 
                                                onClick={() => onSelectPlan(PlanType.SIMPLE, MealTime.DINNER)}
                                                className="py-2 px-3 bg-white border border-orange-100 rounded-lg text-sm font-medium hover:border-chef-orange hover:text-chef-orange transition-all shadow-sm"
                                            >
                                                Dîner
                                            </button>
                                        </div>
                                        <button 
                                            onClick={handleSimpleClick}
                                            className="w-full text-xs text-stone-400 underline hover:text-stone-600"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};