import { useParams } from 'react-router-dom';
import { Star, MapPin, Phone } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import { PageTitle } from '../components';

export default function ChefProfile() {
  const { slug } = useParams();

  const chefsData: any = {
    kodjo: { name: 'Chef Kodjo', quartier: 'Tokoin', phone: '+228 90 12 34 56', rating: 4.8, totalRatings: 127, subscribers: 24 },
    anna: { name: 'Chef Anna', quartier: 'Bè', phone: '+228 90 23 45 67', rating: 4.9, totalRatings: 203, subscribers: 18 },
    gloria: { name: 'Chef Gloria', quartier: 'Hèdzranawoé', phone: '+228 90 34 56 78', rating: 4.7, totalRatings: 89, subscribers: 31 },
    yao: { name: 'Chef Yao', quartier: 'Adidogomé', phone: '+228 90 45 67 89', rating: 4.6, totalRatings: 156, subscribers: 15 },
    ama: { name: 'Chef Ama', quartier: 'Nyékonakpoè', phone: '+228 90 56 78 90', rating: 4.5, totalRatings: 67, subscribers: 22 }
  };
  
  const chef = chefsData[slug || ''] || chefsData.kodjo;

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title={chef.name}
            subtitle={chef.quartier}
          />

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>
                {chef.rating}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>
                <Star size={12} style={{ display: 'inline', marginRight: '2px' }} />
                Note
              </div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>
                {chef.totalRatings}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Avis</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>
                {chef.subscribers}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Abonnés</div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              Contact
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '8px' }}>
              <Phone size={16} color="#6B7280" />
              {chef.phone}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <MapPin size={16} color="#6B7280" />
              {chef.quartier}, Lomé
            </div>
          </div>

          <div className="card" style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              Menu cette semaine
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>
              Lundi : Riz sauce arachide<br />
              Mardi : Pâtes sauce tomate<br />
              Mercredi : Fufu sauce gombo<br />
              Jeudi : Attiéké poisson<br />
              Vendredi : Riz gras
            </div>
          </div>

          <button className="btn btn-primary">
            S'abonner à {chef.name}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
