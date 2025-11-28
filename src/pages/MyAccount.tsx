import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User, FileText, MapPin, LifeBuoy, LogOut, ChevronRight } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle, Section } from '../components';
import { useAuth } from '../context/AuthContext';

export default function MyAccount() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [photo, setPhoto] = useState<string>('');
  const photoKey = user?.email ? `profile_photo_${user.email}` : null;

  useEffect(() => {
    if (!photoKey) return;
    const stored = localStorage.getItem(photoKey);
    if (stored) setPhoto(stored);
  }, [photoKey]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: 'Mon Profil', path: '/my/profile', description: 'Modifier mes informations' },
    { icon: FileText, label: 'Mes Abonnements', path: '/my/subscriptions', description: 'Gérer mes abonnements actifs' },
    { icon: MapPin, label: 'Mon Point de Retrait', path: '/my/pickup-point', description: 'Modifier mes coordonnées GPS' },
    { icon: LifeBuoy, label: 'Support', path: '/support', description: 'Aide et assistance' }
  ];

  return (
    <AppShell>
      <TopBar showLogo title="Mon Compte" showBack />
      <div className="page">
        <div className="page-content">
          <div className="profile-card">
            <div className="profile-avatar">
              {photo ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `url(${photo}) center/cover`
                  }}
                />
              ) : (
                <User size={36} />
              )}
            </div>
            <h2 className="profile-title">{user?.email || 'Visiteur'}</h2>
            <p className="profile-subtitle">
              {user?.role === 'client' ? 'Client Chef★' : 'Connecté'}
            </p>
          </div>

          <Section title="Paramètres et Gestion">
            <div className="card">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="list-item-link"
                  onClick={() => navigate(item.path)}
                >
                  <div className="list-item-link-content">
                    <item.icon size={20} color="#4B5563" />
                    <div>
                      <div className="list-item-label">{item.label}</div>
                      <div className="list-item-description">{item.description}</div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#9CA3AF" />
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div
              className="card list-item-link"
              onClick={handleLogout}
              style={{ padding: '14px 0' }}
            >
              <div className="list-item-link-content">
                <LogOut size={20} color="#EF4444" />
                <span className="list-item-danger">Se déconnecter</span>
              </div>
            </div>
          </Section>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
