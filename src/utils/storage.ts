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

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
