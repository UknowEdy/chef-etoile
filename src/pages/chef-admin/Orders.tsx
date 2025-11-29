import { useEffect, useState, useMemo } from 'react';
import { CheckCircle, Clock, Utensils, Printer, Users } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import ChefBottomNav from '../../components/ChefBottomNav';
import { PageTitle, Section, EmptyState } from '../../components';
import { StorageService, Subscription } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';

interface DishQuantity {
  dish: string;
  quantity: number;
  moment: 'midi' | 'soir';
}

interface ClientMeal {
  clientEmail: string;
  dish: string;
}

const groupDishesByQuantity = (todayMeals: { midi: ClientMeal[]; soir: ClientMeal[] }): DishQuantity[] => {
  const dishCounts: Record<string, { midi: number; soir: number }> = {};

  todayMeals.midi.forEach((m) => {
    if (!dishCounts[m.dish]) dishCounts[m.dish] = { midi: 0, soir: 0 };
    dishCounts[m.dish].midi += 1;
  });

  todayMeals.soir.forEach((m) => {
    if (!dishCounts[m.dish]) dishCounts[m.dish] = { midi: 0, soir: 0 };
    dishCounts[m.dish].soir += 1;
  });

  const result: DishQuantity[] = [];

  Object.keys(dishCounts).forEach((dish) => {
    if (dishCounts[dish].midi > 0) {
      result.push({ dish, quantity: dishCounts[dish].midi, moment: 'midi' });
    }
    if (dishCounts[dish].soir > 0) {
      result.push({ dish, quantity: dishCounts[dish].soir, moment: 'soir' });
    }
  });

  return result;
};

