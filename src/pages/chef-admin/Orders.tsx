import { useEffect, useState, useMemo } from 'react';
import { CheckCircle, Clock, Utensils, Printer } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section, EmptyState } from '../../components';
import { StorageService } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';

const mockMenus: Record<string, { midi: string; soir: string }> = {
  kodjo: {
    midi: 'Riz sauce arachide',
    soir: 'Attiéké poisson braisé'
  },
  anna: {
    midi: 'Pâtes bolognaise',
    soir: 'Salade composée'
  }
};

interface DishQuantity {
  dish: string;
  quantity: number;
  moment: 'midi' | 'soir';
}

const groupDishesByQuantity = (mySubs: any[], currentChefSlug: string): DishQuantity[] => {
  const dishCounts: Record<string, { midi: number; soir: number }> = {};

  mySubs.forEach((sub) => {
    const menu = mockMenus[currentChefSlug] || mockMenus.kodjo;

    if (sub.planId === 'midi' || sub.planId === 'complet') {
      const dish = menu.midi;
      if (!dishCounts[dish]) dishCounts[dish] = { midi: 0, soir: 0 };
      dishCounts[dish].midi += 1;
    }

    if (sub.planId === 'soir' || sub.planId === 'complet') {
      const dish = menu.soir;
      if (!dishCounts[dish]) dishCounts[dish] = { midi: 0, soir: 0 };
      dishCounts[dish].soir += 1;
    }
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

  const currentChefSlug = user?.chefSlug || 'kodjo';

  useEffect(() => {
    if (!currentChefSlug) return;

    const allSubs = StorageService.getSubscriptions();
    const mySubs = allSubs.filter((sub) => sub.chefSlug === currentChefSlug);

    let countMidi = 0;
    let countSoir = 0;
    mySubs.forEach((sub) => {
      if (sub.planId === 'midi' || sub.planId === 'complet') countMidi++;
      if (sub.planId === 'soir' || sub.planId === 'complet') countSoir++;
    });

    setStats({
      midi: countMidi,
      soir: countSoir,
      total: countMidi + countSoir
    });

    setProductionList(groupDishesByQuantity(mySubs, currentChefSlug));
  }, [currentChefSlug]);

  const midiDishes = useMemo(() => productionList.filter((item) => item.moment === 'midi'), [productionList]);
  const soirDishes = useMemo(() => productionList.filter((item) => item.moment === 'soir'), [productionList]);

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

              <button
                className="btn btn-secondary"
                onClick={() => alert('Fonctionnalité Impression en cours de développement !')}
                style={{ marginBottom: '24px' }}
              >
                <Printer size={20} />
                Imprimer le Pass de Cuisine
              </button>

              <Section title="Détail de la production">
                {midiDishes.length > 0 && (
                  <div className="card" style={{ marginBottom: '12px' }}>
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
                  </div>
                )}

                {soirDishes.length > 0 && (
                  <div className="card">
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
    </AppShell>
  );
}
