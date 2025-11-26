import { MapPin, Phone, Check } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section } from '../../components';

export default function ChefAdminDelivery() {
  const deliveries = [
    { 
      id: '1', 
      customer: 'Jean Dupont', 
      address: 'Tokoin Cassablanca, Rue 245',
      phone: '+228 90 12 34 56',
      meal: 'Riz sauce arachide',
      mealType: 'Midi',
      time: '12:00',
      status: 'pending' 
    },
    { 
      id: '2', 
      customer: 'Marie Kouassi', 
      address: 'Bè Kpota, Rue 18',
      phone: '+228 90 23 45 67',
      meal: 'Riz sauce arachide',
      mealType: 'Midi',
      time: '12:30',
      status: 'pending' 
    }
  ];

  return (
    <AppShell>
      <TopBar title="Livraisons" showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Livraisons du jour" 
            subtitle={`${deliveries.length} livraisons à effectuer`}
          />

          <Section>
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                      {delivery.customer}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                      {delivery.meal} ({delivery.mealType})
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '4px' }}>
                      <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      {delivery.address}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={14} />
                      {delivery.phone}
                    </div>
                  </div>
                  <span className="badge badge-warning">{delivery.time}</span>
                </div>
                <button className="btn btn-primary" style={{ marginTop: '8px' }}>
                  <Check size={18} />
                  Marquer comme livré
                </button>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
