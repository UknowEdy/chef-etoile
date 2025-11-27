import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Truck, UtensilsCrossed, LogOut, Settings } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section } from '../../components';

export default function ChefAdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Abonnés actifs', value: '24', color: '#111827' },
    { label: 'Repas du jour', value: '36', color: '#6B7280' },
    { label: 'Livraisons', value: '12', color: '#6B7280' }
  ];

  const menuItems = [
    { icon: <UtensilsCrossed size={24} />, label: 'Gérer les menus', path: '/chef-admin/menu' },
    { icon: <Users size={24} />, label: 'Mes abonnés', path: '/chef-admin/subscribers' },
    { icon: <Calendar size={24} />, label: 'Commandes du jour', path: '/chef-admin/orders' },
    { icon: <Truck size={24} />, label: 'Livraisons', path: '/chef-admin/delivery' },
      { icon: <Settings size={24} />, label: 'Paramètres', path: '/chef-admin/settings' },
  ];

  return (
    <AppShell>
      <TopBar title="Espace Chef★" />
      <div className="page">
        <div className="page-content">
          <PageTitle title="Tableau de bord" subtitle="Bonjour Chef Kodjo !" />

          <Section title="Aujourd'hui">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  style={{ 
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '24px', fontWeight: '700', color: stat.color, marginBottom: '4px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Actions rapides">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="card"
                onClick={() => navigate(item.path)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  cursor: 'pointer',
                  border: '1px solid #E5E7EB',
                  background: '#FFFFFF',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <div style={{ color: '#111827' }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, fontSize: '15px', fontWeight: 600 }}>
                  {item.label}
                </div>
              </button>
            ))}
          </Section>

          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            <LogOut size={20} />
            Se déconnecter
          </button>
        </div>
      </div>
    </AppShell>
  );
}
