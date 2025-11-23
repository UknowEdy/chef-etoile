import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Calendar,
  Image,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';
import { WeeklyMenu, DayOfWeek, Dish } from '../types';

interface AdminMenuProps {
  onBack: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DAYS: DayOfWeek[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'];
const DAYS_FR: Record<DayOfWeek, string> = {
  LUNDI: 'Lundi',
  MARDI: 'Mardi',
  MERCREDI: 'Mercredi',
  JEUDI: 'Jeudi',
  VENDREDI: 'Vendredi'
};

export default function AdminMenu({ onBack }: AdminMenuProps) {
  const [menus, setMenus] = useState<WeeklyMenu[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'dishes'>('menu');

  // Form state pour nouveau menu
  const [newMenu, setNewMenu] = useState({
    weekNumber: new Date().getWeek(),
    year: new Date().getFullYear(),
    startDate: '',
    endDate: '',
    meals: DAYS.map(day => ({
      day,
      dejeuner: { name: '', image: '', description: '' },
      diner: { name: '', image: '', description: '' }
    }))
  });

  // Form state pour nouveau plat
  const [newDish, setNewDish] = useState({
    name: '',
    image: '',
    description: '',
    ingredients: '',
    category: 'plat_principal' as const,
    isVegetarian: false,
    containsFish: false,
    containsMeat: true
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menusRes, dishesRes] = await Promise.all([
        fetch(`${API_URL}/api/menu/all`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/dishes`)
      ]);

      const menusData = await menusRes.json();
      const dishesData = await dishesRes.json();

      if (menusData.success) setMenus(menusData.data);
      if (dishesData.success) setDishes(dishesData.data);
    } catch (err) {
      setError('Erreur chargement données');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenu = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newMenu,
          setActive: true
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Menu créé et activé !');
        fetchData();
        // Reset form
        setNewMenu({
          weekNumber: new Date().getWeek() + 1,
          year: new Date().getFullYear(),
          startDate: '',
          endDate: '',
          meals: DAYS.map(day => ({
            day,
            dejeuner: { name: '', image: '', description: '' },
            diner: { name: '', image: '', description: '' }
          }))
        });
      } else {
        setError(data.error || 'Erreur création menu');
      }
    } catch (err) {
      setError('Erreur serveur');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateDish = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/dishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newDish,
          ingredients: newDish.ingredients.split(',').map(i => i.trim())
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Plat créé !');
        fetchData();
        setNewDish({
          name: '',
          image: '',
          description: '',
          ingredients: '',
          category: 'plat_principal',
          isVegetarian: false,
          containsFish: false,
          containsMeat: true
        });
      } else {
        setError(data.error || 'Erreur création plat');
      }
    } catch (err) {
      setError('Erreur serveur');
    } finally {
      setSaving(false);
    }
  };

  const handleActivateMenu = async (menuId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/menu/${menuId}/activate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Menu activé !');
        fetchData();
      }
    } catch (err) {
      setError('Erreur activation');
    }
  };

  const handleDeleteDish = async (dishId: string) => {
    if (!confirm('Supprimer ce plat ?')) return;
    try {
      await fetch(`${API_URL}/api/dishes/${dishId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      setError('Erreur suppression');
    }
  };

  const updateMeal = (dayIndex: number, mealType: 'dejeuner' | 'diner', field: string, value: string) => {
    setNewMenu(prev => ({
      ...prev,
      meals: prev.meals.map((meal, i) =>
        i === dayIndex
          ? { ...meal, [mealType]: { ...meal[mealType], [field]: value } }
          : meal
      )
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-chef-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-chef-black text-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-serif font-bold flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-chef-orange" />
            Gestion Menu
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'menu'
                ? 'border-chef-orange text-chef-orange'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4 inline-block mr-2" />
            Menus
          </button>
          <button
            onClick={() => setActiveTab('dishes')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'dishes'
                ? 'border-chef-orange text-chef-orange'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Image className="w-4 h-4 inline-block mr-2" />
            Plats
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
            <button onClick={() => setError('')} className="ml-auto">&times;</button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <Check className="w-5 h-5" />
            {success}
            <button onClick={() => setSuccess('')} className="ml-auto">&times;</button>
          </div>
        )}

        {activeTab === 'menu' ? (
          <div className="space-y-6">
            {/* Créer nouveau menu */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-chef-orange" />
                Créer un nouveau menu
              </h2>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Semaine</label>
                  <input
                    type="number"
                    value={newMenu.weekNumber}
                    onChange={e => setNewMenu(prev => ({ ...prev, weekNumber: parseInt(e.target.value) }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Année</label>
                  <input
                    type="number"
                    value={newMenu.year}
                    onChange={e => setNewMenu(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date début</label>
                  <input
                    type="date"
                    value={newMenu.startDate}
                    onChange={e => setNewMenu(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date fin</label>
                  <input
                    type="date"
                    value={newMenu.endDate}
                    onChange={e => setNewMenu(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Repas par jour */}
              <div className="space-y-4">
                {newMenu.meals.map((meal, dayIndex) => (
                  <div key={meal.day} className="border rounded-lg p-4">
                    <h3 className="font-bold mb-3">{DAYS_FR[meal.day]}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Déjeuner */}
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-chef-orange mb-2">Déjeuner</p>
                        <input
                          placeholder="Nom du plat"
                          value={meal.dejeuner.name}
                          onChange={e => updateMeal(dayIndex, 'dejeuner', 'name', e.target.value)}
                          className="w-full p-2 border rounded mb-2 text-sm"
                        />
                        <input
                          placeholder="URL image"
                          value={meal.dejeuner.image}
                          onChange={e => updateMeal(dayIndex, 'dejeuner', 'image', e.target.value)}
                          className="w-full p-2 border rounded mb-2 text-sm"
                        />
                        <input
                          placeholder="Description"
                          value={meal.dejeuner.description}
                          onChange={e => updateMeal(dayIndex, 'dejeuner', 'description', e.target.value)}
                          className="w-full p-2 border rounded text-sm"
                        />
                      </div>
                      {/* Dîner */}
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-purple-600 mb-2">Dîner</p>
                        <input
                          placeholder="Nom du plat"
                          value={meal.diner.name}
                          onChange={e => updateMeal(dayIndex, 'diner', 'name', e.target.value)}
                          className="w-full p-2 border rounded mb-2 text-sm"
                        />
                        <input
                          placeholder="URL image"
                          value={meal.diner.image}
                          onChange={e => updateMeal(dayIndex, 'diner', 'image', e.target.value)}
                          className="w-full p-2 border rounded mb-2 text-sm"
                        />
                        <input
                          placeholder="Description"
                          value={meal.diner.description}
                          onChange={e => updateMeal(dayIndex, 'diner', 'description', e.target.value)}
                          className="w-full p-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCreateMenu}
                disabled={saving || !newMenu.startDate || !newMenu.endDate}
                className="mt-4 px-6 py-3 bg-chef-orange text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Créer et activer le menu
              </button>
            </div>

            {/* Liste des menus existants */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Menus existants</h2>
              <div className="space-y-3">
                {menus.map(menu => (
                  <div
                    key={menu._id}
                    className={`p-4 border rounded-lg flex items-center justify-between ${
                      menu.isActive ? 'border-green-500 bg-green-50' : ''
                    }`}
                  >
                    <div>
                      <span className="font-medium">Semaine {menu.weekNumber}/{menu.year}</span>
                      {menu.isActive && (
                        <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                          Actif
                        </span>
                      )}
                    </div>
                    {!menu.isActive && (
                      <button
                        onClick={() => handleActivateMenu(menu._id)}
                        className="px-3 py-1 bg-chef-orange text-white rounded text-sm"
                      >
                        Activer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Créer nouveau plat */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-chef-orange" />
                Ajouter un plat
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom du plat *</label>
                  <input
                    value={newDish.name}
                    onChange={e => setNewDish(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Ex: Poulet DG"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL Image *</label>
                  <input
                    value={newDish.image}
                    onChange={e => setNewDish(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    value={newDish.description}
                    onChange={e => setNewDish(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    rows={2}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Ingrédients (séparés par virgule)</label>
                  <input
                    value={newDish.ingredients}
                    onChange={e => setNewDish(prev => ({ ...prev, ingredients: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Poulet, Plantain, Tomate..."
                  />
                </div>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newDish.isVegetarian}
                      onChange={e => setNewDish(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                    />
                    Végétarien
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newDish.containsFish}
                      onChange={e => setNewDish(prev => ({ ...prev, containsFish: e.target.checked }))}
                    />
                    Contient poisson
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newDish.containsMeat}
                      onChange={e => setNewDish(prev => ({ ...prev, containsMeat: e.target.checked }))}
                    />
                    Contient viande
                  </label>
                </div>
              </div>

              <button
                onClick={handleCreateDish}
                disabled={saving || !newDish.name || !newDish.image || !newDish.description}
                className="mt-4 px-6 py-3 bg-chef-orange text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Ajouter le plat
              </button>
            </div>

            {/* Liste des plats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Bibliothèque de plats ({dishes.length})</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dishes.map(dish => (
                  <div key={dish._id} className="border rounded-lg overflow-hidden">
                    {dish.image && (
                      <img src={dish.image} alt={dish.name} className="w-full h-32 object-cover" />
                    )}
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{dish.name}</h3>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          {dish.likesCount} ❤️
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{dish.description}</p>
                      <div className="flex gap-2 mt-2">
                        {dish.isVegetarian && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Végé</span>}
                        {dish.containsFish && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Poisson</span>}
                      </div>
                      <button
                        onClick={() => handleDeleteDish(dish._id)}
                        className="mt-2 text-red-500 text-sm hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper pour obtenir le numéro de semaine
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function(): number {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};
