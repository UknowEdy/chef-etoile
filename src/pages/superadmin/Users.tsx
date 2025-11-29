import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle } from '../../components';
import SuperAdminBottomNav from '../../components/SuperAdminBottomNav';

export default function SuperAdminUsers() {
  const users = [
    { id: '1', name: 'Jean Dupont', email: 'jean@example.com', subscriptions: 2, status: 'active' },
    { id: '2', name: 'Marie Martin', email: 'marie@example.com', subscriptions: 1, status: 'active' },
    { id: '3', name: 'Pierre Doe', email: 'pierre@example.com', subscriptions: 0, status: 'inactive' }
  ];

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Utilisateurs" 
            subtitle={`${users.length} utilisateurs inscrits`}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {users.map((user) => (
              <div key={user.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>
                    {user.name}
                  </div>
                  <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                  {user.email}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  {user.subscriptions} abonnement{user.subscriptions > 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SuperAdminBottomNav />
    </AppShell>
  );
}