export default function ChefAdminOrders() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ midi: 0, soir: 0, total: 0 });
  const [productionList, setProductionList] = useState<DishQuantity[]>([]);
  const [todayMeals, setTodayMeals] = useState<{ midi: ClientMeal[]; soir: ClientMeal[] }>({ midi: [], soir: [] });
  const [expanded, setExpanded] = useState<'midi' | 'soir' | ''>('');

  const currentChefSlug = user?.chefSlug || 'kodjo';

  useEffect(() => {
    if (!currentChefSlug) return;

    const allSubs = StorageService.getSubscriptions();
    const mySubs = allSubs.filter((sub) => sub.chefSlug === currentChefSlug && sub.status === 'active');

    const menu = StorageService.getMenu(currentChefSlug);
    const dayIndex = new Date().getDay(); // 0 dimanche
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const dayName = dayNames[dayIndex];
    const todayMenu = menu[dayIndex === 0 ? 6 : dayIndex - 1] || menu[0];

    const midiMeals: ClientMeal[] = [];
    const soirMeals: ClientMeal[] = [];

    mySubs.forEach((sub: Subscription) => {
      if (sub.days?.map((d) => d.toLowerCase()).includes(dayName)) {
        if (sub.planId === 'midi' || sub.planId === 'complet') {
          midiMeals.push({ clientEmail: sub.clientEmail, dish: todayMenu?.midi || 'Plat midi' });
        }
        if (sub.planId === 'soir' || sub.planId === 'complet') {
          soirMeals.push({ clientEmail: sub.clientEmail, dish: todayMenu?.soir || 'Plat soir' });
        }
      }
    });

    setStats({
      midi: midiMeals.length,
      soir: soirMeals.length,
      total: midiMeals.length + soirMeals.length
    });

    setTodayMeals({ midi: midiMeals, soir: soirMeals });
    setProductionList(groupDishesByQuantity({ midi: midiMeals, soir: soirMeals }));
  }, [currentChefSlug]);

  const midiDishes = useMemo(() => productionList.filter((item) => item.moment === 'midi'), [productionList]);
  const soirDishes = useMemo(() => productionList.filter((item) => item.moment === 'soir'), [productionList]);

  const handlePrint = () => {
    const summary = `Pass de cuisine - Midi: ${stats.midi} plats, Soir: ${stats.soir} plats`;
    if (navigator.share) {
      navigator.share({ title: 'Pass de cuisine Chef★', text: summary }).catch(() => window.print());
    } else {
      window.print();
    }
  };

  return (
    <AppShell>
      <TopBar title="Commandes du jour" showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle
            title="Pass de cuisine"
            subtitle="Volume des plats à préparer pour aujourd'hui"
          />

          {stats.total > 0 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div className="card" style={{ background: '#FEF3C7', borderColor: '#FCD3D1', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', marginBottom: '4px' }}>
                    SERVICE MIDI
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#B45309' }}>
                    {stats.midi}
                  </div>
                  <div style={{ fontSize: '12px', color: '#92400E' }}>plats à sortir</div>
                </div>

                <div className="card" style={{ background: '#DBEAFE', borderColor: '#93C5FD', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E40AF', marginBottom: '4px' }}>
                    SERVICE SOIR
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1E3A8A' }}>
                    {stats.soir}
                  </div>
                  <div style={{ fontSize: '12px', color: '#1E40AF' }}>plats à sortir</div>
                </div>
              </div>

              <button className="btn btn-secondary" onClick={handlePrint} style={{ marginBottom: '24px' }}>
                <Printer size={20} />
                Imprimer / Partager le Pass de Cuisine
              </button>

              <Section title="Détail de la production">
                {midiDishes.length > 0 && (
                  <div className="card" style={{ marginBottom: '12px', cursor: 'pointer' }} onClick={() => setExpanded(expanded === 'midi' ? '' : 'midi')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                      <Clock size={18} color="#92400E" />
                      <span style={{ fontWeight: '700', color: '#92400E' }}>MIDI ({stats.midi} TOTAL)</span>
                    </div>

                    {midiDishes.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '10px 0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: i < midiDishes.length - 1 ? '1px solid #F3F4F6' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Utensils size={18} color="#4B5563" />
                          <span style={{ fontWeight: '600', fontSize: '15px' }}>{item.dish}</span>
                        </div>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                    {expanded === 'midi' && todayMeals.midi.length > 0 && (
                      <div style={{ marginTop: '12px', borderTop: '1px solid #F3F4F6', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                          <Users size={16} /> Clients service midi
                        </div>
                        {todayMeals.midi.map((m, idx) => (
                          <div key={`mclient-${idx}`} style={{ fontSize: '13px', color: '#111827', marginBottom: '4px' }}>
                            {m.clientEmail} — {m.dish}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {soirDishes.length > 0 && (
                  <div className="card" style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === 'soir' ? '' : 'soir')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                      <Clock size={18} color="#1E40AF" />
                      <span style={{ fontWeight: '700', color: '#1E40AF' }}>SOIR ({stats.soir} TOTAL)</span>
                    </div>

                    {soirDishes.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '10px 0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: i < soirDishes.length - 1 ? '1px solid #F3F4F6' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Utensils size={18} color="#4B5563" />
                          <span style={{ fontWeight: '600', fontSize: '15px' }}>{item.dish}</span>
                        </div>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                    {expanded === 'soir' && todayMeals.soir.length > 0 && (
                      <div style={{ marginTop: '12px', borderTop: '1px solid #F3F4F6', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                          <Users size={16} /> Clients service soir
                        </div>
                        {todayMeals.soir.map((m, idx) => (
                          <div key={`sclient-${idx}`} style={{ fontSize: '13px', color: '#111827', marginBottom: '4px' }}>
                            {m.clientEmail} — {m.dish}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Section>
            </>
          ) : (
            <EmptyState
              icon={<CheckCircle size={48} />}
              title="Tout est calme"
              description="Aucune commande prévue pour aujourd'hui."
            />
          )}
        </div>
      </div>
      <ChefBottomNav />
    </AppShell>
  );
}
