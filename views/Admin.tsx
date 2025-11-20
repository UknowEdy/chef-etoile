import React from 'react';
import { ArrowLeft, Filter, TrendingUp, Users, Calendar } from 'lucide-react';
import { MOCK_ORDERS } from '../constants';
import { PlanType, MealTime } from '../types';

interface AdminProps {
    onBack: () => void;
}

export const Admin: React.FC<AdminProps> = ({ onBack }) => {
  // Simple stats calculation
  const totalOrders = MOCK_ORDERS.length;
  const activeOrders = MOCK_ORDERS.filter(o => o.status !== 'DELIVERED').length;
  const revenue = MOCK_ORDERS.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'CONFIRMED': return 'bg-green-100 text-green-700';
          case 'PENDING': return 'bg-yellow-100 text-yellow-700';
          case 'DELIVERED': return 'bg-gray-100 text-gray-600';
          default: return 'bg-gray-100';
      }
  };

  const getPlanBadge = (plan: PlanType, pref: MealTime) => {
      if (plan === PlanType.COMPLETE) return <span className="px-2 py-1 text-xs font-bold bg-chef-black text-chef-gold rounded-md">COMPLET</span>;
      const label = pref === MealTime.LUNCH ? 'MIDI' : 'SOIR';
      return <span className="px-2 py-1 text-xs font-bold bg-white border border-stone-300 text-stone-600 rounded-md">{label}</span>;
  };

  return (
    <div className="min-h-screen bg-stone-100">
        {/* Admin Header */}
        <div className="bg-chef-black text-white p-4 shadow-md">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="font-serif text-xl font-bold">Chef★ Admin</h1>
                </div>
                <div className="text-xs text-stone-400">Vue Traiteur</div>
            </div>
        </div>

        <div className="max-w-6xl mx-auto p-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-center justify-between">
                    <div>
                        <p className="text-stone-500 text-xs uppercase font-bold">Commandes Actives</p>
                        <p className="text-2xl font-bold text-chef-black">{activeOrders}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Calendar className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-center justify-between">
                    <div>
                        <p className="text-stone-500 text-xs uppercase font-bold">Clients Total</p>
                        <p className="text-2xl font-bold text-chef-black">{totalOrders}</p>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-center justify-between">
                    <div>
                        <p className="text-stone-500 text-xs uppercase font-bold">Revenu (Semaine)</p>
                        <p className="text-2xl font-bold text-chef-green">{revenue.toLocaleString()} F</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="p-4 border-b border-stone-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg">Liste des Abonnements</h2>
                    <button className="flex items-center gap-2 text-sm text-stone-500 hover:text-chef-black">
                        <Filter className="w-4 h-4" /> Filtrer
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-stone-50 text-stone-500">
                            <tr>
                                <th className="p-4 font-medium">Client</th>
                                <th className="p-4 font-medium">Formule</th>
                                <th className="p-4 font-medium">Adresse</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {MOCK_ORDERS.map((order) => (
                                <tr key={order.id} className="hover:bg-stone-50/50">
                                    <td className="p-4">
                                        <div className="font-bold text-chef-black">{order.customerName}</div>
                                        <div className="text-xs text-stone-400">{order.phone}</div>
                                        {order.allergies && <span className="text-xs text-red-500 font-bold mt-1 block">⚠️ Allergies</span>}
                                    </td>
                                    <td className="p-4">
                                        {getPlanBadge(order.plan, order.mealPreference)}
                                    </td>
                                    <td className="p-4 max-w-xs truncate text-stone-600">
                                        {order.address}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-chef-gold hover:text-chef-black font-medium text-xs border border-chef-gold/30 hover:border-chef-black px-3 py-1 rounded transition-colors">
                                            Détails
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};