import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle, Section, SubscriptionCard } from '../components';
import { StorageService, ChefPlan } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

export default function Subscribe() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const { user } = useAuth();
  const clientEmail = user?.email || 'unknown@client.com';
  const chefSlug = slug || 'kodjo';

  const chefProfile = StorageService.getChefBySlug(chefSlug) || { name: 'Chef★', phone: '+228 90 00 00 00', location: '' };
  const plans: ChefPlan[] = useMemo(() => StorageService.getChefPlans(chefSlug), [chefSlug]);

  const handleSubscribe = () => {
    const plan = plans.find((p) => p.id === selectedPlan && p.active);
    if (!plan || !user) return;

    StorageService.requestSubscription({
      clientEmail,
      chefSlug,
      chefName: chefProfile.name,
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      days: plan.days,
      clientPhone: ''
    });

    const message = `Bonjour ${chefProfile.name} !

Je souhaite m'abonner à la formule *${plan.name}* pour les jours : ${plan.days.join(', ')}.
Merci de confirmer pour que je puisse vous envoyer la preuve de paiement.`;

    const phoneClean = (chefProfile.phone || '').replace(/\s/g, '');
    if (!phoneClean) {
      alert("Numéro WhatsApp du chef indisponible. Merci de contacter le support.");
      return;
    }
    window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`, '_blank');

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
            {plans.filter((p) => p.active).map((plan) => (
              <SubscriptionCard
                key={plan.id}
                name={plan.name}
                price={`${plan.price} F`}
                description={`Jours : ${plan.days.join(', ')}`}
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
                • Jours de livraison selon votre choix de formule<br/>
                • Preuve de transfert à envoyer sur WhatsApp
              </div>
            </div>
          </Section>

          <button 
            className="btn btn-whatsapp"
            disabled={!selectedPlan || !(chefProfile.phone)}
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
