import { useNavigate } from 'react-router-dom';
import { User, CreditCard, LifeBuoy, UtensilsCrossed, MapPin, FileText, ChevronRight, LogOut } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle } from '../components';

export default function MyAccount() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: 'Mon Profil', path: '/my/profile', description: 'Modifier mes informations' },
    { icon: FileText, label: 'Mes Abonnements', path: '/my/subscriptions', description: 'Gérer mes abonnements actifs' },
    { icon: MapPin, label: 'Mon Point de Retrait', path: '/my/pickup-point', description: 'Modifier mes coordonnées GPS' },
    { icon: CreditCard, label: 'Historique Paiements', path: '/my/payments', description: 'Voir mes transactions' },
    { icon: UtensilsCrossed, label: 'Préférences Alimentaires', path: '/my/preferences', description: 'Allergies, régimes spéciaux' },
    { icon: LifeBuoy, label: 'Support', path: '/support', description: 'Aide et assistance' }
  ];

  return (
    <AppShell>
      <TopBar showLogo={true} />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Mon Compte" 
            subtitle="Gérez votre profil et vos préférences"
          />

          {/* User Info Card */}
          <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              border: '3px solid #D4AF37'
            }}>
              <User size={40} color="#6B7280" />
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              Jean Dupont
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>
              +228 90 12 34 56
            </div>
          </div>

          {/* Menu Items */}
          <div style={{ marginBottom: '24px' }}>
            {menuItems.map((item) => (
              <div
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#F4E4B0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <item.icon size={20} color="#B8941F" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '2px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    {item.description}
                  </div>
                </div>
                <ChevronRight size={20} color="#6B7280" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div 
          className="card" 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => navigate('/login')}
        >
          <LogOut size={20} color="#EF4444" />
          <span style={{ color: '#EF4444', fontWeight: '600', fontSize: '15px' }}>Se déconnecter</span>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
