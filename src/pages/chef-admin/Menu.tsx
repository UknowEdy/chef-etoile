import { useState } from 'react';
import { Plus, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section, WeekSelector } from '../../components';

export default function ChefAdminMenu() {
  const navigate = useNavigate();
  const [activeWeek, setActiveWeek] = useState('Cette semaine');
  const [showForm, setShowForm] = useState(false);

  const weeks = ['Cette semaine', 'Semaine prochaine'];

  const menus = [
    { day: 'Lundi', midi: 'Riz sauce tomate', soir: 'Attiéké poisson' },
    { day: 'Mardi', midi: '', soir: '' },
    { day: 'Mercredi', midi: '', soir: '' },
    { day: 'Jeudi', midi: '', soir: '' },
    { day: 'Vendredi', midi: '', soir: '' },
    { day: 'Samedi', midi: '', soir: '' }
  ];

  return (
    <AppShell>
      <TopBar title="Gérer les menus" showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle title="Mes menus" subtitle="Planifiez vos menus de la semaine" />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
              style={{ flex: 1 }}
            >
              <Plus size={20} />
              Ajouter un plat
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/chef-admin/menu/history')}
            >
              <History size={20} />
            </button>
          </div>

          {showForm && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <label className="label">Jour</label>
              <select className="input">
                <option>Lundi</option>
                <option>Mardi</option>
                <option>Mercredi</option>
                <option>Jeudi</option>
                <option>Vendredi</option>
                <option>Samedi</option>
              </select>

              <label className="label">Moment</label>
              <select className="input">
                <option>Midi</option>
                <option>Soir</option>
              </select>

              <label className="label">Plat principal</label>
              <input type="text" className="input" placeholder="Ex: Riz sauce arachide" />

              <label className="label">Description</label>
              <textarea className="textarea" placeholder="Accompagnements, allergènes..." />

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Annuler
                </button>
                <button className="btn btn-primary" onClick={() => setShowForm(false)}>
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          <WeekSelector 
            weeks={weeks}
            activeWeek={activeWeek}
            onWeekChange={setActiveWeek}
          />

          {menus.map((menu) => (
            <Section key={menu.day} title={menu.day}>
              <div className="card">
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', marginBottom: '4px' }}>
                    MIDI
                  </div>
                  {menu.midi ? (
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{menu.midi}</div>
                  ) : (
                    <div style={{ fontSize: '14px', color: '#6B7280', fontStyle: 'italic' }}>
                      Pas encore défini
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', marginBottom: '4px' }}>
                    SOIR
                  </div>
                  {menu.soir ? (
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{menu.soir}</div>
                  ) : (
                    <div style={{ fontSize: '14px', color: '#6B7280', fontStyle: 'italic' }}>
                      Pas encore défini
                    </div>
                  )}
                </div>
              </div>
            </Section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
