export enum PlanType {
  PARTIEL = 'PARTIEL',
  COMPLETE = 'COMPLETE'
}

export enum MealTime {
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  BOTH = 'BOTH'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum DeliveryStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  DELIVERED = 'delivered',
  FAILED = 'failed'
}

export type DayOfWeek = 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI';

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

// Plat
export interface Dish {
  _id: string;
  name: string;
  image: string;
  description: string;
  ingredients: string[];
  category: 'plat_principal' | 'accompagnement' | 'dessert' | 'boisson';
  isVegetarian: boolean;
  containsFish: boolean;
  containsMeat: boolean;
  allergens: string[];
  likesCount: number;
  isLikedByUser?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Menu du jour
export interface DayMenu {
  day: DayOfWeek;
  dejeuner: {
    dish?: string;
    name: string;
    image?: string;
    description?: string;
  };
  diner: {
    dish?: string;
    name: string;
    image?: string;
    description?: string;
  };
}

// Menu hebdomadaire
export interface WeeklyMenu {
  _id: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isArchived: boolean;
  meals: DayMenu[];
  totalLikes: number;
  createdAt?: string;
  updatedAt?: string;
}

// Préférences alimentaires
export interface DietaryPreferences {
  isVegetarian: boolean;
  noFish: boolean;
  noMeat: boolean;
  noPork: boolean;
  noSpicy: boolean;
  otherRestrictions?: string;
}

// Abonnement
export interface Subscription {
  isActive: boolean;
  plan: PlanType;
  mealPreference: MealTime;
  startDate?: string;
  endDate?: string;
  paymentProof?: string;
  paymentVerified: boolean;
}

// Utilisateur
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
  // Préférences alimentaires
  allergies?: string;
  dietaryPreferences?: DietaryPreferences;
  // Parrainage
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  freeMealsEarned: number;
  // Abonnement
  subscription?: Subscription;
  // QR Code et confirmation
  qrCode?: string;
  confirmationNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Livraison
export interface Delivery {
  _id: string;
  userId: string;
  livreurId?: string;
  menuId: string;
  date: string;
  mealType: MealTime;
  status: DeliveryStatus;
  confirmationNumber: string;
  qrCode: string;
  deliveredAt?: string;
  deliveryPhoto?: string;
  scannedAt?: string;
  scannedBy?: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  clientLocation?: GPSCoordinates;
  deliveryOrder?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Vote
export interface Vote {
  _id: string;
  userId: string;
  dishId: string;
  menuId?: string;
  createdAt?: string;
}

// Order (legacy)
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

export type ViewState = 'HOME' | 'CHECKOUT' | 'SUCCESS' | 'ADMIN' | 'DASHBOARD' | 'LOGIN' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD' | 'CLIENT_DASHBOARD' | 'MENU' | 'LIVREUR_DASHBOARD';

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

// Stats Admin
export interface AdminStats {
  activeSubscribers: number;
  weeklyRevenue: number;
  totalDeliveries: number;
  topDishes: Dish[];
  pendingPayments: number;
}

// Gestion stock
export interface StockCalculation {
  clientCount: number;
  gramsPerPerson: number;
  totalGrams: number;
  totalKg: number;
}
