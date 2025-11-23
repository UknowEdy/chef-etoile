export enum PlanType {
  SIMPLE = 'SIMPLE',
  COMPLETE = 'COMPLETE'
}

export enum MealTime {
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  BOTH = 'BOTH'
}

export enum OrderStatus {
  PENDING = 'PENDING',           // En attente de paiement
  CONFIRMED = 'CONFIRMED',       // Payée, en préparation
  READY = 'READY',               // Client a cliqué "Je suis prêt"
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', // En livraison
  DELIVERED = 'DELIVERED',       // Livrée
  CANCELLED = 'CANCELLED'        // Annulée
}

export interface GPSCoordinates {
  lat: number;
  lng: number;
  timestamp?: Date | string;
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
  _id?: string;
  id?: string;
  orderId?: string;
  userId?: string;
  customerName: string;
  phone: string;
  address: string;
  plan: PlanType;
  mealPreference: MealTime;
  totalPrice: number;
  allergies?: boolean | string;
  date?: string;
  status: OrderStatus;
  gps?: GPSCoordinates;
  deliveryOrder?: number;
  distance?: number;
  distanceFormatted?: string;
  estimatedTime?: number;
  mapsLink?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type ViewState = 'HOME' | 'CHECKOUT' | 'SUCCESS' | 'ADMIN' | 'DASHBOARD' | 'LOGIN' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD' | 'CLIENT_DASHBOARD';

export interface User {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: 'client' | 'admin' | 'livreur';
  address: string;
  location?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
  readyToReceive: boolean;
  readyAt?: string;
}

export interface DeliveryRoute {
  success: boolean;
  message: string;
  data: Order[];
  stats?: {
    totalOrders: number;
    totalDistance: string;
    estimatedTotalTime: number;
  };
}

export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
