import { useNavigate } from 'react-router-dom';
import { Plus, MapPin } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section } from '../../components';

export default function SuperAdminChefs() {
  const navigate = useNavigate();

  const chefs = [
    { id: '1', name: 'Chef Kodjo', slug: 'kodjo', location: 'Tokoin', subscribers: 24, status: 'active' },
    { id: '2', name: 'Chef Anna', slug: 'anna', location: 'Bè', subscribers: 18, status: 'active' },
    { id: '3', name: 'Chef Gloria', slug: 'gloria', location: 'Hédzranawoé', subscribers: 31, status: 'active' }
  ];

  return (
    <AppShell>
      <TopBar title="Chefs★" showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Gérer les Chefs★" 
            subtitle={`${chefs.length} Chefs★ actifs`}
          />

          <button 
            className="btn btn-primary"
            onClick={() => navigate('/superadmin/chefs/new')}
            style={{ marginBottom: '24px' }}
          >
            <Plus size={20} />
            Créer un nouveau Chef★
          </button>

          <Section>
            {chefs.map((chef) => (
              <div key={chef.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                      {chef.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <MapPin size={14} />
                      {chef.location}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>
                      {chef.subscribers} abonnés
                    </div>
                  </div>
                  <span className="badge badge-success">Actif</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }}>
                    Voir le profil
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1 }}>
                    Modifier
                  </button>
                </div>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
