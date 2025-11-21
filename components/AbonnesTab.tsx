import { useEffect, useState } from 'react';

export default function AbonnesTab() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadClients(); }, []);

  const loadClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/clients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setClients(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (clientId: string, currentStatus: boolean, type: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/clients/${clientId}/subscription`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          isActive: !currentStatus, type,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
      });
      loadClients();
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestion des Abonnés</h2>
      <div className="grid gap-4">
        {clients.map(client => (
          <div key={client._id} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{client.name}</h3>
                <p className="text-gray-600">{client.phone}</p>
                <p className="text-sm text-gray-500">{client.address}</p>
                {client.subscription?.isActive && (
                  <div className="mt-2">
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✅ Abonné {client.subscription.type}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Expire: {new Date(client.subscription.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {client.subscription?.isActive ? (
                  <button onClick={() => toggleSubscription(client._id, true, client.subscription.type)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    ❌ Désactiver
                  </button>
                ) : (
                  <>
                    <button onClick={() => toggleSubscription(client._id, false, 'COMPLET')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Activer COMPLET</button>
                    <button onClick={() => toggleSubscription(client._id, false, 'DEJEUNER')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Activer DÉJEUNER</button>
                    <button onClick={() => toggleSubscription(client._id, false, 'DINER')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Activer DÎNER</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
