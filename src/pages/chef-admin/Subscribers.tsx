import { Users, Phone } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section } from '../../components';

export default function ChefAdminSubscribers() {
  const subscribers = [
    { id: '1', name: 'Jean Dupont', phone: '+228 90 12 34 56', plan: 'Formule Complète', status: 'active' },
    { id: '2', name: 'Marie Kouassi', phone: '+228 90 23 45 67', plan: 'Formule Midi', status: 'active' },
    { id: '3', name: 'Pierre Agbodjan', phone: '+228 90 34 56 78', plan: 'Formule Soir', status: 'active' }
  ];

  return (
    <AppShell>
      <TopBar title="Mes abonnés" showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Mes abonnés" 
            subtitle={`${subscribers.length} abonnés actifs`}
          />

          <Section>
            {subscribers.map((sub) => (
              <div key={sub.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                      {sub.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                      {sub.plan}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} />
                      {sub.phone}
                    </div>
                  </div>
                  <span className="badge badge-success">Actif</span>
                </div>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
