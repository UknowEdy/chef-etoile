import { useState } from 'react';
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle, Section } from '../components';

export default function MyOrders() {
  const [expandedDay, setExpandedDay] = useState<string>('');

  // Mock: Abonnements du client
  const subscriptions = [
    {
      chefSlug: 'kodjo',
      chefName: 'Chef Kodjo',
      plan: 'complet', // midi, soir, complet
    },
    {
      chefSlug: 'anna',
      chefName: 'Chef Anna',
      plan: 'midi',
    }
  ];

  // Mock: Menus des chefs pour la semaine
  const chefsMenus: any = {
    kodjo: [
      { day: 'Lundi', midi: 'Riz sauce tomate', soir: 'Attiéké poisson' },
      { day: 'Mardi', midi: 'Pâtes bolognaise', soir: 'Fufu sauce graine' },
      { day: 'Mercredi', midi: 'Riz sauce arachide', soir: 'Pizza maison' },
      { day: 'Jeudi', midi: 'Couscous poulet', soir: 'Riz sauté légumes' },
      { day: 'Vendredi', midi: 'Poisson braisé + attiéké', soir: 'Spaghetti carbonara' },
      { day: 'Samedi', midi: 'Poulet rôti + frites', soir: 'Riz haricots' }
    ],
    anna: [
      { day: 'Lundi', midi: 'Fufu sauce gombo', soir: 'Riz gras' },
      { day: 'Mardi', midi: 'Attiéké sauce arachide', soir: 'Pâtes sauce tomate' },
      { day: 'Mercredi', midi: 'Riz haricots', soir: 'Poisson braisé' },
      { day: 'Jeudi', midi: 'Pizza maison', soir: 'Couscous légumes' },
      { day: 'Vendredi', midi: 'Riz sauté', soir: 'Fufu sauce graine' },
      { day: 'Samedi', midi: 'Attiéké poisson', soir: 'Spaghetti bolognaise' }
    ]
  };

  // Construire le calendrier des repas de la semaine
  const weeklyMeals: any[] = [];
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  days.forEach((day, dayIndex) => {
    const dayMeals: any = { day, midi: [], soir: [] };

    subscriptions.forEach((sub) => {
      const menu = chefsMenus[sub.chefSlug][dayIndex];
      
      if (sub.plan === 'midi' || sub.plan === 'complet') {
        dayMeals.midi.push({
          chef: sub.chefName,
          dish: menu.midi
        });
      }
      
      if (sub.plan === 'soir' || sub.plan === 'complet') {
        dayMeals.soir.push({
          chef: sub.chefName,
          dish: menu.soir
        });
      }
    });

    weeklyMeals.push(dayMeals);
  });

  const today = new Date().getDay(); // 0 = Dimanche
  const todayIndex = today === 0 ? -1 : today - 1; // Lundi = 0

  return (
    <AppShell>
      <TopBar showLogo={true} />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Mes repas de la semaine" 
            subtitle="Consultez votre menu personnalisé"
          />

          {/* Repas d'aujourd'hui */}
          {todayIndex >= 0 && todayIndex < weeklyMeals.length && (
            <Section title="🔥 Aujourd'hui">
              <div className="card" style={{ background: '#F4E4B0', border: '2px solid #D4AF37' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                  {weeklyMeals[todayIndex].day}
                </div>

                {weeklyMeals[todayIndex].midi.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                      🌅 Midi
                    </div>
                    {weeklyMeals[todayIndex].midi.map((meal: any, idx: number) => (
                      <div key={idx} style={{ 
                        background: 'white', 
                        padding: '12px', 
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}>
                        <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                          {meal.dish}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          {meal.chef}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {weeklyMeals[todayIndex].soir.length > 0 && (
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                      🌙 Soir
                    </div>
                    {weeklyMeals[todayIndex].soir.map((meal: any, idx: number) => (
                      <div key={idx} style={{ 
                        background: 'white', 
                        padding: '12px', 
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}>
                        <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                          {meal.dish}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          {meal.chef}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Reste de la semaine */}
          <Section title="📅 Toute la semaine">
            {weeklyMeals.map((dayMeal, index) => (
              <div key={index} className="card" style={{ marginBottom: '12px' }}>
                <div 
                  onClick={() => setExpandedDay(expandedDay === dayMeal.day ? '' : dayMeal.day)}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                      {dayMeal.day}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>
                      {dayMeal.midi.length + dayMeal.soir.length} repas
                    </div>
                  </div>
                  {expandedDay === dayMeal.day ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>

                {expandedDay === dayMeal.day && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                    {dayMeal.midi.length > 0 && (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                          🌅 Midi
                        </div>
                        {dayMeal.midi.map((meal: any, idx: number) => (
                          <div key={idx} style={{ 
                            background: '#F9FAFB', 
                            padding: '10px', 
                            borderRadius: '8px',
                            marginBottom: '6px'
                          }}>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                              {meal.dish}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6B7280' }}>
                              {meal.chef}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {dayMeal.soir.length > 0 && (
                      <div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                          🌙 Soir
                        </div>
                        {dayMeal.soir.map((meal: any, idx: number) => (
                          <div key={idx} style={{ 
                            background: '#F9FAFB', 
                            padding: '10px', 
                            borderRadius: '8px',
                            marginBottom: '6px'
                          }}>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                              {meal.dish}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6B7280' }}>
                              {meal.chef}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </Section>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
