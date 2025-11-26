import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Calendar, MapPin } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { Section, MenuItem, InfoRow } from '../components';

export default function ChefPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Mock data
  const chef = {
    name: 'Chef Kodjo',
    location: 'Tokoin, Lomé',
    phone: '22890123456',
    image: '/placeholder-chef.jpg'
  };

  const todayMenu = {
    midi: { title: 'Riz sauce arachide', description: 'Avec poulet grillé et légumes frais' },
    soir: { title: 'Pâtes à la carbonara', description: 'Crème fraîche, lardons, parmesan' }
  };

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        {/* Header with chef photo */}
        <div style={{ 
          height: '200px', 
          background: '#E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src={chef.image} 
            alt={chef.name}
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '60px', 
              objectFit: 'cover',
              border: '4px solid white'
            }}
          />
        </div>

        <div className="page-content">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
              {chef.name}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <MapPin size={14} />
              {chef.location}
            </div>
          </div>

          <Section title="Menu du jour">
            <MenuItem 
              title={todayMenu.midi.title}
              description={todayMenu.midi.description}
              mealType="Midi"
            />
            <MenuItem 
              title={todayMenu.soir.title}
              description={todayMenu.soir.description}
              mealType="Soir"
            />
          </Section>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate(`/chef/${slug}/menu`)}
            >
              <Calendar size={20} />
              Voir tous les menus
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/chef/${slug}/subscribe`)}
            >
              S'abonner
            </button>
          </div>

          <Section title="Informations">
            <div className="card">
              <InfoRow label="Localisation" value={chef.location} />
              <InfoRow label="Rayon de livraison" value="10 km" />
              <InfoRow label="Jours de service" value="Lun - Sam" />
            </div>
          </Section>

          <button 
            className="btn btn-whatsapp"
            onClick={() => {
              const msg = `Bonjour ${chef.name}, je souhaite avoir plus d'informations sur vos formules d'abonnement.`;
              window.open(`https://wa.me/${chef.phone}?text=${encodeURIComponent(msg)}`, '_blank');
            }}
          >
            <MessageCircle size={20} />
            Contacter sur WhatsApp
          </button>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
