import { Link, useLocation } from 'react-router-dom';
import { Home, Users, ClipboardList, UtensilsCrossed, Settings } from 'lucide-react';

const ACTIVE_COLOR = '#D4AF37';
const INACTIVE_COLOR = '#6B7280';

const navItems = [
  { path: '/chef/dashboard', label: 'Accueil', icon: Home },
  { path: '/chef/orders', label: 'Commandes', icon: ClipboardList },
  { path: '/chef/subscribers', label: 'Abonnés', icon: Users },
  { path: '/chef/menu', label: 'Menu', icon: UtensilsCrossed },
  { path: '/chef/settings', label: 'Réglages', icon: Settings }
];

export default function ChefBottomNav() {
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === '/chef/dashboard') return pathname === '/chef/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <div className="bottom-nav">
      {navItems.map(({ path, label, icon: Icon }) => {
        const active = isActive(path);
        const color = active ? ACTIVE_COLOR : INACTIVE_COLOR;
        return (
          <Link
            key={path}
            to={path}
            className={`bottom-nav-item ${active ? 'bottom-nav-item-active' : ''}`}
            style={{ color }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span style={{ fontWeight: active ? 700 : 500 }}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
