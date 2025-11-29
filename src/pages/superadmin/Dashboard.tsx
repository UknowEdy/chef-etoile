import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Users, Settings, LogOut, TrendingUp } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../utils/storage';
import SuperAdminBottomNav from '../../components/SuperAdminBottomNav';

interface GlobalKpi {
  totalChefs: number;
  totalSubscribers: number;
  totalActiveMealsToday: number;
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [kpi, setKpi] = useState<GlobalKpi>({
    totalChefs: 0,
    totalSubscribers: 0,
    totalActiveMealsToday: 0
  });

  useEffect(() => {
    const allChefs = StorageService.getAllChefs();
    const allSubs = StorageService.getSubscriptions();

    const totalChefs = allChefs.length;
    const activeSubs = allSubs.filter((sub) => sub.status === 'active');
    const uniqueSubscribers = new Set(activeSubs.map((sub) => sub.clientEmail)).size;

    let totalMeals = 0;
    activeSubs.forEach((sub) => {
      totalMeals += sub.planId === 'complet' ? 2 : 1;
    });

    setKpi({
      totalChefs,
      totalSubscribers: uniqueSubscribers,
      totalActiveMealsToday: totalMeals
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/superadmin/login');
  };

  const menuItems = [
    { icon: <ChefHat size={24} />, label: 'Gérer les Chefs', path: '/superadmin/chefs' },
    { icon: <Users size={24} />, label: 'Gérer les Utilisateurs', path: '/superadmin/users' },
    { icon: <Settings size={24} />, label: 'Configuration Système', path: '/superadmin/config' }
  ];

  const stats = [
    { label: 'Chefs Actifs', value: kpi.totalChefs.toString(), color: '#111827' },
    { label: 'Abonnés Uniques', value: kpi.totalSubscribers.toString(), color: '#6B7280' },
    { label: 'Repas à Préparer (Total)', value: kpi.totalActiveMealsToday.toString(), color: '#6B7280' }
  ];

  return (
    <AppShell>
      <TopBar title="SuperAdmin" />
      <div className="page">
        <div className="page-content">
          <PageTitle
            title="Tableau de Bord Global"
            subtitle="Vue d'ensemble et métriques de la plateforme"
          />

          <Section title="Métricas Clés">
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

          <Section title="Statistiques Clés">
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Tendances de la Plateforme</h3>
              <p style={{ fontSize: '14px', color: '#6B7280', display: 'flex', alignItems: 'center' }}>
                <TrendingUp size={18} color="#10B981" style={{ marginRight: '8px' }} />
                Le nombre d'abonnements a augmenté de 5% ce mois-ci.
              </p>
            </div>
          </Section>

          <Section title="Navigation Administrative">
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
                  width: '100%',
                  marginBottom: '12px'
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
            onClick={handleLogout}
            style={{ backgroundColor: '#DC2626', color: 'white', borderColor: '#DC2626' }}
          >
            <LogOut size={20} />
            Se déconnecter (SuperAdmin)
          </button>
        </div>
      </div>
      <SuperAdminBottomNav />
    </AppShell>
  );
}
