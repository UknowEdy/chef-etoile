import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section, InfoRow } from '../../components';

export default function SuperAdminConfig() {
  return (
    <AppShell>
      <TopBar title="Configuration" showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Configuration" 
            subtitle="Paramètres globaux de la plateforme"
          />

          <Section title="Tarification">
            <div className="card">
              <InfoRow label="Formule Midi" value="7 500 F" />
              <InfoRow label="Formule Soir" value="7 500 F" />
              <InfoRow label="Formule Complète" value="14 000 F" />
            </div>
            <button className="btn btn-secondary">
              Modifier les tarifs
            </button>
          </Section>

          <Section title="Livraison">
            <div className="card">
              <InfoRow label="Rayon maximum" value="10 km" />
              <InfoRow label="Frais de livraison" value="Inclus" />
            </div>
            <button className="btn btn-secondary">
              Modifier les paramètres
            </button>
          </Section>

          <Section title="Informations">
            <div className="card">
              <InfoRow label="Version de l'app" value="1.0.0" />
              <InfoRow label="Environnement" value="Production" />
            </div>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
