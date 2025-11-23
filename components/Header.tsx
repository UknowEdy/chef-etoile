import React from 'react';
import { Star, UtensilsCrossed, ShieldCheck, User, LogIn, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  onNavigate: (view: any) => void;
  user?: UserType | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, user, onLogin, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('HOME')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="relative">
             <UtensilsCrossed className="w-6 h-6 text-chef-black" />
             <Star className="w-3 h-3 text-chef-gold absolute -top-1 -right-1 fill-chef-gold" />
          </div>
          <span className="font-serif text-xl font-bold tracking-wide text-chef-black">
            Chef<span className="text-chef-gold">★</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Bouton dashboard utilisateur */}
              <button
                onClick={() => onNavigate(user.role === 'admin' ? 'ADMIN_DASHBOARD' : 'CLIENT_DASHBOARD')}
                className="flex items-center gap-2 px-3 py-2 bg-chef-orange/10 text-chef-orange rounded-lg hover:bg-chef-orange/20 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">
                  {user.fullName.split(' ')[0]}
                </span>
              </button>

              {/* Bouton déconnexion */}
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              {/* Bouton connexion */}
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-4 py-2 bg-chef-orange text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-medium">Connexion</span>
              </button>

              {/* Bouton admin (discret) */}
              <button
                onClick={() => onNavigate('ADMIN_LOGIN')}
                className="p-2 text-xs font-medium text-stone-300 hover:text-chef-black transition-colors"
                title="Accès Admin"
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
