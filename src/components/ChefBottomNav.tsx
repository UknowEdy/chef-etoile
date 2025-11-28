import { Link, useLocation } from 'react-router-dom';
import { Home, Users, ClipboardList, UtensilsCrossed, Settings } from 'lucide-react';

export default function ChefBottomNav() {
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="bottom-nav">
      <Link to="/chef-admin/dashboard" className={`bottom-nav-item ${isActive('/chef-admin/dashboard') ? 'bottom-nav-item-active' : ''}`}>
        <Home size={22} />
        <span>Accueil</span>
      </Link>

      <Link to="/chef-admin/orders" className={`bottom-nav-item ${isActive('/chef-admin/orders') ? 'bottom-nav-item-active' : ''}`}>
        <ClipboardList size={22} />
        <span>Commandes</span>
      </Link>

      <Link to="/chef-admin/subscribers" className={`bottom-nav-item ${isActive('/chef-admin/subscribers') ? 'bottom-nav-item-active' : ''}`}>
        <Users size={22} />
        <span>Abonnés</span>
      </Link>

      <Link to="/chef-admin/menu" className={`bottom-nav-item ${isActive('/chef-admin/menu') ? 'bottom-nav-item-active' : ''}`}>
        <UtensilsCrossed size={22} />
        <span>Menu</span>
      </Link>

      <Link to="/chef-admin/settings" className={`bottom-nav-item ${isActive('/chef-admin/settings') ? 'bottom-nav-item-active' : ''}`}>
        <Settings size={22} />
        <span>Réglages</span>
      </Link>
    </div>
  );
}
