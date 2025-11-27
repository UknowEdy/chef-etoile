import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section } from '../../components';

export default function SuperAdminChefConfig() {
  const { chefId } = useParams();
  const navigate = useNavigate();

  // Données du Chef (à remplacer par API)
  const chefName = chefId === '1' ? 'Chef Kodjo' : chefId === '2' ? 'Chef Anna' : 'Chef Gloria';

  const [settings, setSettings] = useState({
    prixMidi: '7500',
    prixSoir: '7500',
    prixComplet: '14000',
    joursService: {
      lundi: true,
      mardi: true,
      mercredi: true,
      jeudi: true,
      vendredi: true,
      samedi: true,
      dimanche: false
    },
    rayonLivraison: '10',
    telephone: '+228 90 12 34 56',
    adresse: 'Tokoin, Lomé',
    horairesLivraison: '11h30-13h00 / 18h30-20h00',
    status: 'active'
  });

  const handleSave = () => {
    alert(`Paramètres de ${chefName} sauvegardés !`);
    navigate('/superadmin/chefs');
  };

  const handleJourChange = (jour: string, checked: boolean) => {
    setSettings({
      ...settings,
      joursService: { ...settings.joursService, [jour]: checked }
    });
  };

  const joursTotal = Object.values(settings.joursService).filter(Boolean).length;

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title={`Configuration - ${chefName}`}
            subtitle="Modifier les paramètres de ce Chef★"
          />

          <Section title="Tarifs d'abonnement">
            <div className="card">
              <label className="label">Formule Midi (par semaine)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input 
                  type="number"
                  className="input"
                  value={settings.prixMidi}
                  onChange={(e) => setSettings({ ...settings, prixMidi: e.target.value })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>F CFA</span>
              </div>

              <label className="label">Formule Soir (par semaine)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input 
                  type="number"
                  className="input"
                  value={settings.prixSoir}
                  onChange={(e) => setSettings({ ...settings, prixSoir: e.target.value })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>F CFA</span>
              </div>

              <label className="label">Formule Complète (par semaine)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="number"
                  className="input"
                  value={settings.prixComplet}
                  onChange={(e) => setSettings({ ...settings, prixComplet: e.target.value })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>F CFA</span>
              </div>
            </div>
          </Section>

          <Section title={`Jours de service (${joursTotal}/7)`}>
            <div className="card">
              {Object.entries(settings.joursService).map(([jour, actif]) => (
                <label 
                  key={jour}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '12px 0',
                    borderBottom: '1px solid #E5E7EB',
                    cursor: 'pointer'
                  }}
                >
                  <input 
                    type="checkbox"
                    checked={actif}
                    onChange={(e) => handleJourChange(jour, e.target.checked)}
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      marginRight: '12px',
                      cursor: 'pointer',
                      accentColor: '#D4AF37'
                    }}
                  />
                  <span style={{ 
                    fontSize: '15px', 
                    fontWeight: 500,
                    textTransform: 'capitalize'
                  }}>
                    {jour}
                  </span>
                </label>
              ))}
            </div>
          </Section>

          <Section title="Livraison">
            <div className="card">
              <label className="label">Rayon de livraison (km)</label>
              <input 
                type="number"
                className="input"
                value={settings.rayonLivraison}
                onChange={(e) => setSettings({ ...settings, rayonLivraison: e.target.value })}
                max="15"
                min="1"
              />

              <label className="label">Horaires de livraison</label>
              <input 
                type="text"
                className="input"
                value={settings.horairesLivraison}
                onChange={(e) => setSettings({ ...settings, horairesLivraison: e.target.value })}
              />
            </div>
          </Section>

          <Section title="Contact">
            <div className="card">
              <label className="label">Téléphone WhatsApp</label>
              <input 
                type="tel"
                className="input"
                value={settings.telephone}
                onChange={(e) => setSettings({ ...settings, telephone: e.target.value })}
              />

              <label className="label">Adresse</label>
              <input 
                type="text"
                className="input"
                value={settings.adresse}
                onChange={(e) => setSettings({ ...settings, adresse: e.target.value })}
              />
            </div>
          </Section>

          <Section title="Statut">
            <div className="card">
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={settings.status === 'active'}
                  onChange={(e) => setSettings({ ...settings, status: e.target.checked ? 'active' : 'inactive' })}
                  style={{ width: '20px', height: '20px', accentColor: '#D4AF37' }}
                />
                <span style={{ fontSize: '15px', fontWeight: 500 }}>
                  Chef★ actif sur la plateforme
                </span>
              </label>
            </div>
          </Section>

          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={20} />
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </AppShell>
  );
}
