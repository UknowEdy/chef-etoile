import { useState, useEffect } from 'react';
import { Download, Trash2, Power, ShieldAlert, Activity, Database, RefreshCw } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import SuperAdminBottomNav from '../../components/SuperAdminBottomNav';
import { PageTitle, Section } from '../../components';
import { StorageService } from '../../utils/storage';

export default function SuperAdminConfig() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [dbSize, setDbSize] = useState<string>('0 KB');

  useEffect(() => {
    const totalBytes = JSON.stringify(localStorage).length;
    setDbSize(`${(totalBytes / 1024).toFixed(2)} KB`);

    const isMaint = localStorage.getItem('app_maintenance_mode') === 'true';
    setMaintenanceMode(isMaint);
  }, []);

  const handleMaintenanceToggle = (active: boolean) => {
    setMaintenanceMode(active);
    localStorage.setItem('app_maintenance_mode', String(active));
    if (active) {
      alert('🔒 Application passée en mode maintenance. Seuls les admins peuvent accéder.');
    } else {
      alert('✅ Application réouverte au public.');
    }
  };

  const handleExportData = () => {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chef-etoile-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetApp = () => {
    if (confirm('⚠️ ATTENTION : Cela va effacer TOUTES les données (Chefs, Utilisateurs, Commandes). Cette action est irréversible. Voulez-vous vraiment continuer ?')) {
      if (confirm('Êtes-vous vraiment sûr ? Tapez OUI pour confirmer.')) {
        localStorage.clear();
        alert('♻️ Application réinitialisée avec succès.');
        window.location.reload();
      }
    }
  };

  return (
    <AppShell>
      <TopBar title="Système" showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle
            title="Administration Système"
            subtitle="Maintenance, Backups et Logs"
          />

          <Section title="État du service">
            <div
              className="card"
              style={{
                backgroundColor: maintenanceMode ? '#FEF2F2' : '#F0FDF4',
                border: `1px solid ${maintenanceMode ? '#EF4444' : '#22C55E'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Power size={24} color={maintenanceMode ? '#EF4444' : '#22C55E'} />
                  <div>
                    <div style={{ fontWeight: '700', color: maintenanceMode ? '#EF4444' : '#15803D' }}>
                      {maintenanceMode ? 'Mode Maintenance ACTIF' : 'Système Opérationnel'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>
                      {maintenanceMode ? 'Accès bloqué aux utilisateurs' : 'Tout fonctionne normalement'}
                    </div>
                  </div>
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={!maintenanceMode}
                    onChange={(e) => handleMaintenanceToggle(!e.target.checked)}
                  />
                  <span className="slider round" style={{ backgroundColor: !maintenanceMode ? '#22C55E' : '#EF4444' }}></span>
                </label>
              </div>
            </div>
          </Section>

          <Section title="Base de données locale">
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Database size={24} color="#4F46E5" />
                <div>
                  <div style={{ fontWeight: '600' }}>Stockage Local (LocalStorage)</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Taille actuelle : {dbSize}</div>
                </div>
              </div>

              <button
                className="btn btn-secondary"
                onClick={handleExportData}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={18} />
                Télécharger un Backup (JSON)
              </button>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '8px', textAlign: 'center' }}>
                Sauvegarde complète de toutes les données actuelles du navigateur.
              </div>
            </div>
          </Section>

          <Section title="Dernières activités système">
            <div className="card" style={{ padding: '0' }}>
              {[
                { action: 'Connexion Superadmin', time: "À l'instant", type: 'info' },
                { action: 'Mise à jour Chef Kodjo', time: 'Il y a 2 min', type: 'success' },
                { action: 'Nouvel utilisateur inscrit', time: 'Il y a 15 min', type: 'info' },
                { action: 'Erreur synchronisation image', time: 'Il y a 1h', type: 'error' }
              ].map((log, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px 16px',
                    borderBottom: index < 3 ? '1px solid #F3F4F6' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <Activity size={16} color="#9CA3AF" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{log.action}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{log.time}</div>
                  </div>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor:
                        log.type === 'error'
                          ? '#EF4444'
                          : log.type === 'success'
                          ? '#10B981'
                          : '#3B82F6'
                    }}
                  />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Zone de Danger">
            <div className="card" style={{ border: '1px solid #FECACA', backgroundColor: '#FEF2F2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: '#991B1B' }}>
                <ShieldAlert size={24} />
                <div style={{ fontWeight: '700' }}>Actions Destructrices</div>
              </div>

              <p style={{ fontSize: '13px', color: '#7F1D1D', marginBottom: '16px' }}>
                Ces actions sont irréversibles. Assurez-vous d'avoir fait un backup avant.
              </p>

              <button
                onClick={handleResetApp}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Trash2 size={18} />
                Réinitialiser l'Application (Factory Reset)
              </button>
            </div>
          </Section>
        </div>
      </div>
      <SuperAdminBottomNav />
    </AppShell>
  );
}
