import React, { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';

interface Dish {
  _id: string;
  name: string;
  description: string;
  image?: string;
  ingredients: string[];
  likesCount: number;
}

interface MenuDay {
  dayOfWeek: string;
  lunch?: Dish;
  dinner?: Dish;
}

interface MenuProps {
  onBackToDashboard: () => void;
}

const DAYS_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const DAYS_LABELS = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi'
};

export function Menu({ onBackToDashboard }: MenuProps) {
  const [menu, setMenu] = useState<MenuDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedDishes, setLikedDishes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu/current');
      const data = await response.json();

      if (!response.ok) {
        setError('Impossible de charger le menu');
        return;
      }

      // Sort meals by day order
      const sortedMeals = DAYS_ORDER.map(day => {
        const meal = data.data.meals.find((m: MenuDay) => m.dayOfWeek === day);
        return meal || { dayOfWeek: day };
      });

      setMenu(sortedMeals);
    } catch (err) {
      setError('Erreur réseau');
      console.error('Fetch menu error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeDish = async (dishId: string) => {
    if (likedDishes.has(dishId)) return; // Already liked

    try {
      const response = await fetch(`/api/dishes/${dishId}/like`, { method: 'POST' });
      if (response.ok) {
        setLikedDishes(new Set(likedDishes).add(dishId));
        // Refresh menu to show updated likes
        fetchMenu();
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-chef-gold" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-stone-900 text-white py-8 px-4">
        <button
          onClick={onBackToDashboard}
          className="text-chef-gold mb-4 font-medium hover:text-yellow-500"
        >
          ← Retour
        </button>
        <h1 className="font-serif text-4xl font-bold">Menu de la semaine</h1>
        <p className="text-stone-300 mt-2">Découvrez les plats de cette semaine</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 m-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Menu Grid */}
      <div className="p-4 space-y-6 max-w-6xl mx-auto">
        {menu.map(day => (
          <div key={day.dayOfWeek} className="bg-stone-50 rounded-xl p-6">
            <h2 className="font-serif text-2xl font-bold text-chef-black mb-6">
              {DAYS_LABELS[day.dayOfWeek as keyof typeof DAYS_LABELS]}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Lunch */}
              <div>
                <h3 className="font-medium text-stone-600 mb-3 text-sm uppercase tracking-wide">
                  Déjeuner
                </h3>
                {day.lunch ? (
                  <DishCard
                    dish={day.lunch}
                    onLike={handleLikeDish}
                    isLiked={likedDishes.has(day.lunch._id)}
                  />
                ) : (
                  <div className="text-stone-400 text-center py-8">
                    Pas de plat disponible
                  </div>
                )}
              </div>

              {/* Dinner */}
              <div>
                <h3 className="font-medium text-stone-600 mb-3 text-sm uppercase tracking-wide">
                  Dîner
                </h3>
                {day.dinner ? (
                  <DishCard
                    dish={day.dinner}
                    onLike={handleLikeDish}
                    isLiked={likedDishes.has(day.dinner._id)}
                  />
                ) : (
                  <div className="text-stone-400 text-center py-8">
                    Pas de plat disponible
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DishCard({
  dish,
  onLike,
  isLiked
}: {
  dish: Dish;
  onLike: (dishId: string) => void;
  isLiked: boolean;
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {dish.image && (
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-lg font-bold text-chef-black">
            {dish.name}
          </h3>
          <button
            onClick={() => onLike(dish._id)}
            disabled={isLiked}
            className={`transition-colors ${
              isLiked
                ? 'text-chef-gold'
                : 'text-stone-400 hover:text-chef-gold'
            }`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="text-stone-600 text-sm mb-3">
          {dish.description}
        </p>
        {dish.ingredients.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-stone-500 mb-1">Ingrédients:</p>
            <p className="text-xs text-stone-500">
              {dish.ingredients.join(', ')}
            </p>
          </div>
        )}
        <div className="text-xs text-stone-400 flex items-center gap-1">
          <Heart size={14} fill="currentColor" />
          {dish.likesCount} votes
        </div>
      </div>
    </div>
  );
}
