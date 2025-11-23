import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  ArrowLeft,
  Heart,
  Clock,
  Calendar,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { WeeklyMenu, DayOfWeek, User } from '../types';

interface MenuProps {
  user?: User | null;
  onBack: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DAYS_FR: Record<DayOfWeek, string> = {
  LUNDI: 'Lundi',
  MARDI: 'Mardi',
  MERCREDI: 'Mercredi',
  JEUDI: 'Jeudi',
  VENDREDI: 'Vendredi'
};

export default function Menu({ user, onBack }: MenuProps) {
  const [currentMenu, setCurrentMenu] = useState<WeeklyMenu | null>(null);
  const [historyMenus, setHistoryMenus] = useState<WeeklyMenu[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('LUNDI');
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likedDishes, setLikedDishes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const [currentRes, historyRes] = await Promise.all([
        fetch(`${API_URL}/api/menu/current`),
        fetch(`${API_URL}/api/menu/history`)
      ]);

      const currentData = await currentRes.json();
      const historyData = await historyRes.json();

      if (currentData.success && currentData.data) {
        setCurrentMenu(currentData.data);
      }
      if (historyData.success) {
        setHistoryMenus(historyData.data);
      }
    } catch (error) {
      console.error('Erreur chargement menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (dishId: string) => {
    if (!user) {
      alert('Connectez-vous pour voter');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/dishes/${dishId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        setLikedDishes(prev => {
          const newSet = new Set(prev);
          if (data.liked) {
            newSet.add(dishId);
          } else {
            newSet.delete(dishId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Erreur vote:', error);
    }
  };

  const currentDayMenu = currentMenu?.meals.find(m => m.day === selectedDay);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-chef-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-chef-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chef-cream">
      {/* Header */}
      <header className="bg-chef-black text-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-chef-orange rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-bold">
              Menu<span className="text-chef-gold">★</span>
            </span>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Titre semaine */}
        {currentMenu && (
          <div className="text-center mb-6">
            <h1 className="font-serif text-2xl font-bold text-chef-black mb-2">
              {showHistory ? 'Historique des menus' : 'Menu de la semaine'}
            </h1>
            {!showHistory && (
              <p className="text-gray-500 text-sm">
                Semaine {currentMenu.weekNumber} • {formatDate(currentMenu.startDate)} - {formatDate(currentMenu.endDate)}
              </p>
            )}
          </div>
        )}

        {!showHistory ? (
          <>
            {/* Sélecteur de jour */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
              {(['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'] as DayOfWeek[]).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                    selectedDay === day
                      ? 'bg-chef-orange text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {DAYS_FR[day]}
                </button>
              ))}
            </div>

            {/* Menu du jour */}
            {currentDayMenu ? (
              <div className="space-y-6">
                {/* Déjeuner */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-chef-orange/10 px-4 py-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-chef-orange" />
                    <span className="font-medium text-chef-orange">Déjeuner</span>
                  </div>
                  {currentDayMenu.dejeuner.name ? (
                    <div className="p-4">
                      {currentDayMenu.dejeuner.image && (
                        <img
                          src={currentDayMenu.dejeuner.image}
                          alt={currentDayMenu.dejeuner.name}
                          className="w-full h-48 object-cover rounded-xl mb-4"
                        />
                      )}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-chef-black">
                            {currentDayMenu.dejeuner.name}
                          </h3>
                          {currentDayMenu.dejeuner.description && (
                            <p className="text-gray-500 text-sm mt-1">
                              {currentDayMenu.dejeuner.description}
                            </p>
                          )}
                        </div>
                        {currentDayMenu.dejeuner.dish && (
                          <button
                            onClick={() => handleLike(currentDayMenu.dejeuner.dish!)}
                            className={`p-2 rounded-full transition-colors ${
                              likedDishes.has(currentDayMenu.dejeuner.dish)
                                ? 'bg-red-100 text-red-500'
                                : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400'
                            }`}
                          >
                            <Heart
                              className="w-5 h-5"
                              fill={likedDishes.has(currentDayMenu.dejeuner.dish!) ? 'currentColor' : 'none'}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <Utensils className="w-8 h-8 mx-auto mb-2" />
                      <p>Menu à venir</p>
                    </div>
                  )}
                </div>

                {/* Dîner */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-purple-100 px-4 py-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-600">Dîner</span>
                  </div>
                  {currentDayMenu.diner.name ? (
                    <div className="p-4">
                      {currentDayMenu.diner.image && (
                        <img
                          src={currentDayMenu.diner.image}
                          alt={currentDayMenu.diner.name}
                          className="w-full h-48 object-cover rounded-xl mb-4"
                        />
                      )}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-chef-black">
                            {currentDayMenu.diner.name}
                          </h3>
                          {currentDayMenu.diner.description && (
                            <p className="text-gray-500 text-sm mt-1">
                              {currentDayMenu.diner.description}
                            </p>
                          )}
                        </div>
                        {currentDayMenu.diner.dish && (
                          <button
                            onClick={() => handleLike(currentDayMenu.diner.dish!)}
                            className={`p-2 rounded-full transition-colors ${
                              likedDishes.has(currentDayMenu.diner.dish)
                                ? 'bg-red-100 text-red-500'
                                : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400'
                            }`}
                          >
                            <Heart
                              className="w-5 h-5"
                              fill={likedDishes.has(currentDayMenu.diner.dish!) ? 'currentColor' : 'none'}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <Utensils className="w-8 h-8 mx-auto mb-2" />
                      <p>Menu à venir</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center">
                <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Aucun menu disponible pour ce jour</p>
              </div>
            )}

            {/* Info vote */}
            {user && (
              <div className="mt-6 bg-chef-gold/10 rounded-xl p-4 border border-chef-gold/20">
                <p className="text-sm text-chef-black text-center">
                  <Heart className="w-4 h-4 inline-block mr-1 text-red-500" />
                  Votez pour vos plats préférés ! Les plus aimés reviendront la semaine prochaine.
                </p>
              </div>
            )}
          </>
        ) : (
          /* Historique */
          <div className="space-y-4">
            {historyMenus.length > 0 ? (
              historyMenus.map((menu) => (
                <div key={menu._id} className="bg-white rounded-2xl shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-chef-black">
                      Semaine {menu.weekNumber}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(menu.startDate)} - {formatDate(menu.endDate)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {menu.meals.map((meal) => (
                      <div key={meal.day} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                        <span className="w-20 text-sm font-medium text-gray-500">
                          {DAYS_FR[meal.day]}
                        </span>
                        <div className="flex-1 text-sm">
                          <span className="text-chef-orange">{meal.dejeuner.name || '-'}</span>
                          <span className="text-gray-400 mx-2">•</span>
                          <span className="text-purple-600">{meal.diner.name || '-'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Aucun historique disponible</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
