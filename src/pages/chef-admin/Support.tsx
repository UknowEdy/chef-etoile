import { useState } from 'react';
import { MessageCircle, AlertCircle, HelpCircle, Phone } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import ChefBottomNav from '../../components/ChefBottomNav';
import { PageTitle, Section } from '../../components';

export default function ChefSupport() {
  const [selectedIssue, setSelectedIssue] = useState('');

  const adminPhone = '+393458374056';

  const issuesChef = [
    { id: 'client-conflict', label: 'Conflit avec un client', urgent: true },
    { id: 'payment-not-received', label: 'Paiement non reçu', urgent: true },
    { id: 'delivery-problem', label: 'Problème de livraison', urgent: true },
    { id: 'platform-bug', label: 'Bug sur la plateforme', urgent: false },
    { id: 'account-issue', label: 'Problème de compte', urgent: false },
    { id: 'other', label: 'Autre problème', urgent: false }
  ];

  const handleContactAdmin = () => {
    if (!selectedIssue) {
      alert('Veuillez sélectionner un problème');
      return;
    }

    const issue = issuesChef.find(i => i.id === selectedIssue);
    const message = `🍳 SUPPORT CHEF

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
            subtitle="Besoin d'aide ? Contactez la plateforme"
          />

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
              Conflit client, paiement non reçu, ou autre urgence ? Appelez-nous directement.
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

          <Section title="Quel est votre problème ?">
            <div style={{ marginBottom: '16px' }}>
              {issuesChef.map((issue) => (
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

          <Section title="Questions fréquentes pour les chefs">
            <div className="card">
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                  <HelpCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Comment gérer un client difficile ?
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  Restez professionnel et contactez le support pour médiation si nécessaire.
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                  <HelpCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Paiement non reçu ?
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  Contactez immédiatement le support avec preuve de service.
                </div>
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                  <HelpCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Modifier mes tarifs ?
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  Allez dans Paramètres → Tarifs et formules
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
      <ChefBottomNav />
    </AppShell>
  );
}
