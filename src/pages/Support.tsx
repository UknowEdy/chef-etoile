import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, AlertCircle, HelpCircle, Phone } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle, Section } from '../components';

export default function Support() {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState('');

  // Numéro WhatsApp de l'admin plateforme
  const adminPhone = '+393458374056'; // À remplacer par le vrai numéro

  const issuesClient = [
    { id: 'chef-no-response', label: 'Le chef ne répond pas', urgent: true },
    { id: 'wrong-meal', label: 'Repas non conforme à la commande', urgent: true },
    { id: 'no-delivery', label: 'Livraison non effectuée', urgent: true },
    { id: 'payment-issue', label: 'Problème de paiement', urgent: false },
    { id: 'quality', label: 'Problème de qualité du repas', urgent: false },
    { id: 'other', label: 'Autre problème', urgent: false }
  ];

  const handleContactAdmin = () => {
    if (!selectedIssue) {
      alert('Veuillez sélectionner un problème');
      return;
    }

    const issue = issuesClient.find(i => i.id === selectedIssue);
    const message = `🚨 SUPPORT CLIENT

Type de problème : ${issue?.label}
${issue?.urgent ? '⚠️ URGENT' : ''}

[Décrivez votre problème ici]

Merci de me répondre rapidement.`;

    const phoneClean = adminPhone.replace(/\s/g, '');
    window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCallAdmin = () => {
    window.open(`tel:${adminPhone}`, '_self');
  };

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Support Chef★" 
            subtitle="Besoin d'aide ? Contactez notre équipe"
          />

          {/* Urgence */}
          <div className="card" style={{ 
            background: '#FEE2E2', 
            border: '2px solid #DC2626',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <AlertCircle size={24} color="#DC2626" />
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#DC2626' }}>
                Urgence
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#7F1D1D', marginBottom: '12px' }}>
              Pour un problème urgent (livraison, qualité, chef injoignable), contactez-nous immédiatement.
            </div>
            <button 
              className="btn btn-whatsapp"
              onClick={handleCallAdmin}
              style={{ background: '#DC2626', marginBottom: '8px' }}
            >
              <Phone size={20} />
              Appeler le support (urgent)
            </button>
          </div>

          {/* Sélection du problème */}
          <Section title="Quel est votre problème ?">
            <div style={{ marginBottom: '16px' }}>
              {issuesClient.map((issue) => (
                <div 
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue.id)}
                  style={{
                    padding: '14px',
                    border: selectedIssue === issue.id ? '2px solid #D4AF37' : '1px solid #E5E7EB',
                    borderRadius: '12px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    background: selectedIssue === issue.id ? '#F4E4B0' : 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: selectedIssue === issue.id ? '600' : '400' }}>
                    {issue.label}
                  </div>
                  {issue.urgent && (
                    <span className="badge badge-error" style={{ fontSize: '11px' }}>
                      URGENT
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button 
              className="btn btn-whatsapp"
              disabled={!selectedIssue}
              onClick={handleContactAdmin}
              style={{ opacity: selectedIssue ? 1 : 0.5 }}
            >
              <MessageCircle size={20} />
              Contacter le support via WhatsApp
            </button>
          </Section>

          {/* FAQ */}
          <Section title="Questions fréquentes">
            <div className="card">
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                  <HelpCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Comment modifier mon point de retrait ?
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  Allez dans "Abonnements" → "Mon point de retrait" → Modifier les coordonnées GPS.
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                  <HelpCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Comment annuler mon abonnement ?
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  Contactez votre chef directement ou le support si le chef ne répond pas.
                </div>
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                  <HelpCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Délai de livraison ?
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  Midi : 11h30-13h00 | Soir : 18h30-20h00
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
