import React, { useState } from 'react';
import { ArrowLeft, CreditCard, User, MapPin, Phone, AlertCircle } from 'lucide-react';
import { PlanType, MealTime } from '../types';
import { PLANS } from '../constants';

interface CheckoutProps {
  selectedPlan: PlanType;
  mealPreference: MealTime;
  onBack: () => void;
  onSuccess: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ selectedPlan, mealPreference, onBack, onSuccess }) => {
  const planDetails = PLANS.find(p => p.id === selectedPlan);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    allergies: false,
    allergiesDetail: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData(prev => ({ ...prev, allergies: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate simple MVP style
    if (!formData.fullName || !formData.phone || !formData.address) {
        alert("Veuillez remplir tous les champs obligatoires.");
        setIsSubmitting(false);
        return;
    }

    // Simulate API/Processing
    setTimeout(() => {
        // Construct WhatsApp Message
        const preferenceLabel = mealPreference === MealTime.BOTH 
            ? "Midi et Soir" 
            : mealPreference === MealTime.LUNCH ? "Déjeuner uniquement" : "Dîner uniquement";
            
        const message = `Bonjour Chef★ ! Je souhaite m'abonner.%0A%0A*Commande :* ${planDetails?.title}%0A*Préférence :* ${preferenceLabel}%0A*Prix :* ${planDetails?.price}F%0A%0A*Mes infos :*%0A👤 ${formData.fullName}%0A📞 ${formData.phone}%0A📍 ${formData.address}%0A${formData.allergies ? `⚠️ Allergies : ${formData.allergiesDetail}` : ''}`;
        
        // Open WhatsApp (Simulated Payment Gateway)
        window.open(`https://wa.me/22890000000?text=${message}`, '_blank');
        
        onSuccess();
    }, 1500);
  };

  if (!planDetails) return null;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
        {/* Header for Checkout */}
        <div className="bg-white border-b border-stone-100 p-4 sticky top-0 z-30 flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-chef-black" />
            </button>
            <h2 className="font-serif text-lg font-bold">Finaliser l'abonnement</h2>
        </div>

        <div className="max-w-2xl mx-auto p-4 pt-6">
            {/* Summary Card */}
            <div className="bg-chef-black text-white p-6 rounded-2xl shadow-lg mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-chef-gold text-xs uppercase tracking-widest font-bold mb-1">Votre sélection</p>
                        <h3 className="font-serif text-2xl font-bold">{planDetails.title}</h3>
                        <p className="text-stone-400 text-sm mt-1">
                            {mealPreference === MealTime.BOTH ? 'Déjeuner & Dîner' : mealPreference === MealTime.LUNCH ? 'Déjeuner seulement' : 'Dîner seulement'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-chef-gold">{planDetails.price.toLocaleString()} F</p>
                        <p className="text-xs text-stone-400">/ semaine</p>
                    </div>
                </div>
                <div className="h-px bg-white/10 w-full my-4" />
                <div className="flex items-center gap-2 text-xs text-stone-300">
                    <AlertCircle className="w-4 h-4" />
                    <p>Paiement sécurisé à la livraison ou via Mobile Money</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
                    <h3 className="font-bold text-chef-black mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-chef-orange" />
                        Informations Personnelles
                    </h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">Nom & Prénom</label>
                        <input 
                            type="text" 
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Ex: Koffi Mensah"
                            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-orange/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">Numéro de téléphone (Mobile Money)</label>
                        <div className="relative">
                             <Phone className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
                             <input 
                                type="tel" 
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+228 90 00 00 00"
                                className="w-full p-3 pl-10 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-orange/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
                    <h3 className="font-bold text-chef-black mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-chef-orange" />
                        Livraison
                    </h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">Adresse précise</label>
                        <textarea 
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Quartier, Point de repère, Numéro de maison..."
                            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-orange/50 transition-all h-24 resize-none"
                        />
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                         <input 
                            type="checkbox" 
                            id="allergies"
                            name="allergies"
                            checked={formData.allergies}
                            onChange={handleCheckboxChange}
                            className="mt-1 w-4 h-4 text-chef-orange rounded focus:ring-chef-orange"
                         />
                         <div className="flex-1">
                            <label htmlFor="allergies" className="text-sm font-medium text-chef-black block">J'ai des allergies ou restrictions</label>
                            {formData.allergies && (
                                <input 
                                    type="text"
                                    name="allergiesDetail"
                                    value={formData.allergiesDetail}
                                    onChange={handleInputChange}
                                    placeholder="Précisez (ex: Arachides, Piment...)"
                                    className="mt-2 w-full p-2 bg-white border border-orange-200 rounded-lg text-sm focus:outline-none"
                                />
                            )}
                         </div>
                    </div>
                </div>

                {/* Payment Action */}
                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-chef-orange text-white rounded-xl font-bold text-lg shadow-lg hover:bg-orange-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="animate-pulse">Traitement...</span>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5" />
                                Payer {planDetails.price.toLocaleString()} F via TMoney/Flooz
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-stone-400 mt-4">
                        En cliquant, vous serez redirigé vers WhatsApp pour valider la transaction.
                    </p>
                </div>
            </form>
        </div>
    </div>
  );
};