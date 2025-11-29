import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Calendar, Users, Truck, UtensilsCrossed, LogOut, Settings, MapPin, Star, AlertTriangle } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import ChefBottomNav from '../../components/ChefBottomNav';
import { PageTitle } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../utils/storage';

type StatCard = {
  label: string;
  value: string;
  color: string;
  extra?: string;
  path: string;
};

export default function ChefAdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const chefSlug = user?.chefSlug || 'kodjo';
  const chefProfile = StorageService.getChefBySlug(chefSlug);
  const ratingStats = useMemo(() => StorageService.getChefRatingStats(chefSlug), [chefSlug]);
  const isSuspended = chefProfile?.isSuspended;

  const stats: StatCard[] = [
    { label: 'Abonnés actifs', value: '24', color: '#111827', path: '/chef/subscribers' },
    { label: 'Repas du jour', value: '36', color: '#6B7280', path: '/chef/orders' },
    { label: 'Livraisons', value: '12', color: '#6B7280', path: '/chef/delivery' }
  ];

  const menuItems = [
    { icon: <UtensilsCrossed size={22} />, label: 'Gérer les menus', path: '/chef/menu', hint: 'Menus de la semaine' },
    { icon: <Users size={22} />, label: 'Mes abonnés', path: '/chef/subscribers', hint: 'Liste et contact' },
    { icon: <Calendar size={22} />, label: 'Commandes du jour', path: '/chef/orders', hint: 'Pass de cuisine' },
    { icon: <Truck size={22} />, label: 'Livraisons', path: '/chef/delivery', hint: 'Tournées & itinéraires' },
    { icon: <Settings size={22} />, label: 'Paramètres', path: '/chef/settings', hint: 'Tarifs, horaires' }
  ];

  if (isSuspended) {
    return (
      <AppShell>
        <TopBar title="Espace Chef★" />
        <div className="page">
          <div className="page-content">
            <div
              className="card"
              style={{
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                textAlign: 'center'
              }}
            >
              <AlertTriangle size={32} style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '18px', fontWeight: 700 }}>Compte suspendu</div>
              <div style={{ fontSize: '13px', marginTop: '6px' }}>
                Votre compte est suspendu par l'administrateur. Contactez le support pour être réactivé.
              </div>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '14px' }}
                onClick={() => navigate('/chef/support')}
              >
                Contacter le support
              </button>
            </div>
          </div>
        </div>
        <ChefBottomNav />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title="Espace Chef★" />
      <div className="page">
        <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Hero */}
          <div className="card" style={{ padding: '16px', border: '1px solid #E5E7EB', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>Tableau de bord</div>
                <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
                  Bonjour {chefProfile?.name || 'Chef'} !
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} /> {chefProfile?.location || 'Lomé'}
                </div>
              </div>
              <div
                className="card"
                style={{
                  padding: '10px 12px',
                  border: '1px solid #E5E7EB',
                  minWidth: '120px',
                  textAlign: 'right'
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#D4AF37', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px' }}>
                  <Star size={16} fill="#D4AF37" color="#D4AF37" />
                  {ratingStats.average.toFixed(1)}
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>Note moyenne</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                  {ratingStats.count} vote{ratingStats.count > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {stats.map((stat) => (
              <button
                key={stat.label}
                onClick={() => navigate(stat.path)}
                className="card"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '14px',
                  padding: '14px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>{stat.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: stat.color }}>
                  {stat.value}
                </div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="card" style={{ border: '1px solid #E5E7EB', borderRadius: '14px', padding: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Actions rapides</div>
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
                    cursor: 'pointer',
                    border: '1px solid #E5E7EB',
                    background: '#FFFFFF',
                    textAlign: 'left',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ color: '#111827' }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{item.hint}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#D4AF37', fontWeight: 700 }}>›</div>
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => {
              logout();
              navigate('/chef/login');
            }}
          >
            <LogOut size={20} />
            Se déconnecter
          </button>
        </div>
      </div>
      <ChefBottomNav />
    </AppShell>
  );
}
