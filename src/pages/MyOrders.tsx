import { Calendar, Clock } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle, Section, EmptyState } from '../components';

export default function MyOrders() {
  // Mock data
  const orders = [
    {
      id: '1',
      chefName: 'Chef Kodjo',
      meal: 'Riz sauce arachide',
      mealType: 'Midi',
      date: "Aujourd'hui",
      time: '12:00',
      status: 'En préparation',
      statusColor: 'warning'
    },
    {
      id: '2',
      chefName: 'Chef Kodjo',
      meal: 'Pâtes carbonara',
      mealType: 'Soir',
      date: "Aujourd'hui",
      time: '19:00',
      status: 'Programmé',
      statusColor: 'default'
    }
  ];

  const getBadgeClass = (color: string) => {
    if (color === 'warning') return 'badge-warning';
    if (color === 'success') return 'badge-success';
    return 'badge badge-secondary';
  };

  return (
    <AppShell>
      <TopBar showLogo={true} />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Mes repas du jour" 
            subtitle="Suivez vos commandes en temps réel"
          />

          {orders.length > 0 ? (
            <Section>
              {orders.map((order) => (
                <div key={order.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
                        {order.mealType} • {order.chefName}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                        {order.meal}
                      </div>
                    </div>
                    <span className={`badge ${getBadgeClass(order.statusColor)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex',
                    gap: '16px',
                    fontSize: '13px',
                    color: '#6B7280'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      {order.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {order.time}
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          ) : (
            <EmptyState
              icon={<Calendar size={48} />}
              title="Aucun repas prévu"
              description="Vous n'avez pas de repas programmé pour aujourd'hui"
            />
          )}

          <Section title="Historique">
            <div className="card">
              <div style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center' }}>
                Consultez l'historique de vos repas dans votre espace abonné
              </div>
            </div>
          </Section>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
