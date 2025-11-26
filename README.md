# Chef★ - Frontend

PWA ultra légère pour la plateforme d'abonnement repas Chef★.

## 🚀 Installation

```bash
npm install
```

## 💻 Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 📦 Build Production

```bash
npm run build
```

## 🏗️ Structure du projet

```
chefetoile-frontend/
├── public/
│   ├── manifest.webmanifest
│   └── sw.js
├── src/
│   ├── components/
│   │   ├── AppShell.tsx
│   │   ├── TopBar.tsx
│   │   ├── BottomNav.tsx
│   │   └── index.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Find.tsx
│   │   ├── ChefPage.tsx
│   │   ├── ChefMenu.tsx
│   │   ├── Subscribe.tsx
│   │   ├── MySubscriptions.tsx
│   │   ├── MyOrders.tsx
│   │   ├── Install.tsx
│   │   ├── chef-admin/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── MenuHistory.tsx
│   │   │   ├── Subscribers.tsx
│   │   │   ├── Orders.tsx
│   │   │   └── Delivery.tsx
│   │   └── superadmin/
│   │       ├── Login.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Chefs.tsx
│   │       ├── NewChef.tsx
│   │       └── Config.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📱 Routes

### Client
- `/` - Accueil
- `/find` - Recherche de Chefs★
- `/chef/:slug` - Page du Chef★
- `/chef/:slug/menu` - Menus complets
- `/chef/:slug/subscribe` - S'abonner
- `/my/subscriptions` - Mes abonnements
- `/my/orders` - Mes repas
- `/install` - Installer la PWA

### Chef Admin
- `/chef-admin/login` - Connexion Chef
- `/chef-admin/dashboard` - Tableau de bord
- `/chef-admin/menu` - Gérer les menus
- `/chef-admin/menu/history` - Historique des menus
- `/chef-admin/subscribers` - Mes abonnés
- `/chef-admin/orders` - Commandes du jour
- `/chef-admin/delivery` - Livraisons

### Super Admin
- `/superadmin/login` - Connexion Super Admin
- `/superadmin/dashboard` - Tableau de bord
- `/superadmin/chefs` - Gérer les Chefs★
- `/superadmin/chefs/new` - Créer un Chef★
- `/superadmin/config` - Configuration

## 🎨 Design System

- **Couleurs principales**: #111827, #FFFFFF, #6B7280, #E5E7EB
- **Police**: system-ui
- **Border-radius**: 16-24px
- **Layout**: Mobile-first, max-width 420px
- **Orientation**: Portrait

## 🔌 Prochaines étapes

1. Brancher l'API backend (à créer)
2. Implémenter l'authentification réelle
3. Ajouter la géolocalisation
4. Intégrer WhatsApp Business API
5. Ajouter les notifications push
6. Implémenter le paiement Mobile Money

## 📝 Notes

- Tous les composants sont TypeScript
- PWA installable (manifest + service worker)
- Mock data pour le développement
- Aucune dépendance lourde
- CSS vanilla (pas de framework)
