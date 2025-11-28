import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle, Section, EmptyState } from '../components';
import { StorageService, Subscription } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

export default function MySubscriptions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const clientEmail = user?.email;

  useEffect(() => {
    if (!clientEmail) return;
    const allSubs = StorageService.getSubscriptions();
    const mySubs = allSubs.filter((sub) => sub.clientEmail === clientEmail);
    setSubscriptions(mySubs);
  }, [clientEmail]);

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/my/pickup-point')}
            style={{ marginBottom: '24px' }}
          >
            <MapPin size={20} />
            📍 Mon point de retrait
          </button>

          <PageTitle 
            title="Mes abonnements" 
            subtitle="Gérez vos abonnements actifs"
          />

          {subscriptions.length > 0 ? (
            <Section>
              {subscriptions.map((sub) => (
                <div key={sub.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                        {sub.chefName}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6B7280' }}>
                        {sub.planName}
                      </div>
                    </div>
                    <span className="badge badge-success">Actif</span>
                  </div>
                  
                  <div style={{ 
                    borderTop: '1px solid #E5E7EB', 
                    paddingTop: '12px',
                    marginTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px'
                  }}>
                    <div>
                      <span style={{ color: '#6B7280' }}>Montant:</span>
                      <span style={{ fontWeight: 600, marginLeft: '8px' }}>{sub.price}</span>
                    </div>
                    <div>
                      <span style={{ color: '#6B7280' }}>Début:</span>
                      <span style={{ fontWeight: 600, marginLeft: '8px' }}>{sub.startDate}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-secondary"
                    style={{ marginTop: '12px' }}
                    onClick={() => navigate(`/chefs/${sub.chefSlug}`)}
                  >
                    Voir le Chef★
                  </button>
                </div>
              ))}
            </Section>
          ) : (
            <EmptyState
              icon={<Calendar size={48} />}
              title="Aucun abonnement"
              description="Vous n'avez pas encore d'abonnement actif"
            />
          )}
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
