import { Link, useLocation } from 'react-router-dom';
import { Home, ChefHat, Users, Settings } from 'lucide-react';

export default function SuperAdminBottomNav() {
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="bottom-nav">
      <Link
        to="/superadmin/dashboard"
        className={`bottom-nav-item ${isActive('/superadmin/dashboard') ? 'bottom-nav-item-active' : ''}`}
      >
        <Home size={22} />
        <span>Accueil</span>
      </Link>

      <Link
        to="/superadmin/chefs"
        className={`bottom-nav-item ${isActive('/superadmin/chefs') ? 'bottom-nav-item-active' : ''}`}
      >
        <ChefHat size={22} />
        <span>Chefs★</span>
      </Link>

      <Link
        to="/superadmin/users"
        className={`bottom-nav-item ${isActive('/superadmin/users') ? 'bottom-nav-item-active' : ''}`}
      >
        <Users size={22} />
        <span>Users</span>
      </Link>

      <Link
        to="/superadmin/config"
        className={`bottom-nav-item ${isActive('/superadmin/config') ? 'bottom-nav-item-active' : ''}`}
      >
        <Settings size={22} />
        <span>Config</span>
      </Link>
    </div>
  );
}
