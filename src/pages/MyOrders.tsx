import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, UtensilsCrossed, XCircle } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle, Section, EmptyState } from '../components';
import { StorageService } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MyOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedDay, setExpandedDay] = useState<string>('');
  const [weeklyMeals, setWeeklyMeals] = useState<any[]>([]);
  const [hasSubs, setHasSubs] = useState(false);

  const clientEmail = user?.email;

  useEffect(() => {
    if (!clientEmail) {
      setHasSubs(false);
      return;
    }

    const allSubs = StorageService.getSubscriptions();
    const activeSubs = allSubs.filter(
      (sub) => sub.clientEmail === clientEmail && sub.status === 'active'
    );
    setHasSubs(activeSubs.length > 0);

    const generatedMeals: any[] = [];
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const menusBySlug: { [slug: string]: any[] } = {};

    activeSubs.forEach((sub) => {
      if (!menusBySlug[sub.chefSlug]) {
        menusBySlug[sub.chefSlug] = StorageService.getMenu(sub.chefSlug);
      }
    });

    days.forEach((day) => {
      const dayMeals: any = { day, midi: [], soir: [] };

      activeSubs.forEach((sub) => {
        const chefMenu = menusBySlug[sub.chefSlug] || [];
        const menuOfTheDay = chefMenu.find((m: any) => m.day === day);

        if (menuOfTheDay) {
          if (menuOfTheDay.isAbsent) {
            const alertDish = '❌ CHEF ABSENT - Pas de repas';
            dayMeals.midi.push({ chef: sub.chefName, dish: alertDish, isAbsent: true });
            dayMeals.soir.push({ chef: sub.chefName, dish: alertDish, isAbsent: true });
          } else {
            if (sub.planId === 'midi' || sub.planId === 'complet') {
              dayMeals.midi.push({ chef: sub.chefName, dish: menuOfTheDay.midi });
            }
            if (sub.planId === 'soir' || sub.planId === 'complet') {
              dayMeals.soir.push({ chef: sub.chefName, dish: menuOfTheDay.soir });
            }
          }
        }
      });

      dayMeals.midi = dayMeals.midi.filter((m: any, i: number) => !m.isAbsent || i === 0);
      dayMeals.soir = dayMeals.soir.filter((m: any, i: number) => !m.isAbsent || i === 0);

      generatedMeals.push(dayMeals);
    });

    setWeeklyMeals(generatedMeals);
  }, [clientEmail]);

  const today = new Date().getDay();
  const todayIndex = today === 0 ? -1 : today - 1;

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle
            title="Mes repas de la semaine"
            subtitle="Consultez votre menu personnalisé"
          />

          {!hasSubs ? (
            <EmptyState
              icon={<UtensilsCrossed size={48} />}
              title="Menu vide"
              description="Abonnez-vous pour voir vos repas ici."
              actionLabel="Trouver un Chef★"
              onAction={() => navigate('/discover')}
            />
          ) : (
            <>
              {todayIndex >= 0 && todayIndex < weeklyMeals.length && (
                <Section title="🔥 Aujourd'hui">
                  <div className="card" style={{ border: '1px solid #D4AF37', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                      {weeklyMeals[todayIndex].day}
                    </div>

                    {[...weeklyMeals[todayIndex].midi, ...weeklyMeals[todayIndex].soir].length === 0 && (
                      <p style={{ fontSize: '14px', color: '#6B7280' }}>Rien de prévu pour ce jour.</p>
                    )}

                    {[...weeklyMeals[todayIndex].midi, ...weeklyMeals[todayIndex].soir].map((meal: any, idx: number) => (
                      <div
                        key={`m-${idx}`}
                        style={{
                          background: meal.isAbsent ? '#FEE2E2' : 'white',
                          padding: '12px',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          border: meal.isAbsent ? '1px solid #F87171' : 'none'
                        }}
                      >
                        <div style={{ fontWeight: '600', color: meal.isAbsent ? '#DC2626' : 'inherit' }}>
                          {meal.isAbsent ? <XCircle size={16} style={{ display: 'inline', marginRight: '8px' }} /> : null}
                          {meal.dish}
                        </div>
                        <div style={{ fontSize: '12px', color: meal.isAbsent ? '#B91C1C' : 'gray' }}>
                          {meal.chef}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              <Section title="📅 Toute la semaine">
                {weeklyMeals.map((dayMeal, index) => (
                  <div key={index} className="card" style={{ marginBottom: '12px' }}>
                    <div
                      onClick={() => setExpandedDay(expandedDay === dayMeal.day ? '' : dayMeal.day)}
                      style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                    >
                      <strong style={{ color: dayMeal.midi.some((m: any) => m.isAbsent) ? '#DC2626' : '#111827' }}>
                        {dayMeal.day}
                      </strong>
                      {expandedDay === dayMeal.day ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    {expandedDay === dayMeal.day && (
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #E5E7EB' }}>
                        {dayMeal.midi.length === 0 && dayMeal.soir.length === 0 && (
                          <p style={{ fontSize: '13px', color: '#6B7280' }}>Rien de prévu.</p>
                        )}

                        {dayMeal.midi.map((m: any, i: number) => (
                          <div key={i} style={{ fontSize: '14px', color: m.isAbsent ? '#EF4444' : '#111827', marginBottom: '4px' }}>
                            ☀️ Midi : {m.dish} ({m.chef})
                          </div>
                        ))}
                        {dayMeal.soir.map((m: any, i: number) => (
                          <div key={i} style={{ fontSize: '14px', color: m.isAbsent ? '#EF4444' : '#111827', marginBottom: '4px' }}>
                            🌙 Soir : {m.dish} ({m.chef})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </Section>
            </>
          )}
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
