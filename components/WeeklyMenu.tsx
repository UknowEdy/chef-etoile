import { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface Meal {
  day: string;
  dejeuner: { name: string; description?: string };
  diner: { name: string; description?: string };
}
interface WeeklyMenuData {
  meals: Meal[];
  weekNumber: number;
  year: number;
}

export default function WeeklyMenu() {
  const [menu, setMenu] = useState<WeeklyMenuData | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/weekly-menu`)
      .then(res => res.json())
      .then(data => { if (data.success && data.data) setMenu(data.data); })
      .catch(err => console.error(err));
  }, []);

  if (!menu) {
    return (
      <div className="py-12 bg-gray-50 text-center">
        <p className="text-gray-500">Menu de la semaine à venir...</p>
      </div>
    );
  }
  const dayNames: Record<string, string> = {
    LUNDI: 'Lundi', MARDI: 'Mardi', MERCREDI: 'Mercredi', JEUDI: 'Jeudi', VENDREDI: 'Vendredi'
  };

  return (
    <div className="py-16 bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <span className="text-green-600 font-semibold">
              Semaine {menu.weekNumber} - {menu.year}
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Menu de la Semaine</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos repas fraîchement préparés du lundi au vendredi
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {menu.meals.map((meal) => (
            <div key={meal.day} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-green-500 transition-all">
              <div className="bg-green-600 text-white text-center py-3">
                <h3 className="font-bold text-lg">{dayNames[meal.day]}</h3>
              </div>
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-amber-600">Déjeuner</span>
                </div>
                <p className="font-bold text-gray-900">{meal.dejeuner.name}</p>
                {meal.dejeuner.description && (
                  <p className="text-sm text-gray-500 mt-1">{meal.dejeuner.description}</p>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-600">Dîner</span>
                </div>
                <p className="font-bold text-gray-900">{meal.diner.name}</p>
                {meal.diner.description && (
                  <p className="text-sm text-gray-500 mt-1">{meal.diner.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href="https://wa.me/22891209085?text=Bonjour! Je veux m'abonner"
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition-all shadow-lg">
            📱 S'abonner maintenant via WhatsApp
          </a>
          <p className="text-sm text-gray-500 mt-4">
            10 000 F (Déjeuner + Dîner) • 5 000 F (Déjeuner OU Dîner)
          </p>
        </div>
      </div>
    </div>
  );
}
