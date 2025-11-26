import { Clock, Check } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section } from '../../components';

export default function ChefAdminOrders() {
  const orders = [
    { id: '1', customer: 'Jean Dupont', meal: 'Riz sauce arachide', mealType: 'Midi', status: 'pending' },
    { id: '2', customer: 'Marie Kouassi', meal: 'Riz sauce arachide', mealType: 'Midi', status: 'pending' },
    { id: '3', customer: 'Pierre Agbodjan', meal: 'Pâtes carbonara', mealType: 'Soir', status: 'pending' }
  ];

  return (
    <AppShell>
      <TopBar title="Commandes du jour" showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Commandes du jour" 
            subtitle={`${orders.length} repas à préparer`}
          />

          <Section title="Midi">
            {orders.filter(o => o.mealType === 'Midi').map((order) => (
              <div key={order.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
                      {order.customer}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>
                      {order.meal}
                    </div>
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '8px 16px', width: 'auto' }}>
                    <Check size={18} />
                  </button>
                </div>
              </div>
            ))}
          </Section>

          <Section title="Soir">
            {orders.filter(o => o.mealType === 'Soir').map((order) => (
              <div key={order.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
                      {order.customer}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>
                      {order.meal}
                    </div>
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '8px 16px', width: 'auto' }}>
                    <Check size={18} />
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
