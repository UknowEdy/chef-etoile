import { useState, useEffect } from 'react';
import { Search, Filter, Phone, MessageCircle } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import ChefBottomNav from '../../components/ChefBottomNav';
import { PageTitle, EmptyState } from '../../components';
import { StorageService, Subscription } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';

export default function ChefAdminSubscribers() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientPhotos, setClientPhotos] = useState<Record<string, string>>({});

  const currentChefSlug = user?.chefSlug || 'kodjo';

  useEffect(() => {
    const seedDemo = () => {
      const existing = StorageService.getSubscriptions().filter((sub) => sub.chefSlug === currentChefSlug);
      if (existing.length > 0) return existing;

      const demoClients = [
        { email: 'client1@test.com', planId: 'midi', planName: 'Formule Midi', price: '7 500 F' },
        { email: 'client2@test.com', planId: 'soir', planName: 'Formule Soir', price: '7 500 F' }
      ];

      demoClients.forEach((c) =>
        StorageService.addSubscription({
          clientEmail: c.email,
          chefSlug: currentChefSlug,
          chefName: 'Chef Kodjo',
          planId: c.planId,
          planName: c.planName,
          price: c.price
        })
      );
      return StorageService.getSubscriptions().filter((sub) => sub.chefSlug === currentChefSlug);
    };

    const mySubs = seedDemo();
    setSubscribers(mySubs);

    const photoMap: Record<string, string> = {};
    mySubs.forEach((sub) => {
      const stored = StorageService.getClientPhoto(sub.clientEmail);
      if (stored) photoMap[sub.clientEmail] = stored;
    });
    setClientPhotos(photoMap);
  }, [currentChefSlug]);

  const filteredSubs = subscribers.filter((sub) => {
    const term = searchTerm.toLowerCase();
    const matchesText = sub.planName.toLowerCase().includes(term) || sub.clientEmail.toLowerCase().includes(term);
    return (sub.status === 'active' || sub.status === 'pending') && matchesText;
  });

  const formatDate = (iso?: string, fallbackISO?: string) => {
    if (iso) return new Date(iso).toLocaleDateString('fr-FR');
    if (fallbackISO) {
      const base = new Date(fallbackISO);
      const plus7 = new Date(base.getTime() + 7 * 24 * 60 * 60 * 1000);
      return plus7.toLocaleDateString('fr-FR');
    }
    return '—';
  };

  return (
    <AppShell>
      <TopBar title="Mes Abonnés" showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Liste des abonnés" 
            subtitle={`${subscribers.length} abonnements actifs`}
          />

          {/* Barre de recherche */}
          <div className="card" style={{ padding: '8px', display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <Search size={20} color="#9CA3AF" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Filter size={20} color="#9CA3AF" />
          </div>

          {filteredSubs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredSubs.map((sub) => (
                <div key={sub.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: clientPhotos[sub.clientEmail]
                            ? `url(${clientPhotos[sub.clientEmail]}) center/cover`
                            : '#F3F4F6',
                          border: '1px solid #E5E7EB'
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: '600' }}>{sub.clientEmail}</div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>#{sub.id.slice(-4)}</div>
                      </div>
                    </div>
                    <span className={`badge ${sub.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                      {sub.status}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>
                    <div>Formule : <span style={{ color: '#111827', fontWeight: '500' }}>{sub.planName}</span></div>
                    <div>Depuis le : {sub.startDate}</div>
                    <div>Expire le : {formatDate(sub.expiryDateISO, sub.startDateISO)}</div>
                    <div>Montant : {sub.price}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #E5E7EB', paddingTop: '12px', flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary" style={{ flex: 1, minWidth: '140px', padding: '8px' }}>
                      <Phone size={16} /> Appeler
                    </button>
                    <button className="btn btn-whatsapp" style={{ flex: 1, minWidth: '140px', padding: '8px' }}>
                      <MessageCircle size={16} /> WhatsApp
                    </button>
                    {sub.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-primary"
                          style={{ flex: 1, minWidth: '140px', padding: '8px' }}
                          onClick={() => {
                            StorageService.validateSubscription(sub.id);
                            setSubscribers(StorageService.getSubscriptions().filter((s) => s.chefSlug === currentChefSlug));
                          }}
                        >
                          Valider l'abonnement
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ flex: 1, minWidth: '140px', padding: '8px', background: '#FEE2E2', color: '#B91C1C', borderColor: '#FEE2E2' }}
                          onClick={() => {
                            StorageService.rejectSubscription(sub.id);
                            setSubscribers(StorageService.getSubscriptions().filter((s) => s.chefSlug === currentChefSlug));
                          }}
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={<Filter size={48} />}
              title="Aucun abonné"
              description="Partagez votre profil pour attirer des clients !"
            />
          )}
        </div>
      </div>
      <ChefBottomNav />
    </AppShell>
  );
}
