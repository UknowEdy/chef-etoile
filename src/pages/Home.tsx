import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import AppShell from '../components/AppShell';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="page">
        <div className="hero">
          {/* Logo complet Chef★ */}
          <img 
            src="/images/chef-etoile-logo.png" 
            alt="Chef★" 
            style={{ 
              width: '160px', 
              height: 'auto', 
              marginBottom: '16px',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          />
          <div className="hero-description">
            Abonnez-vous aux meilleurs chefs de votre quartier et recevez des repas frais chaque jour
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/find')}>
            <MapPin size={20} />
            Trouver un Chef près de moi
          </button>
        </div>

        <div className="page-content">
          <div className="section">
            <div className="section-title">Comment ça marche ?</div>
            <div className="card">
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>1. Trouvez votre Chef★</div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>
                  Recherchez un Chef★ dans votre quartier (rayon 10 km)
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>2. Choisissez votre formule</div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>
                  Midi, soir ou les deux ? Choisissez votre abonnement hebdomadaire
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>3. Recevez vos repas</div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>
                  Des repas frais livrés chaque jour selon votre formule
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
