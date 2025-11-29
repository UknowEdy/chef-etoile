import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';

const ACTIVE_COLOR = '#D4AF37';
const INACTIVE_COLOR = '#6B7280';

const navItems = [
  { path: '/', label: 'Accueil', icon: Home },
  { path: '/discover', label: 'Trouver', icon: Search },
  { path: '/my/orders', label: 'Repas', icon: Calendar },
  { path: '/my/account', label: 'Mon Compte', icon: User }
];

export default function BottomNav() {
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <div className="bottom-nav">
      {navItems.map(({ path, label, icon: Icon }) => {
        const active = isActive(path);
        const color = active ? ACTIVE_COLOR : INACTIVE_COLOR;
        return (
          <Link key={path} to={path} className={`bottom-nav-item ${active ? 'active' : ''}`} style={{ color }}>
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
            <span style={{ fontWeight: active ? 700 : 500 }}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
