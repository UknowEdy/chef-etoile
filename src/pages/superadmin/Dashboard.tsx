import { useNavigate } from 'react-router-dom';
import { ChefHat, Users, Settings, LogOut } from 'lucide-react';
import AppShell from '../../components/AppShell';
import { LogoFull } from '../../components/Logo';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Chefs★ actifs', value: '12' },
    { label: 'Total abonnés', value: '248' },
    { label: 'Repas/jour', value: '432' }
  ];

  const menuItems = [
    { icon: <ChefHat size={24} />, label: 'Gérer les Chefs★', path: '/superadmin/chefs' },
    { icon: <Users size={24} />, label: 'Utilisateurs', path: '/superadmin/users' },
    { icon: <Settings size={24} />, label: 'Configuration', path: '/superadmin/config' }
  ];

  return (
    <AppShell>
      <div className="page">
        <div className="page-content">
          {/* Logo complet */}
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <LogoFull />
          </div>

          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Administration
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#6B7280',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            Gérez la plateforme Chef★
          </div>

          {/* Stats */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              Statistiques globales
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '12px' 
            }}>
              {stats.map((stat) => (
                <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              Gestion
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  className="card"
                  onClick={() => navigate(item.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    border: '1px solid #E5E7EB',
                    background: 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {item.icon}
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Déconnexion */}
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/superadmin/login')}
          >
            <LogOut size={20} />
            Se déconnecter
          </button>
        </div>
      </div>
    </AppShell>
  );
}
