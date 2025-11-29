export interface Subscription {
  id: string;
  clientEmail: string;
  chefSlug: string;
  chefName: string;
  clientPhone?: string;
  planId: string;
  planName: string;
  price: string;
  days: string[];
  startDate: string;
  startDateISO?: string;
  expiryDateISO?: string;
  status: 'active' | 'pending' | 'expired' | 'rejected';
}

const STORAGE_KEY = 'chef_etoile_subs';
const MENU_KEY_PREFIX = 'chef_etoile_menu_';
const CHEF_PHOTO_PREFIX = 'chef_photo_';
const CLIENT_PHOTO_PREFIX = 'profile_photo_';
const CHEF_RATING_PREFIX = 'chef_ratings_';
const CHEF_PLANS_PREFIX = 'chef_plans_';
const CHEF_SETTINGS_PREFIX = 'chef_settings_';
const CHEF_PROFILE_PREFIX = 'chef_profile_';

export interface ChefProfileData {
  slug: string;
  name: string;
  bio: string;
  rating: number;
  cuisineType: string;
  location: string;
  phone?: string;
  isSuspended: boolean;
}

export interface ChefRatingStats {
  average: number;
  count: number;
}

export interface ChefPlan {
  id: 'midi' | 'soir' | 'complet';
  name: string;
  price: string;
  active: boolean;
  days: string[]; // ex: ['lundi', 'mardi']
}

export interface DayMenu {
  day: string;
  midi: string;
  soir: string;
  isAbsent?: boolean;
}

export interface ChefSettings {
  prixMidi: string;
  prixSoir: string;
  prixComplet: string;
  isMidiActive: boolean;
  isSoirActive: boolean;
  joursService: Record<string, boolean>;
  rayonLivraison: string;
  telephone: string;
  adresse: string;
  horairesLivraison: string;
}

const defaultMenu = (): DayMenu[] => ([
  { day: 'Lundi', midi: '', soir: '', isAbsent: false },
  { day: 'Mardi', midi: '', soir: '', isAbsent: false },
  { day: 'Mercredi', midi: '', soir: '', isAbsent: false },
  { day: 'Jeudi', midi: '', soir: '', isAbsent: false },
  { day: 'Vendredi', midi: '', soir: '', isAbsent: false },
  { day: 'Samedi', midi: '', soir: '', isAbsent: false },
  { day: 'Dimanche', midi: '', soir: '', isAbsent: false }
]);

