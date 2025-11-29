import { useState, useEffect } from 'react';
import { Save, Calendar, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import ChefBottomNav from '../../components/ChefBottomNav';
import { PageTitle, Section, EmptyState } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { StorageService, DayMenu, ChefPlan } from '../../utils/storage';

export default function ChefAdminMenu() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const chefSlug = user?.chefSlug || 'kodjo';
  const [plans, setPlans] = useState<ChefPlan[]>([]);
  const [menuData, setMenuData] = useState<DayMenu[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (!chefSlug) return;
    setPlans(StorageService.getChefPlans(chefSlug));
    setMenuData(StorageService.getMenu(chefSlug));
  }, [chefSlug]);

  const allowMidi = plans.some((p) => p.active && (p.id === 'midi' || p.id === 'complet'));
  const allowSoir = plans.some((p) => p.active && (p.id === 'soir' || p.id === 'complet'));

  const handleDishChange = (dayIndex: number, mealType: 'midi' | 'soir', value: string) => {
    if ((mealType === 'midi' && !allowMidi) || (mealType === 'soir' && !allowSoir)) return;
    setMenuData((prev) =>
      prev.map((item, index) =>
        index === dayIndex ? { ...item, [mealType]: value } : item
      )
    );
    setSaveStatus('idle');
  };

  const handleSave = () => {
    if (!chefSlug) return;
    setSaveStatus('saving');
    try {
      StorageService.saveMenu(chefSlug, menuData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      setSaveStatus('error');
    }
  };

  const saveButtonText = {
    idle: 'Enregistrer le menu',
    saving: 'Sauvegarde en cours...',
    saved: '✅ Menu enregistré !',
    error: '❌ Erreur de sauvegarde'
  }[saveStatus];

  return (
    <AppShell>
      <TopBar title="Gérer le Menu" showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle
            title="Menu de la semaine"
            subtitle={`Édition du menu pour ${chefSlug}`}
          />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/chef/menu/gallery')}
            >
              Galerie Plats
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/chef/menu/history')}
            >
              Historique
            </button>
          </div>

          <Section title="Menu Jour par Jour">
            {menuData.length === 0 ? (
              <EmptyState
                icon={<Utensils size={48} />}
                title="Aucun menu enregistré"
                description="Commencez par remplir vos plats du midi et du soir."
              />
            ) : (
              menuData
                .map((dayItem, index) => {
                  const dayName = dayItem.day.toLowerCase();
                  const midiAllowed =
                    allowMidi &&
                    plans.some(
                      (p) =>
                        p.active &&
                        (p.id === 'midi' || p.id === 'complet') &&
                        p.days.map((d) => d.toLowerCase()).includes(dayName)
                    );
                  const soirAllowed =
                    allowSoir &&
                    plans.some(
                      (p) =>
                        p.active &&
                        (p.id === 'soir' || p.id === 'complet') &&
                        p.days.map((d) => d.toLowerCase()).includes(dayName)
                    );

                  if (!midiAllowed && !soirAllowed) return null;

                  return (
                    <div key={dayItem.day} className="card" style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>
                          <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
                          {dayItem.day}
                        </h3>
                      </div>

                      <div>
                        {midiAllowed && (
                          <>
                            <label className="label">Midi</label>
                            <input
                              className="input"
                              value={dayItem.midi}
                              onChange={(e) => handleDishChange(index, 'midi', e.target.value)}
                              placeholder="Ex: Riz sauce arachide"
                            />
                          </>
                        )}

                        {soirAllowed && (
                          <>
                            <label className="label">Soir</label>
                            <input
                              className="input"
                              value={dayItem.soir}
                              onChange={(e) => handleDishChange(index, 'soir', e.target.value)}
                              placeholder="Ex: Attiéké poisson braisé"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
                .filter(Boolean)
            )}
          </Section>

          <button
            className={`btn ${saveStatus === 'saved' ? 'btn-success' : 'btn-primary'}`}
            onClick={handleSave}
            disabled={saveStatus === 'saving' || saveStatus === 'saved'}
            style={{ marginTop: '20px' }}
          >
            <Save size={20} />
            {saveButtonText}
          </button>
        </div>
      </div>
      <ChefBottomNav />
    </AppShell>
  );
}
