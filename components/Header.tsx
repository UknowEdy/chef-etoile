import React from 'react';
import { Star, UtensilsCrossed, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
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

        <button 
          onClick={() => onNavigate('ADMIN')}
          className="p-2 text-xs font-medium text-stone-400 hover:text-chef-black transition-colors"
        >
          <ShieldCheck className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};