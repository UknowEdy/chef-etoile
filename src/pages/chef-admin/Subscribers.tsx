import { useState } from 'react';
import { Phone, Edit2, Calendar, DollarSign } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle } from '../../components';

interface Subscriber {
  id: string;
  name: string;
  formula: string;
  phone: string;
  status: 'active' | 'expiring' | 'expired';
  startDate: string;
  endDate: string;
  subscriptionType: 'weekly' | 'monthly' | 'custom';
  price: string;
}

export default function ChefAdminSubscribers() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    formula: '',
    subscriptionType: '',
    customDays: '7',
    price: ''
  });

  const subscribers: Subscriber[] = [
    { 
      id: '1', 
      name: 'Jean Dupont', 
      formula: 'Complète', 
      phone: '+228 90 12 34 56', 
      status: 'active',
      startDate: '2024-11-25',
      endDate: '2024-12-01',
      subscriptionType: 'weekly',
      price: '14000'
    },
    { 
      id: '2', 
      name: 'Marie Kouassi', 
      formula: 'Midi', 
      phone: '+228 90 23 45 67', 
      status: 'expiring',
      startDate: '2024-11-20',
      endDate: '2024-11-28',
      subscriptionType: 'weekly',
      price: '7500'
    },
    { 
      id: '3', 
      name: 'Pierre Agbodjan', 
      formula: 'Soir', 
      phone: '+228 90 34 56 78', 
      status: 'active',
      startDate: '2024-11-26',
      endDate: '2024-12-03',
      subscriptionType: 'weekly',
      price: '7500'
    }
  ];

  const getStatusBadge = (status: string, endDate: string) => {
    const daysLeft = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: 'Expiré', class: 'badge-error' };
    if (daysLeft <= 2) return { text: `${daysLeft}j restants`, class: 'badge-warning' };
    return { text: 'Actif', class: 'badge-success' };
  };

  const startEdit = (sub: Subscriber) => {
    setEditingId(sub.id);
    setEditData({
      formula: sub.formula,
      subscriptionType: sub.subscriptionType,
      customDays: '7',
      price: sub.price
    });
  };

  const saveEdit = () => {
    alert('Abonnement modifié !');
    setEditingId(null);
  };

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Mes abonnés" 
            subtitle={`${subscribers.length} abonnés actifs`}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {subscribers.map((sub) => {
              const badge = getStatusBadge(sub.status, sub.endDate);
              const isEditing = editingId === sub.id;

              return (
                <div key={sub.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                      {sub.name}
                    </div>
                    <span className={`badge ${badge.class}`}>
                      {badge.text}
                    </span>
                  </div>

                  {isEditing ? (
                    <>
                      <label className="label">Formule</label>
                      <select 
                        className="input"
                        value={editData.formula}
                        onChange={(e) => setEditData({ ...editData, formula: e.target.value })}
                      >
                        <option value="Midi">Midi</option>
                        <option value="Soir">Soir</option>
                        <option value="Complète">Complète</option>
                      </select>

                      <label className="label">Type d'abonnement</label>
                      <select 
                        className="input"
                        value={editData.subscriptionType}
                        onChange={(e) => setEditData({ ...editData, subscriptionType: e.target.value })}
                      >
                        <option value="weekly">Hebdomadaire (7 jours)</option>
                        <option value="monthly">Mensuel (30 jours)</option>
                        <option value="custom">Personnalisé</option>
                      </select>

                      {editData.subscriptionType === 'custom' && (
                        <>
                          <label className="label">Nombre de jours</label>
                          <input 
                            type="number"
                            className="input"
                            value={editData.customDays}
                            onChange={(e) => setEditData({ ...editData, customDays: e.target.value })}
                            min="1"
                            max="90"
                          />
                        </>
                      )}

                      <label className="label">Prix (F CFA)</label>
                      <input 
                        type="number"
                        className="input"
                        value={editData.price}
                        onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                      />

                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button className="btn btn-primary" onClick={saveEdit}>
                          Sauvegarder
                        </button>
                        <button className="btn btn-secondary" onClick={() => setEditingId(null)}>
                          Annuler
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                        <strong>Formule {sub.formula}</strong> · {sub.subscriptionType === 'weekly' ? 'Hebdomadaire' : sub.subscriptionType === 'monthly' ? 'Mensuel' : 'Personnalisé'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                        <Phone size={14} />
                        {sub.phone}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                        <Calendar size={14} />
                        Expire le {new Date(sub.endDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                        <DollarSign size={14} />
                        {sub.price} F CFA
                      </div>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => startEdit(sub)}
                        style={{ width: '100%' }}
                      >
                        <Edit2 size={16} />
                        Modifier l'abonnement
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