export const StorageService = {
  getSubscriptions: (): Subscription[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed: Subscription[] = data ? JSON.parse(data) : [];

    const now = Date.now();
    let mutated = false;
    const updated = parsed.map((sub) => {
      const expiry = sub.expiryDateISO
        ? Date.parse(sub.expiryDateISO)
        : sub.startDateISO
          ? Date.parse(sub.startDateISO) + 7 * 24 * 60 * 60 * 1000
          : null;

      if (expiry && now > expiry && sub.status !== 'expired') {
        mutated = true;
        return { ...sub, status: 'expired' as const };
      }
      return sub;
    });

    if (mutated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    return updated;
  },

  addSubscription: (sub: Omit<Subscription, 'id' | 'startDate' | 'status'>) => {
    const subs = StorageService.getSubscriptions();
    const start = new Date();
    const expiry = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 jours par défaut
    const newSub: Subscription = {
      ...sub,
      id: Date.now().toString(),
      startDate: start.toLocaleDateString('fr-FR'),
      startDateISO: start.toISOString(),
      expiryDateISO: expiry.toISOString(),
      status: 'active'
    };
    subs.push(newSub);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
    return newSub;
  },

  requestSubscription: (sub: Omit<Subscription, 'id' | 'startDate' | 'status' | 'startDateISO' | 'expiryDateISO'>) => {
    const subs = StorageService.getSubscriptions();
    const newSub: Subscription = {
      ...sub,
      id: Date.now().toString(),
      startDate: '',
      status: 'pending'
    };
    subs.push(newSub);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
    return newSub;
  },

  validateSubscription: (id: string) => {
    const subs = StorageService.getSubscriptions();
    const start = new Date();
    const expiry = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    const updated = subs.map((sub) =>
      sub.id === id
        ? {
            ...sub,
            status: 'active',
            startDate: start.toLocaleDateString('fr-FR'),
            startDateISO: start.toISOString(),
            expiryDateISO: expiry.toISOString()
          }
        : sub
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  rejectSubscription: (id: string) => {
    const subs = StorageService.getSubscriptions();
    const updated = subs.map((sub) => (sub.id === id ? { ...sub, status: 'rejected' } : sub));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

  getAllChefs: (): ChefProfileData[] => {
    return defaultChefs.map((chef) => {
      const stored = localStorage.getItem(`${CHEF_PROFILE_PREFIX}${chef.slug}`);
      return stored ? (JSON.parse(stored) as ChefProfileData) : chef;
    });
  },

  getChefBySlug: (slug: string): ChefProfileData | null => {
    const stored = localStorage.getItem(`${CHEF_PROFILE_PREFIX}${slug}`);
    if (stored) return JSON.parse(stored) as ChefProfileData;
    const found = defaultChefs.find((c) => c.slug === slug);
    return found ?? null;
  },

  getChefPlans: (chefSlug: string): ChefPlan[] => {
    const key = `${CHEF_PLANS_PREFIX}${chefSlug}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data) as ChefPlan[];
    return [
      { id: 'midi', name: 'Formule Déjeuner', price: '7500', active: true, days: ['lundi','mardi','mercredi','jeudi','vendredi'] },
      { id: 'soir', name: 'Formule Dîner', price: '7500', active: true, days: ['lundi','mardi','mercredi','jeudi','vendredi'] },
      { id: 'complet', name: 'Formule Complète', price: '14000', active: true, days: ['lundi','mardi','mercredi','jeudi','vendredi'] }
    ];
  },

  saveChefPlans: (chefSlug: string, plans: ChefPlan[]) => {
    const key = `${CHEF_PLANS_PREFIX}${chefSlug}`;
    localStorage.setItem(key, JSON.stringify(plans));
  },

  getChefSettings: (chefSlug: string): ChefSettings => {
    const key = `${CHEF_SETTINGS_PREFIX}${chefSlug}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultSettings();
  },

  saveChefSettings: (chefSlug: string, settings: ChefSettings) => {
    const key = `${CHEF_SETTINGS_PREFIX}${chefSlug}`;
    localStorage.setItem(key, JSON.stringify(settings));
  },

  saveChefProfile: (profile: ChefProfileData) => {
    const key = `${CHEF_PROFILE_PREFIX}${profile.slug}`;
    localStorage.setItem(key, JSON.stringify(profile));
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
    phone: '+22891209085',
    isSuspended: false
  },
  {
    slug: 'anna',
    name: 'Chef Anna',
    bio: 'Recettes italiennes maison.',
    rating: 4.9,
    cuisineType: 'Italien',
    location: 'Bè, Lomé',
    phone: '+22891209085',
    isSuspended: false
  },
  {
    slug: 'gloria',
    name: 'Chef Gloria',
    bio: 'Pâtisserie et desserts gourmands.',
    rating: 4.7,
    cuisineType: 'Pâtisserie',
    location: 'Hèdzranawoé, Lomé',
    phone: '+22891209085',
    isSuspended: false
  },
  {
    slug: 'yao',
    name: 'Chef Yao',
    bio: 'Cuisine traditionnelle revisitée.',
    rating: 4.6,
    cuisineType: 'Fusion',
    location: 'Adidogomé, Lomé',
    phone: '+22891209085',
    isSuspended: false
  },
  {
    slug: 'ama',
    name: 'Chef Ama',
    bio: 'Spécialités healthy et vegan.',
    rating: 4.5,
    cuisineType: 'Healthy',
    location: 'Nyékonakpoè, Lomé',
    phone: '+22891209085',
    isSuspended: false
  }
];

const defaultSettings = (): ChefSettings => ({
  prixMidi: '7500',
  prixSoir: '7500',
  prixComplet: '14000',
  isMidiActive: true,
  isSoirActive: true,
  joursService: {
    lundi: true,
    mardi: true,
    mercredi: true,
    jeudi: true,
    vendredi: true,
    samedi: true,
    dimanche: false
  },
  rayonLivraison: '10',
  telephone: '+22891209085',
  adresse: 'Tokoin, Lomé',
  horairesLivraison: '11h30-13h00 / 18h30-20h00'
});
