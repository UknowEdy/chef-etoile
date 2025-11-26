import { useNavigate } from 'react-router-dom';
import { ChefHat, Users, Settings, LogOut } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section } from '../../components';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Chefs★ actifs', value: '12', color: '#111827' },
    { label: 'Total abonnés', value: '248', color: '#6B7280' },
    { label: 'Repas/jour', value: '432', color: '#6B7280' }
  ];

  const menuItems = [
    { icon: <ChefHat size={24} />, label: 'Gérer les Chefs★', path: '/superadmin/chefs' },
    { icon: <Users size={24} />, label: 'Utilisateurs', path: '/superadmin/users' },
    { icon: <Settings size={24} />, label: 'Configuration', path: '/superadmin/config' }
  ];

  return (
    <AppShell>
      <TopBar title="Super Admin" />
      <div className="page">
        <div className="page-content">
          <PageTitle title="Administration" subtitle="Gérez la plateforme Chef★" />

          <Section title="Statistiques globales">
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

          <Section title="Gestion">
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
