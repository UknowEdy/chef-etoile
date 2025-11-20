export enum PlanType {
  SIMPLE = 'SIMPLE',
  COMPLETE = 'COMPLETE'
}

export enum MealTime {
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  BOTH = 'BOTH'
}

export interface SubscriptionPlan {
  id: PlanType;
  title: string;
  price: number;
  description: string;
  mealCount: number;
  features: string[];
  isRecommended?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  plan: PlanType;
  mealPreference: MealTime;
  totalPrice: number;
  allergies: boolean;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERED';
}

export type ViewState = 'HOME' | 'CHECKOUT' | 'SUCCESS' | 'ADMIN';