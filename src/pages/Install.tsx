import { Download, Smartphone, Home } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import { Section } from '../components';

export default function Install() {
  return (
    <AppShell>
      <TopBar title="Installer l'app" showBack />
      <div className="page">
        <div className="page-content">
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: '#111827',
              borderRadius: '20px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Smartphone size={40} color="white" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              Installez Chef★
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              Accédez plus rapidement à vos repas
            </p>
          </div>

          <Section title="Sur iPhone / iPad">
            <div className="card">
              <ol style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>Appuyez sur le bouton <strong>Partager</strong> (carré avec flèche vers le haut)</li>
                <li>Faites défiler et appuyez sur <strong>"Sur l'écran d'accueil"</strong></li>
                <li>Appuyez sur <strong>Ajouter</strong></li>
              </ol>
            </div>
          </Section>

          <Section title="Sur Android">
            <div className="card">
              <ol style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>Appuyez sur le menu <strong>⋮</strong> (trois points en haut à droite)</li>
                <li>Appuyez sur <strong>"Installer l'application"</strong> ou <strong>"Ajouter à l'écran d'accueil"</strong></li>
                <li>Confirmez en appuyant sur <strong>Installer</strong></li>
              </ol>
            </div>
          </Section>

          <Section title="Avantages">
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <Download size={20} style={{ color: '#111827', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Accès rapide</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>
                    Lancez l'app directement depuis votre écran d'accueil
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <Smartphone size={20} style={{ color: '#111827', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Expérience optimale</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>
                    Interface plein écran sans les éléments du navigateur
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Home size={20} style={{ color: '#111827', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Toujours accessible</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>
                    Retrouvez facilement vos Chefs★ et vos repas
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
