import { useState, useEffect } from 'react';
import { Save, Calendar, Utensils, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section, EmptyState } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { StorageService, DayMenu } from '../../utils/storage';

export default function ChefAdminMenu() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const chefSlug = user?.chefSlug || 'kodjo';
  const [menuData, setMenuData] = useState<DayMenu[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (chefSlug) {
      setMenuData(StorageService.getMenu(chefSlug));
    }
  }, [chefSlug]);

  const handleDishChange = (dayIndex: number, mealType: 'midi' | 'soir', value: string) => {
    setMenuData((prev) =>
      prev.map((item, index) =>
        index === dayIndex ? { ...item, [mealType]: value } : item
      )
    );
    setSaveStatus('idle');
  };

  const handleAbsentToggle = (dayIndex: number) => {
    setMenuData((prev) =>
      prev.map((item, index) =>
        index === dayIndex ? { ...item, isAbsent: !item.isAbsent } : item
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
              onClick={() => navigate('/chef-admin/menu/gallery')}
            >
              Galerie Plats
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/chef-admin/menu/history')}
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
              menuData.map((dayItem, index) => (
                <div key={dayItem.day} className="card" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: dayItem.isAbsent ? '#EF4444' : '#111827' }}>
                      <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
                      {dayItem.day}
                    </h3>
                    <button
                      onClick={() => handleAbsentToggle(index)}
                      style={{ background: 'none', border: '1px solid #E5E7EB', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', color: dayItem.isAbsent ? '#EF4444' : '#4B5563' }}
                    >
                      {dayItem.isAbsent ? <XCircle size={14} style={{ display: 'inline', marginRight: '4px' }} /> : null}
                      {dayItem.isAbsent ? 'Jour OFF' : 'Mettre en OFF'}
                    </button>
                  </div>

                  <div style={{ opacity: dayItem.isAbsent ? 0.4 : 1, pointerEvents: dayItem.isAbsent ? 'none' : 'auto' }}>
                    <label className="label">Midi</label>
                    <input
                      className="input"
                      value={dayItem.midi}
                      onChange={(e) => handleDishChange(index, 'midi', e.target.value)}
                      placeholder="Ex: Riz sauce arachide"
                    />

                    <label className="label">Soir</label>
                    <input
                      className="input"
                      value={dayItem.soir}
                      onChange={(e) => handleDishChange(index, 'soir', e.target.value)}
                      placeholder="Ex: Attiéké poisson braisé"
                    />
                  </div>
                </div>
              ))
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
    </AppShell>
  );
}
