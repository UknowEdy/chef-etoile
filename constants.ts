import { PlanType, SubscriptionPlan, Order, MealTime } from './types';

export const PLANS: SubscriptionPlan[] = [
  {
    id: PlanType.COMPLETE,
    title: "Formule Complète",
    price: 14000,
    description: "L'expérience totale. Déjeuner et Dîner livrés chaque jour.",
    mealCount: 10, // 5 days * 2
    features: ["Déjeuner + Dîner", "10 repas/semaine", "Livraison incluse", "Menu varié"],
    isRecommended: true
  },
  {
    id: PlanType.PARTIEL,
    title: "Formule Partielle",
    price: 7500,
    description: "Flexibilité totale. Choisissez votre moment.",
    mealCount: 5, // 5 days * 1
    features: ["Déjeuner OU Dîner", "5 repas/semaine", "Livraison incluse", "Menu varié"],
    isRecommended: false
  }
];

// Mock data for Admin
export const MOCK_ORDERS: Order[] = [
  {
    id: "CMD-001",
    customerName: "Koffi Mensah",
    phone: "+228 91 20 90 85",
    address: "Lomé, Quartier Adidogomé, près de la pharmacie",
    plan: PlanType.COMPLETE,
    mealPreference: MealTime.BOTH,
    totalPrice: 14000,
    allergies: false,
    date: "2023-10-25",
    status: 'CONFIRMED'
  },
  {
    id: "CMD-002",
    customerName: "Akoua Bossou",
    phone: "+228 91 20 90 85",
    address: "Lomé, Tokoin Trésor",
    plan: PlanType.PARTIEL,
    mealPreference: MealTime.LUNCH,
    totalPrice: 7500,
    allergies: true,
    date: "2023-10-26",
    status: 'PENDING'
  },
  {
    id: "CMD-003",
    customerName: "Jean-Paul Agbo",
    phone: "+228 91 20 90 85",
    address: "Lomé, Hedzranawoé",
    plan: PlanType.PARTIEL,
    mealPreference: MealTime.DINNER,
    totalPrice: 7500,
    allergies: false,
    date: "2023-10-26",
    status: 'DELIVERED'
  }
];