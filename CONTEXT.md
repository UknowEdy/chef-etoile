# 📋 CHEF ÉTOILE - CONTEXTE COMPLET DU PROJET

## 🎯 QU'EST-CE QUE CHEF ÉTOILE ?

Service de livraison de repas gastronomiques africains à Lomé, Togo.
Abonnement hebdomadaire (Lundi-Vendredi) avec menu rotatif.

**🌍 MISSION :** Démocratiser l'accès à une cuisine de qualité
**❤️ OBJECTIF :** Livraison rapide et intelligente avec optimisation GPS

---

## 💰 TARIFS

| Formule | Repas | Prix/semaine |
|---------|-------|--------------|
| Complète | 10 repas (Déjeuner + Dîner) | 14.000 FCFA |
| Partielle | 5 repas (Déjeuner OU Dîner) | 7.500 FCFA |

**Paiement** : Mobile Money uniquement (Flooz, T-Money)
**Validation** : Upload capture d'écran → Admin vérifie → Active abonnement

---

## 🔐 AUTHENTIFICATION

### Structure User (MongoDB)
```javascript
{
  fullName: String,
  phone: String (unique),
  email?: String,
  password: String (EN CLAIR - pas de hash),
  role: 'client' | 'admin' | 'livreur',
  address: String,
  location: { lat, lng, updatedAt },
  readyToReceive: Boolean,
  readyAt: Date,
  referralCode: String (unique),
  referredBy: String,
  referralCount: Number,
  freeMealsEarned: Number,
  subscription: {
    isActive: Boolean,
    plan: 'COMPLETE' | 'PARTIEL',
    startDate: Date,
    endDate: Date,
    paymentProof: String,
    paymentVerified: Boolean
  },
  dietaryPreferences: {
    isVegetarian: Boolean,
    noFish: Boolean,
    noMeat: Boolean,
    noPork: Boolean,
    noSpicy: Boolean
  },
  createdAt: Date
}
```

### Rôles et Permissions

| Rôle | Accès | Fonctionnalités |
|------|-------|----------------|
| CLIENT | /dashboard | Voir menu, commander, QR code, parrainage |
| LIVREUR | /livreur/dashboard | Liste livraisons, scan QR, marquer livré |
| ADMIN | /admin/dashboard | Tout gérer, stats, menu, paiements, livraisons |

### Identifiants de test (seed)
```
Admin : edemkukuz+admin@gmail.com / Admin123!
Livreur 1-3 : +228 90 00 00 11/12/13 / Livreur123!
Client 1-25 : +228 90 01/02/.../25 00 00 / Client123!
```

---

## 🍽️ SYSTÈME DE MENU

### Modèle Dish
```javascript
{
  name: String,
  image: String (URL),
  description: String,
  ingredients: [String],
  likesCount: Number,
  createdAt: Date
}
```

### Modèle WeeklyMenu
```javascript
{
  weekStart: Date (lundi),
  jours: [
    {
      jour: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi',
      dejeuner: ObjectId (ref Dish),
      diner: ObjectId (ref Dish)
    }
  ],
  createdAt: Date
}
```

### Vote Système
- Client "like" un plat → likesCount++
- Admin voit "Top 5 plats demandés"
- Plats avec plus de likes = priorité menu semaine suivante

---

## 🎁 SYSTÈME DE PARRAINAGE

**Règle** : Invite 5 amis qui s'abonnent = 1 repas gratuit
```javascript
// Dans User
referralCode: "CLI001" (généré automatiquement)
referredBy: "CLI042" (code du parrain)
referralCount: 3 (nombre de filleuls)
freeMealsEarned: 0 (repas gratuits gagnés)
```

**Logique** :
1. Client partage son `referralCode`
2. Nouvel utilisateur entre le code à l'inscription
3. `referralCount++` pour le parrain
4. Si `referralCount === 5` → `freeMealsEarned++` et reset `referralCount = 0`

---

## 🚚 SYSTÈME DE LIVRAISON

