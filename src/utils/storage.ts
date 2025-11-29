export interface Subscription {
  id: string;
  clientEmail: string;
  chefSlug: string;
  chefName: string;
  planId: string;
  planName: string;
  price: string;
  startDate: string;
  status: 'active' | 'pending';
}

const STORAGE_KEY = 'chef_etoile_subs';
const MENU_KEY_PREFIX = 'chef_etoile_menu_';
const CHEF_PHOTO_PREFIX = 'chef_photo_';
const CLIENT_PHOTO_PREFIX = 'profile_photo_';
const CHEF_RATING_PREFIX = 'chef_ratings_';

export interface ChefProfileData {
  slug: string;
  name: string;
  bio: string;
  rating: number;
  cuisineType: string;
  location: string;
  phone?: string;
}

export interface ChefRatingStats {
  average: number;
  count: number;
}

export interface DayMenu {
  day: string;
  midi: string;
  soir: string;
  isAbsent?: boolean;
}

const defaultMenu = (): DayMenu[] => ([
  { day: 'Lundi', midi: '', soir: '', isAbsent: false },
  { day: 'Mardi', midi: '', soir: '', isAbsent: false },
  { day: 'Mercredi', midi: '', soir: '', isAbsent: false },
  { day: 'Jeudi', midi: '', soir: '', isAbsent: false },
  { day: 'Vendredi', midi: '', soir: '', isAbsent: false },
  { day: 'Samedi', midi: '', soir: '', isAbsent: false },
  { day: 'Dimanche', midi: '', soir: '', isAbsent: true }
]);

export const StorageService = {
  getSubscriptions: (): Subscription[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  addSubscription: (sub: Omit<Subscription, 'id' | 'startDate' | 'status'>) => {
    const subs = StorageService.getSubscriptions();
    const newSub: Subscription = {
      ...sub,
      id: Date.now().toString(),
      startDate: new Date().toLocaleDateString('fr-FR'),
      status: 'active'
    };
    subs.push(newSub);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
    return newSub;
  },

  getMenu: (chefSlug: string): DayMenu[] => {
    const key = `${MENU_KEY_PREFIX}${chefSlug}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultMenu();
  },

  saveMenu: (chefSlug: string, menu: DayMenu[]) => {
    const key = `${MENU_KEY_PREFIX}${chefSlug}`;
    localStorage.setItem(key, JSON.stringify(menu));
  },

  getChefPhoto: (chefSlug: string): string | null => {
    const key = `${CHEF_PHOTO_PREFIX}${chefSlug}`;
    return localStorage.getItem(key);
  },

  saveChefPhoto: (chefSlug: string, dataUrl: string) => {
    const key = `${CHEF_PHOTO_PREFIX}${chefSlug}`;
    localStorage.setItem(key, dataUrl);
  },

  getClientPhoto: (email: string): string | null => {
    const key = `${CLIENT_PHOTO_PREFIX}${email}`;
    return localStorage.getItem(key);
  },

  saveClientPhoto: (email: string, dataUrl: string) => {
    const key = `${CLIENT_PHOTO_PREFIX}${email}`;
    localStorage.setItem(key, dataUrl);
  },

  addChefRating: (chefSlug: string, rating: number) => {
    const key = `${CHEF_RATING_PREFIX}${chefSlug}`;
    const list = StorageService.getChefRatings(chefSlug);
    list.push(rating);
    localStorage.setItem(key, JSON.stringify(list));
  },

  getChefRatings: (chefSlug: string): number[] => {
    const key = `${CHEF_RATING_PREFIX}${chefSlug}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  getChefRatingStats: (chefSlug: string): ChefRatingStats => {
    const ratings = StorageService.getChefRatings(chefSlug);
    const count = ratings.length;
    if (count === 0) {
      const fallback = defaultChefs.find((c) => c.slug === chefSlug)?.rating ?? 0;
      return { average: fallback, count: 0 };
    }
    const average = ratings.reduce((sum, r) => sum + r, 0) / count;
    return { average, count };
  },

  getAllChefs: (): ChefProfileData[] => [...defaultChefs],

  getChefBySlug: (slug: string): ChefProfileData | null => {
    const found = defaultChefs.find((c) => c.slug === slug);
    return found ?? null;
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const defaultChefs: ChefProfileData[] = [
  {
    slug: 'kodjo',
    name: 'Chef Kodjo',
    bio: 'Cuisine locale et fusion africaine.',
    rating: 4.8,
    cuisineType: 'Africain',
    location: 'Tokoin, Lomé',
    phone: '+228 90 12 34 56'
  },
  {
    slug: 'anna',
    name: 'Chef Anna',
    bio: 'Recettes italiennes maison.',
    rating: 4.9,
    cuisineType: 'Italien',
    location: 'Bè, Lomé',
    phone: '+228 90 23 45 67'
  },
  {
    slug: 'gloria',
    name: 'Chef Gloria',
    bio: 'Pâtisserie et desserts gourmands.',
    rating: 4.7,
    cuisineType: 'Pâtisserie',
    location: 'Hèdzranawoé, Lomé'
  },
  {
    slug: 'yao',
    name: 'Chef Yao',
    bio: 'Cuisine traditionnelle revisitée.',
    rating: 4.6,
    cuisineType: 'Fusion',
    location: 'Adidogomé, Lomé'
  },
  {
    slug: 'ama',
    name: 'Chef Ama',
    bio: 'Spécialités healthy et vegan.',
    rating: 4.5,
    cuisineType: 'Healthy',
    location: 'Nyékonakpoè, Lomé'
  }
];
