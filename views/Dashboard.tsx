import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, MapPin, Clock, CheckCircle2, Loader } from 'lucide-react';
import { ReadyButton } from '../components/ReadyButton';
import { getOrderById } from '../utils/api';
import { Order, OrderStatus } from '../types';

interface DashboardProps {
  orderId: string;
  onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ orderId, onBack }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger la commande
  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getOrderById(orderId);

      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        throw new Error(response.error || 'Commande introuvable');
      }
    } catch (err: any) {
      console.error('Erreur chargement commande:', err);
      setError(err.message || 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction helper pour le statut
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          label: 'En attente de paiement',
          color: 'bg-yellow-100 text-yellow-700',
          icon: Clock
        };
      case OrderStatus.CONFIRMED:
        return {
          label: 'En préparation',
          color: 'bg-blue-100 text-blue-700',
          icon: Package
        };
      case OrderStatus.READY:
        return {
          label: 'Prêt - En attente de livraison',
          color: 'bg-green-100 text-green-700',
          icon: CheckCircle2
        };
      case OrderStatus.OUT_FOR_DELIVERY:
        return {
          label: 'En cours de livraison',
          color: 'bg-purple-100 text-purple-700',
          icon: MapPin
        };
      case OrderStatus.DELIVERED:
        return {
          label: 'Livré',
          color: 'bg-green-100 text-green-700',
          icon: CheckCircle2
        };
      default:
        return {
          label: status,
          color: 'bg-stone-100 text-stone-700',
          icon: Package
        };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-chef-orange animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-chef-black mb-2">
            Commande introuvable
          </h2>
          <p className="text-stone-600 mb-6">{error || 'Cette commande n\'existe pas'}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-chef-black text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 p-4 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-chef-black" />
          </button>
          <div className="flex-1">
            <h2 className="font-serif text-lg font-bold">Ma Commande</h2>
            <p className="text-xs text-stone-500">
              {order.orderId || order._id || order.id}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 pt-6 space-y-6">
        {/* Statut actuel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-chef-black">Statut de la commande</h3>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
            >
              <StatusIcon className="w-4 h-4" />
              {statusInfo.label}
            </span>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <TimelineStep
              label="Commande passée"
              completed={true}
              active={order.status === OrderStatus.PENDING}
            />
            <TimelineStep
              label="Paiement confirmé"
              completed={
                order.status !== OrderStatus.PENDING
              }
              active={order.status === OrderStatus.CONFIRMED}
            />
            <TimelineStep
              label="Prêt pour livraison"
              completed={
                order.status === OrderStatus.READY ||
                order.status === OrderStatus.OUT_FOR_DELIVERY ||
                order.status === OrderStatus.DELIVERED
              }
              active={order.status === OrderStatus.READY}
            />
            <TimelineStep
              label="En cours de livraison"
              completed={
                order.status === OrderStatus.OUT_FOR_DELIVERY ||
                order.status === OrderStatus.DELIVERED
              }
              active={order.status === OrderStatus.OUT_FOR_DELIVERY}
            />
            <TimelineStep
              label="Livré"
              completed={order.status === OrderStatus.DELIVERED}
              active={order.status === OrderStatus.DELIVERED}
            />
          </div>
        </div>

        {/* Bouton "Je suis prêt" */}
        <ReadyButton
          orderId={order._id || order.id || ''}
          currentStatus={order.status}
          onSuccess={loadOrder}
        />

        {/* Détails de la commande */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <h3 className="font-bold text-chef-black mb-4">Détails de la commande</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Formule</span>
              <span className="font-medium text-chef-black">
                {order.plan === 'COMPLETE' ? 'Complète' : 'Simple'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-600">Repas</span>
              <span className="font-medium text-chef-black">
                {order.mealPreference === 'BOTH'
                  ? 'Déjeuner + Dîner'
                  : order.mealPreference === 'LUNCH'
                  ? 'Déjeuner'
                  : 'Dîner'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-600">Prix</span>
              <span className="font-bold text-chef-orange">
                {order.totalPrice?.toLocaleString('fr-FR')} F
              </span>
            </div>

            <div className="h-px bg-stone-100 my-3" />

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-stone-600 text-xs">Adresse de livraison</span>
                <p className="font-medium text-chef-black">{order.address}</p>
              </div>
            </div>

            {order.allergies && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs text-orange-800">
                  ⚠️ <strong>Allergies:</strong> {order.allergies}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Support */}
        <div className="bg-chef-black text-white rounded-2xl p-6 text-center">
          <h4 className="font-bold mb-2">Besoin d'aide ?</h4>
          <p className="text-stone-300 text-sm mb-4">
            Contactez notre support pour toute question
          </p>
          <a
            href="https://wa.me/22890000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-chef-gold text-chef-black rounded-lg font-medium hover:bg-amber-400 transition-colors"
          >
            Contacter via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

// Composant Timeline Step
interface TimelineStepProps {
  label: string;
  completed: boolean;
  active: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ label, completed, active }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
          completed
            ? 'bg-green-500'
            : active
            ? 'bg-blue-500'
            : 'bg-stone-200'
        }`}
      >
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-white" />
        ) : (
          <div className={`w-3 h-3 rounded-full ${active ? 'bg-white' : 'bg-stone-400'}`} />
        )}
      </div>
      <span
        className={`text-sm ${
          completed || active ? 'text-chef-black font-medium' : 'text-stone-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
};