### Workflow
1. Client commande via abonnement
2. Dimanche soir : Client reçoit notification "Êtes-vous prêt?"
3. Client appuie sur "Prêt à recevoir" → Envoie GPS
4. Lundi matin : Admin génère tournées
5. Livreur reçoit sa liste (clients confirmés EN PREMIER)
6. Livreur scanne QR code ou entre numéro confirmation
7. Marque "Livré" + photo

### Optimisation GPS
- Algorithme : Clustering par proximité
- Répartition équitable entre livreurs
- Ordre : Nearest Neighbor (plus proche d'abord)

### Modèle Delivery
```javascript
{
  orderId: ObjectId,
  livreurId: ObjectId,
  clientId: ObjectId,
  clientLocation: { lat, lng },
  deliveryOrder: Number (position dans la tournée),
  status: 'PENDING' | 'EN_ROUTE' | 'DELIVERED' | 'FAILED',
  deliveredAt: Date,
  photoProof: String,
  createdAt: Date
}
```

---

## 📊 BACKEND - API ENDPOINTS

### Base URL
- **Production** : `https://chef-etoile.onrender.com`
- **Local** : `http://localhost:5000`

### 1️⃣ AUTHENTIFICATION
```
POST /api/auth/login
- Body: { phone, password }
- Response: { success, token, user }

POST /api/auth/admin/login
- Body: { email, password }
- Response: { success, token, user }

POST /api/auth/register
- Body: { fullName, phone, password, referredBy? }
- Response: { success, user }
```

### 2️⃣ MENU
```
GET /api/menu/current
- Response: { menu: WeeklyMenu }

GET /api/dishes
- Response: [{ dishes }]

POST /api/dishes
- Body: { name, image, description, ingredients }
- Auth: Admin

POST /api/dishes/:id/like
- Auth: Client
```

### 3️⃣ COMMANDES
```
POST /api/orders
- Body: { plan, paymentProof }
- Auth: Client

GET /api/admin/orders/pending
- Auth: Admin

PUT /api/admin/orders/:id/verify
- Auth: Admin
```

### 4️⃣ LIVRAISONS
```
GET /api/admin/deliveries/ready-clients
- Response: [{ clients with readyToReceive=true }]
- Auth: Admin

POST /api/admin/deliveries/generate-routes
- Body: { numberOfLivreurs }
- Response: { routes: [livreur: [], clients: []] }
- Auth: Admin

GET /api/livreur/my-deliveries
- Response: [{ deliveries }]
- Auth: Livreur

POST /api/livreur/deliveries/:id/complete
- Body: { photoProof }
- Auth: Livreur
```

### 5️⃣ ADMIN STATS
```
GET /api/admin/stats
- Response: {
    totalClients,
    activeSubscriptions,
    weekRevenue,
    topDishes: [],
    pendingPayments
  }
- Auth: Admin
```

---

## 🎨 FRONTEND - STRUCTURE

### Pages
```
/                     → Landing (page d'accueil)
/login                → Login Client
/admin/login          → Login Admin
/dashboard            → ClientDashboard
/menu                 → Menu de la semaine
/admin/dashboard      → AdminDashboard
/admin/menu           → Gestion menu
/livreur/dashboard    → LivreurDashboard
```

### ClientDashboard - 3 onglets
```
1. PROFIL
   - Infos personnelles
   - Préférences alimentaires
   - QR Code unique
   - Numéro de confirmation

2. ABONNEMENT
   - Formule actuelle
   - Dates début/fin
   - Upload preuve paiement
   - Renouveler

3. PARRAINAGE
   - Mon code : CLI042
   - Filleuls : 3/5
   - Repas gratuits : 0
   - Bouton "Partager"
```

### AdminDashboard - 6 sections
```
1. STATISTIQUES
   - Abonnés actifs
   - Revenus semaine
   - Paiements en attente
   - Top 5 plats

2. PAIEMENTS
   - Liste paiements en attente
   - Voir capture d'écran
   - Approuver/Rejeter

3. MENU
   - Créer menu semaine
   - Ajouter plats
   - Voir votes clients

4. LIVRAISONS
   - Clients "Prêts à recevoir"
   - Input : Nombre de livreurs
   - Générer tournées
   - Export PDF

5. STOCKS
   - Input : Nombre clients
   - Calcul automatique : 160g/personne
   - Liste ingrédients nécessaires

6. CLIENTS
   - Liste tous les clients
   - Recherche
   - Voir profils
```

### LivreurDashboard
```
- Ma tournée du jour (ordre optimisé)
- Pour chaque client :
  - Nom, adresse, téléphone
  - Position GPS sur carte
  - Distance estimée
  - Scan QR / Saisir numéro
  - Bouton "Livré" + upload photo

- Stats perso :
  - Livraisons aujourd'hui
  - Temps moyen
  - Clients satisfaits
```

---

## 🔧 CONFIGURATION

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=chef-etoile-secret-2024
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://chef-etoile.onrender.com
```

---

## 🎨 DESIGN & LOGO

### Logo
- Fichier : `/public/images/logo.png`
- Utilisation : Navbar, Login, Dashboards
- Tailles : h-8 w-8 (navbar), h-12 w-12 (login), h-6 w-6 (dashboard)

### Image d'en-tête
- Fichier : `/public/images/hero-bg.jpeg`
- Utilisation : Landing page hero section

### Couleurs (Tailwind)
```css
chef-orange: #FF6B35
chef-gold: #FFD700
chef-cream: #FFF8F0
chef-black: #2C2C2C
```

### Icônes Lucide (AUTORISÉES)
```
Eye, EyeOff (voir mot de passe)
ArrowLeft (retour)
Loader2 (chargement)
Check, X (validation)
MapPin (GPS)
QrCode (scan)
```

**❌ NE PAS UTILISER** : ChefHat, Phone, Lock, Shield pour décoration

---

## 📝 WORKFLOW DÉVELOPPEMENT

### Setup Initial
```bash
# Backend
cd backend
npm install
npx tsx scripts/seed-complete.ts

# Frontend
npm install
npm run dev
```

### Ajouter une fonctionnalité
1. Créer modèle backend (si nécessaire)
2. Créer route API
3. Créer page/composant frontend
4. Tester
5. git add + commit + push

### Déploiement
- Frontend : Vercel (auto-deploy sur push)
- Backend : Render (auto-deploy sur push)

---

## ✅ CE QUI EST FAIT

### Backend ✅
- API Express complète
- MongoDB connecté (Atlas)
- Authentification JWT
- Routes : auth, menu, dishes, orders, deliveries, admin
- Script seed avec 1 admin, 3 livreurs, 25 clients GPS
- Déployé sur Render

### Frontend ✅
- React 19 + TypeScript + Vite
- Landing page
- Pages basiques (Admin, Dashboard, Checkout)
- Logo et images en place

---

## 🚀 CE QUI RESTE À FAIRE

### Pages à créer
- [ ] Login.tsx (client)
- [ ] AdminLogin.tsx
- [ ] ClientDashboard.tsx complet (3 onglets)
- [ ] Menu.tsx (affichage menu semaine)
- [ ] AdminMenu.tsx (gestion menu)
- [ ] LivreurDashboard.tsx
- [ ] AdminDashboard.tsx complet

### Fonctionnalités à implémenter
- [ ] Système de vote sur plats
- [ ] Génération QR code unique
- [ ] Upload preuve de paiement
- [ ] Calcul optimisation GPS tournées
- [ ] Export PDF liste livraisons
- [ ] Notifications (futur)

---

## 📞 SUPPORT

**Projet** : Chef Étoile - Livraison premium Lomé
**Développeur** : @UknowEdy
**Stack** : React + Node.js + MongoDB
**Déploiement** : Vercel + Render
**Date création** : Novembre 2024
