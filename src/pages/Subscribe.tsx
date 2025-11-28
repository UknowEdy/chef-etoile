import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle, Section, SubscriptionCard } from '../components';
import { StorageService } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

export default function Subscribe() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const { user } = useAuth();
  const clientEmail = user?.email || 'unknown@client.com';

  // Données personnalisées par chef
  const chefsData: any = {
    kodjo: { 
      name: 'Chef Kodjo', 
      phone: '+228 90 12 34 56',
      jours: 'lundi au samedi',
      nbJours: 6,
      plans: [
        { id: 'midi', name: 'Formule Midi', price: '7 500 F', repas: 6 },
        { id: 'soir', name: 'Formule Soir', price: '7 500 F', repas: 6 },
        { id: 'complet', name: 'Formule Complète', price: '14 000 F', repas: 12 }
      ]
    },
    anna: { 
      name: 'Chef Anna', 
      phone: '+228 90 23 45 67',
      jours: 'lundi au vendredi',
      nbJours: 5,
      plans: [
        { id: 'midi', name: 'Formule Midi', price: '6 500 F', repas: 5 },
        { id: 'soir', name: 'Formule Soir', price: '6 500 F', repas: 5 },
        { id: 'complet', name: 'Formule Complète', price: '12 000 F', repas: 10 }
      ]
    },
    gloria: { 
      name: 'Chef Gloria', 
      phone: '+228 90 34 56 78',
      jours: 'lundi, mercredi et vendredi',
      nbJours: 3,
      plans: [
        { id: 'midi', name: 'Formule Midi', price: '4 000 F', repas: 3 },
        { id: 'soir', name: 'Formule Soir', price: '4 000 F', repas: 3 },
        { id: 'complet', name: 'Formule Complète', price: '7 500 F', repas: 6 }
      ]
    },
    yao: { 
      name: 'Chef Yao', 
      phone: '+228 90 45 67 89',
      jours: 'lundi au samedi',
      nbJours: 6,
      plans: [
        { id: 'midi', name: 'Formule Midi', price: '8 000 F', repas: 6 },
        { id: 'soir', name: 'Formule Soir', price: '8 000 F', repas: 6 },
        { id: 'complet', name: 'Formule Complète', price: '15 000 F', repas: 12 }
      ]
    },
    ama: { 
      name: 'Chef Ama', 
      phone: '+228 90 56 78 90',
      jours: 'lundi au vendredi',
      nbJours: 5,
      plans: [
        { id: 'midi', name: 'Formule Midi', price: '7 000 F', repas: 5 },
        { id: 'soir', name: 'Formule Soir', price: '7 000 F', repas: 5 },
        { id: 'complet', name: 'Formule Complète', price: '13 000 F', repas: 10 }
      ]
    }
  };

  const chef = chefsData[slug || 'kodjo'] || chefsData.kodjo;

  const handleSubscribe = () => {
    const plan = chef.plans.find((p: any) => p.id === selectedPlan);
    if (!plan || !user) return;

    // 1. Sauvegarder dans le stockage local
    StorageService.addSubscription({
      clientEmail,
      chefSlug: slug || 'kodjo',
      chefName: chef.name,
      planId: plan.id,
      planName: plan.name,
      price: plan.price
    });
    
    // 2. Préparer le message WhatsApp
    const message = `Bonjour ${chef.name} !

Je souhaite m'abonner à votre service :

📋 *Formule choisie :* ${plan.name}
💰 *Montant :* ${plan.price}/semaine
📅 *Jours de livraison :* ${chef.jours}
🍽️ *Nombre de repas :* ${plan.repas} repas/semaine

Je confirme mon inscription et je vous enverrai mon transfert avec la preuve ici sur WhatsApp.`;

    const phoneClean = chef.phone.replace(/\s/g, '');
    
    // 3. Ouvrir WhatsApp
    window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`, '_blank');

    // 4. Rediriger l'utilisateur vers "Mes abonnements"
    navigate('/my/subscriptions');
  };

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Choisissez votre formule" 
            subtitle="Sélectionnez l'abonnement qui vous convient"
          />
          
          <Section>
            {chef.plans.map((plan: any) => (
              <SubscriptionCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                description={`Repas du ${plan.id} du ${chef.jours} (${plan.repas} repas)`}
                selected={selectedPlan === plan.id}
                onClick={() => setSelectedPlan(plan.id)}
              />
            ))}
          </Section>

          <Section title="Informations importantes">
            <div className="card">
              <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>
                • Abonnement hebdomadaire renouvelable<br/>
                • Paiement par Mobile Money avant activation<br/>
                • Livraison incluse dans un rayon de 10 km<br/>
                • Jours de livraison : {chef.jours}<br/>
                • Preuve de transfert à envoyer sur WhatsApp
              </div>
            </div>
          </Section>

          <button 
            className="btn btn-whatsapp"
            disabled={!selectedPlan}
            onClick={handleSubscribe}
            style={{ opacity: selectedPlan ? 1 : 0.5 }}
          >
            <MessageCircle size={20} />
            Confirmer via WhatsApp
          </button>
          
          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
            Le chef vous confirmera pour que vous puissiez faire le transfert
          </div>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
