import { Subscription, Meal } from '../types';

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { 
    chef: { name: 'Chef Kodjo', slug: 'kodjo' }, 
    plan: 'Formule Complète', 
    expiryDate: '05 Dec 2024' 
  },
  { 
    chef: { name: 'Chef Anna', slug: 'anna' }, 
    plan: 'Formule Midi', 
    expiryDate: '08 Dec 2024' 
  }
];

export const MOCK_TODAY_MEALS: Meal[] = [
  { id: '1', time: 'Midi', dish: 'Riz sauce arachide', chefName: 'Chef Kodjo' },
  { id: '2', time: 'Soir', dish: 'Pâtes carbonara', chefName: 'Chef Kodjo' }
];
