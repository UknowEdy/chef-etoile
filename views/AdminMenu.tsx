import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Edit2 } from 'lucide-react';

interface Dish {
  _id: string;
  name: string;
  description: string;
  image?: string;
  ingredients: string[];
  likesCount: number;
}

interface MenuDay {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
  lunch?: string;
  dinner?: string;
}

interface AdminMenuProps {
  onBackToAdmin: () => void;
}

const DAYS_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const DAYS_LABELS = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi'
};

export function AdminMenu({ onBackToAdmin }: AdminMenuProps) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [menu, setMenu] = useState<MenuDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDishForm, setShowDishForm] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    ingredients: ''
  });

  useEffect(() => {
    fetchDishes();
    fetchMenu();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await fetch('/api/dishes');
      const data = await response.json();
      if (response.ok) {
        setDishes(data.data);
      }
    } catch (err) {
      console.error('Fetch dishes error:', err);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu/current');
      const data = await response.json();
      if (response.ok) {
        setMenu(data.data.meals || []);
      }
    } catch (err) {
      console.error('Fetch menu error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name || !newDish.description) {
      setError('Nom et description requis');
      return;
    }

    try {
      const response = await fetch('/api/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDish.name,
          description: newDish.description,
          ingredients: newDish.ingredients.split(',').map(i => i.trim())
        })
      });

      if (response.ok) {
        setNewDish({ name: '', description: '', ingredients: '' });
        setShowDishForm(false);
        fetchDishes();
      } else {
        setError('Erreur lors de la création du plat');
      }
    } catch (err) {
      setError('Erreur réseau');
      console.error('Create dish error:', err);
    }
  };

  const handleSetMeal = async (day: string, mealType: 'lunch' | 'dinner', dishId: string) => {
    try {
      const response = await fetch(`/api/menu/${menu[0]?._id || ''}/meal/${day}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [mealType]: dishId
        })
      });

      if (response.ok) {
        fetchMenu();
      }
    } catch (err) {
      console.error('Set meal error:', err);
    }
  };

  const handleDeleteDish = async (dishId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) return;

    try {
      const response = await fetch(`/api/dishes/${dishId}`, { method: 'DELETE' });
      if (response.ok) {
        fetchDishes();
      }
    } catch (err) {
      console.error('Delete dish error:', err);
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
          onClick={onBackToAdmin}
          className="text-chef-gold mb-4 font-medium hover:text-yellow-500"
        >
          ← Retour
        </button>
        <h1 className="font-serif text-4xl font-bold">Gestion du menu</h1>
        <p className="text-stone-300 mt-2">Créez et attribuez les plats au menu</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 m-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="p-4 max-w-6xl mx-auto space-y-8">
        {/* Create Dish Section */}
        <div className="bg-stone-50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-2xl font-bold">Plats disponibles</h2>
            <button
              onClick={() => setShowDishForm(!showDishForm)}
              className="flex items-center gap-2 bg-chef-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              <Plus size={18} />
              Nouveau plat
            </button>
          </div>

          {showDishForm && (
            <form onSubmit={handleCreateDish} className="bg-white p-6 rounded-lg mb-6 border border-stone-200">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Nom du plat"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  className="px-4 py-2 border border-stone-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="px-4 py-2 border border-stone-300 rounded-lg"
                  required
                />
              </div>
              <textarea
                placeholder="Ingrédients (séparés par des virgules)"
                value={newDish.ingredients}
                onChange={(e) => setNewDish({ ...newDish, ingredients: e.target.value })}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg mb-4"
                rows={3}
              />
              <button
                type="submit"
                className="bg-chef-gold text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
              >
                Créer le plat
              </button>
            </form>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {dishes.map(dish => (
              <div key={dish._id} className="bg-white p-4 rounded-lg border border-stone-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-chef-black">{dish.name}</h3>
                  <button
                    onClick={() => handleDeleteDish(dish._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-sm text-stone-600 mb-2">{dish.description}</p>
                <p className="text-xs text-stone-500">
                  {dish.ingredients.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Assignment */}
        <div className="bg-stone-50 rounded-xl p-6">
          <h2 className="font-serif text-2xl font-bold mb-6">Planifier le menu</h2>

          {DAYS_ORDER.map(day => (
            <div key={day} className="bg-white p-6 rounded-lg mb-4 border border-stone-200">
              <h3 className="font-bold text-lg mb-4">
                {DAYS_LABELS[day as keyof typeof DAYS_LABELS]}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {['lunch', 'dinner'].map(mealType => (
                  <div key={mealType}>
                    <p className="font-medium text-stone-600 mb-3 capitalize">
                      {mealType === 'lunch' ? 'Déjeuner' : 'Dîner'}
                    </p>
                    <select
                      onChange={(e) => handleSetMeal(day, mealType as any, e.target.value)}
                      defaultValue=""
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                    >
                      <option value="">Sélectionnez un plat</option>
                      {dishes.map(dish => (
                        <option key={dish._id} value={dish._id}>
                          {dish.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
