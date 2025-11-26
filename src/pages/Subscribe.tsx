import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle, Section, SubscriptionCard } from '../components';

export default function Subscribe() {
  const { slug } = useParams();
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const chef = {
    name: 'Chef Kodjo',
    phone: '22890123456'
  };

  const plans = [
    {
      id: 'midi',
      name: 'Formule Midi',
      price: '7 500 F',
      description: 'Repas du midi du lundi au samedi (6 repas)'
    },
    {
      id: 'soir',
      name: 'Formule Soir',
      price: '7 500 F',
      description: 'Repas du soir du lundi au samedi (6 repas)'
    },
    {
      id: 'complet',
      name: 'Formule Complète',
      price: '14 000 F',
      description: 'Midi et soir du lundi au samedi (12 repas)'
    }
  ];

  const handleSubscribe = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    const message = `Bonjour ${chef.name}, je souhaite souscrire à la ${plan.name} (${plan.price}/semaine). Merci de me confirmer.`;
    window.open(`https://wa.me/${chef.phone}?text=${encodeURIComponent(message)}`, '_blank');
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
            {plans.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                description={plan.description}
                selected={selectedPlan === plan.id}
                onClick={() => setSelectedPlan(plan.id)}
              />
            ))}
          </Section>

          <Section title="Informations importantes">
            <div className="card">
              <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>
                • Paiement hebdomadaire à l'avance<br/>
                • Livraison incluse dans un rayon de 10 km<br/>
                • Possibilité de mettre en pause votre abonnement<br/>
                • Menus variés chaque semaine<br/>
                • Confirmation par WhatsApp obligatoire
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
            Vous serez redirigé vers WhatsApp pour finaliser votre abonnement
          </div>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
