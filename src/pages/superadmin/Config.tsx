import { useState } from 'react';
import { Save } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section } from '../../components';
import SuperAdminBottomNav from '../../components/SuperAdminBottomNav';

export default function SuperAdminConfig() {
  const [isEditingTarifs, setIsEditingTarifs] = useState(false);
  const [isEditingLivraison, setIsEditingLivraison] = useState(false);

  const [tarifs, setTarifs] = useState({
    midi: '7500',
    soir: '7500',
    complet: '14000'
  });

  const [livraison, setLivraison] = useState({
    rayon: '10',
    frais: 'Inclus'
  });

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Configuration" 
            subtitle="Paramètres par défaut de la plateforme"
          />

          <Section title="Tarification par défaut">
            <div className="card">
              {isEditingTarifs ? (
                <>
                  <label className="label">Formule Midi</label>
                  <input 
                    type="number"
                    className="input"
                    value={tarifs.midi}
                    onChange={(e) => setTarifs({ ...tarifs, midi: e.target.value })}
                  />
                  <label className="label">Formule Soir</label>
                  <input 
                    type="number"
                    className="input"
                    value={tarifs.soir}
                    onChange={(e) => setTarifs({ ...tarifs, soir: e.target.value })}
                  />
                  <label className="label">Formule Complète</label>
                  <input 
                    type="number"
                    className="input"
                    value={tarifs.complet}
                    onChange={(e) => setTarifs({ ...tarifs, complet: e.target.value })}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      alert('Tarifs sauvegardés !');
                      setIsEditingTarifs(false);
                    }}
                  >
                    <Save size={20} />
                    Sauvegarder
                  </button>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Formule Midi</strong><br />
                    {tarifs.midi} F
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Formule Soir</strong><br />
                    {tarifs.soir} F
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Formule Complète</strong><br />
                    {tarifs.complet} F
                  </div>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setIsEditingTarifs(true)}
                  >
                    Modifier les tarifs
                  </button>
                </>
              )}
            </div>
          </Section>

          <Section title="Livraison">
            <div className="card">
              {isEditingLivraison ? (
                <>
                  <label className="label">Rayon maximum (km)</label>
                  <input 
                    type="number"
                    className="input"
                    value={livraison.rayon}
                    onChange={(e) => setLivraison({ ...livraison, rayon: e.target.value })}
                  />
                  <label className="label">Frais de livraison</label>
                  <input 
                    type="text"
                    className="input"
                    value={livraison.frais}
                    onChange={(e) => setLivraison({ ...livraison, frais: e.target.value })}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      alert('Paramètres sauvegardés !');
                      setIsEditingLivraison(false);
                    }}
                  >
                    <Save size={20} />
                    Sauvegarder
                  </button>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Rayon maximum</strong><br />
                    {livraison.rayon} km
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Frais de livraison</strong><br />
                    {livraison.frais}
                  </div>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setIsEditingLivraison(true)}
                  >
                    Modifier les paramètres
                  </button>
                </>
              )}
            </div>
          </Section>

          <Section title="Informations">
            <div className="card">
              <div style={{ marginBottom: '8px' }}>
                <strong>Version de l'app</strong><br />
                1.0.0
              </div>
              <div>
                <strong>Environnement</strong><br />
                Production
              </div>
            </div>
          </Section>
        </div>
      </div>
      <SuperAdminBottomNav />
    </AppShell>
  );
}
