import { useState } from 'react';
import { Save, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section } from '../../components';

export default function ChefAdminMenu() {
  const navigate = useNavigate();
  const [activeWeek, setActiveWeek] = useState('Cette semaine');

  // Données séparées pour chaque semaine
  const [menusCetteSemaine, setMenusCetteSemaine] = useState({
    lundi: { midi: 'Riz sauce tomate', soir: 'Attiéké poisson' },
    mardi: { midi: '', soir: '' },
    mercredi: { midi: '', soir: '' },
    jeudi: { midi: '', soir: '' },
    vendredi: { midi: '', soir: '' },
    samedi: { midi: '', soir: '' },
    dimanche: { midi: '', soir: '' }
  });

  const [menusSemaineProchaine, setMenusSemaineProchaine] = useState({
    lundi: { midi: '', soir: '' },
    mardi: { midi: '', soir: '' },
    mercredi: { midi: '', soir: '' },
    jeudi: { midi: '', soir: '' },
    vendredi: { midi: '', soir: '' },
    samedi: { midi: '', soir: '' },
    dimanche: { midi: '', soir: '' }
  });

  const weeks = ['Cette semaine', 'Semaine prochaine'];
  const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  // Récupérer les menus selon la semaine active
  const menusActifs = activeWeek === 'Cette semaine' ? menusCetteSemaine : menusSemaineProchaine;
  const setMenusActifs = activeWeek === 'Cette semaine' ? setMenusCetteSemaine : setMenusSemaineProchaine;

  const handleMenuChange = (jour: string, moment: 'midi' | 'soir', value: string) => {
    setMenusActifs({
      ...menusActifs,
      [jour]: { ...menusActifs[jour as keyof typeof menusActifs], [moment]: value }
    });
  };

  const handleSave = () => {
    alert(`Menus de "${activeWeek}" sauvegardés !`);
    console.log('Menus cette semaine:', menusCetteSemaine);
    console.log('Menus semaine prochaine:', menusSemaineProchaine);
  };

  const menusRemplis = jours.filter(j => {
    const menu = menusActifs[j as keyof typeof menusActifs];
    return menu.midi || menu.soir;
  }).length;

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Gérer mes menus" 
            subtitle={`${menusRemplis}/7 jours complétés pour ${activeWeek.toLowerCase()}`}
          />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/chef-admin/menu/gallery')}
              style={{ flex: 1 }}
            >
              <Eye size={20} />
              Mes Plats
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/chef-admin/menu/history')}
            >
              Historique
            </button>
          </div>

          <div className="week-selector" style={{ marginBottom: '24px' }}>
            {weeks.map((week) => (
              <button
                key={week}
                className={`week-button ${activeWeek === week ? 'active' : ''}`}
                onClick={() => setActiveWeek(week)}
              >
                {week}
              </button>
            ))}
          </div>

          {jours.map((jour) => {
            const menu = menusActifs[jour as keyof typeof menusActifs];
            return (
              <Section key={jour} title={jour.charAt(0).toUpperCase() + jour.slice(1)}>
                <div className="card">
                  <label className="label">🌅 Déjeuner (Midi)</label>
                  <input 
                    type="text"
                    className="input"
                    placeholder="Ex: Riz sauce arachide + poulet"
                    value={menu.midi}
                    onChange={(e) => handleMenuChange(jour, 'midi', e.target.value)}
                  />

                  <label className="label">🌙 Dîner (Soir)</label>
                  <input 
                    type="text"
                    className="input"
                    placeholder="Ex: Attiéké poisson braisé"
                    value={menu.soir}
                    onChange={(e) => handleMenuChange(jour, 'soir', e.target.value)}
                  />
                </div>
              </Section>
            );
          })}

          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={20} />
            Sauvegarder {activeWeek.toLowerCase()}
          </button>

          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: '#D1FAE5', 
            borderRadius: '12px',
            fontSize: '13px',
            color: '#065F46'
          }}>
            💡 Les modifications ne s'appliquent qu'à <strong>{activeWeek.toLowerCase()}</strong>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
