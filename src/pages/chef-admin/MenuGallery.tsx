import { useState } from 'react';
import { Upload, Trash2, Edit2, Save, X } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle } from '../../components';

interface Plat {
  id: string;
  nom: string;
  photo: string;
}

export default function ChefAdminMenuGallery() {
  const [plats, setPlats] = useState<Plat[]>([
    { id: '1', nom: 'Riz sauce arachide', photo: '/placeholder.jpg' },
    { id: '2', nom: 'Attiéké poisson', photo: '/placeholder.jpg' }
  ]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleUpload = () => {
    if (plats.length >= 50) {
      alert('Maximum 50 photos atteint');
      return;
    }
    // TODO: Ouvrir sélecteur de fichier
    const newPlat: Plat = {
      id: Date.now().toString(),
      nom: 'Nouveau plat',
      photo: '/placeholder.jpg'
    };
    setPlats([...plats, newPlat]);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce plat de la galerie ?')) {
      setPlats(plats.filter(p => p.id !== id));
    }
  };

  const startEdit = (plat: Plat) => {
    setEditingId(plat.id);
    setEditingName(plat.nom);
  };

  const saveEdit = (id: string) => {
    setPlats(plats.map(p => p.id === id ? { ...p, nom: editingName } : p));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Mes Plats" 
            subtitle={`${plats.length}/50 photos`}
          />

          <button 
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={plats.length >= 50}
            style={{ marginBottom: '24px' }}
          >
            <Upload size={20} />
            Ajouter une photo
          </button>

          {plats.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 16px',
              color: '#6B7280'
            }}>
              <Upload size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                Aucune photo
              </div>
              <div style={{ fontSize: '14px' }}>
                Ajoutez des photos de vos plats pour attirer les clients
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {plats.map((plat) => (
                <div 
                  key={plat.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: '100%',
                    height: '120px',
                    background: '#E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#6B7280'
                  }}>
                    📷 Photo
                  </div>

                  {/* Nom */}
                  <div style={{ padding: '12px' }}>
                    {editingId === plat.id ? (
                      <div>
                        <input
                          type="text"
                          className="input"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          style={{ marginBottom: '8px', fontSize: '13px', padding: '8px' }}
                          autoFocus
                        />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => saveEdit(plat.id)}
                            style={{
                              flex: 1,
                              padding: '6px',
                              background: '#D4AF37',
                              color: '#111827',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <Save size={14} />
                            OK
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={{
                              flex: 1,
                              padding: '6px',
                              background: '#E5E7EB',
                              color: '#111827',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '8px',
                          color: '#111827'
                        }}>
                          {plat.nom}
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => startEdit(plat)}
                            style={{
                              flex: 1,
                              padding: '6px',
                              background: '#E5E7EB',
                              color: '#111827',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit2 size={12} />
                            Renommer
                          </button>
                          <button
                            onClick={() => handleDelete(plat.id)}
                            style={{
                              padding: '6px',
                              background: '#FEE2E2',
                              color: '#991B1B',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {plats.length > 0 && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#D1FAE5',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#065F46'
            }}>
              💡 Ces photos seront visibles sur votre page publique Chef★
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
