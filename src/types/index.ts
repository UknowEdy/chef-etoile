export interface Chef {
  slug: string;
  name: string;
}

export interface Subscription {
  chef: Chef;
  plan: string;
  expiryDate: string;
}

export interface Meal {
  id: string;
  time: 'Midi' | 'Soir';
  dish: string;
  chefName: string;
}

export interface UserProfile {
  name: string;
  isSubscribed: boolean;
}
