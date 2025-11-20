# 🍽️ Chef★ - Système de Livraison Intelligent avec GPS

Application web MVP de livraison de repas premium pour le Togo avec système GPS intelligent pour optimiser les tournées de livraison.

## 🎯 Fonctionnalités Principales

### ✨ Pour les Clients
- **Landing Page** avec 2 formules d'abonnement (Complète & Simple)
- **Formulaire de commande** avec paiement WhatsApp
- **Dashboard Client** avec suivi de commande en temps réel
- **Bouton "Je suis prêt"** pour envoyer sa position GPS au livreur
- Timeline de statut de commande

### 🚚 Pour les Livreurs/Admin
- **Dashboard Admin** avec statistiques en temps réel
- **Tournée GPS optimisée** : Tri automatique des livraisons par distance avec algorithme **Haversine**
- Bouton "Ouvrir dans Maps" pour chaque client
- Affichage de la distance et du temps estimé
- Liste de toutes les commandes avec filtres

### 🛠️ Technique
- **Backend**: Node.js + Express + TypeScript + MongoDB + Socket.io
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Algorithme GPS**: Haversine pour calcul de distances précises
- **Temps réel**: Socket.io pour notifications instantanées

---

## 📦 Structure du Projet

```
chef-etoile/
├── frontend/                    # Application React (racine)
│   ├── components/
│   │   ├── Header.tsx
│   │   └── ReadyButton.tsx     # Composant GPS "Je suis prêt"
│   ├── views/
│   │   ├── Landing.tsx         # Page d'accueil
│   │   ├── Checkout.tsx        # Formulaire commande
│   │   ├── Dashboard.tsx       # Dashboard Client
│   │   └── Admin.tsx           # Dashboard Admin GPS
│   ├── utils/
│   │   ├── api.ts              # Appels API
│   │   └── gps.ts              # Utilitaires GPS
│   ├── types.ts
│   ├── constants.ts
│   ├── App.tsx
│   ├── package.json
│   └── .env.local
│
└── backend/                     # API Node.js
    ├── src/
    │   ├── models/
    │   │   ├── User.ts
    │   │   └── Order.ts        # Modèle avec GPS
    │   ├── routes/
    │   │   ├── orders.ts
    │   │   └── delivery.ts     # Routes tournée GPS
    │   ├── controllers/
    │   │   ├── orderController.ts
    │   │   └── deliveryController.ts
    │   ├── utils/
    │   │   └── gps.ts          # Algorithme Haversine
    │   └── server.ts           # Express + Socket.io
    ├── package.json
    └── .env
```

---

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** >= 18.x
- **MongoDB** (local ou MongoDB Atlas)
- **npm** ou **yarn**

### 1️⃣ Installation du Backend

```bash
cd backend
npm install
```

### 2️⃣ Configuration Backend

Créer un fichier `.env` dans `backend/` :

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/chef-etoile

# Serveur
PORT=5000
NODE_ENV=development

# JWT (pour auth future)
JWT_SECRET=chef_etoile_secret_2024

# Coordonnées GPS de la cuisine (Lomé, Togo)
KITCHEN_LAT=6.1256
KITCHEN_LNG=1.2229

# CORS
CLIENT_URL=http://localhost:3000
```

### 3️⃣ Démarrer le Backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

✅ Vérifier : `http://localhost:5000/health`

### 4️⃣ Installation du Frontend

Retour à la racine du projet :

```bash
cd ..
npm install
```

### 5️⃣ Configuration Frontend

Créer un fichier `.env.local` à la racine :

```bash
VITE_API_URL=http://localhost:5000/api
NODE_ENV=development
```

### 6️⃣ Démarrer le Frontend

```bash
npm run dev
```

L'application démarre sur `http://localhost:3000`

---

## 📱 Utilisation

### Pour Tester le Flux Complet

#### 1. **Commander (Client)**
- Aller sur `http://localhost:3000`
- Sélectionner une formule
- Remplir le formulaire
- Simuler le paiement (ouvre WhatsApp)

#### 2. **Confirmer la Commande (Admin)**
- Dans MongoDB ou via API, mettre le statut de la commande à `CONFIRMED`

```bash
# Exemple avec curl
curl -X PUT http://localhost:5000/api/orders/{ORDER_ID}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'
```

#### 3. **Envoyer Position GPS (Client)**
- Aller sur le Dashboard Client avec l'ID de commande
- Cliquer sur le bouton **"🟢 Je suis prêt"**
- Autoriser la géolocalisation
- La position GPS est envoyée automatiquement

#### 4. **Voir la Tournée Optimisée (Admin/Livreur)**
- Aller sur `http://localhost:3000` puis naviguer vers Admin
- Onglet **"Tournée GPS"**
- Les commandes sont triées automatiquement du plus proche au plus loin
- Cliquer sur **"Ouvrir Maps"** pour naviguer

---

## 🧪 API Endpoints

### Orders
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détails d'une commande
- `PUT /api/orders/:id/status` - Mettre à jour le statut
- `PUT /api/orders/:id/gps` - Mettre à jour les coordonnées GPS

### Delivery (Tournée GPS)
- `GET /api/delivery/route` - **Tournée optimisée (tri GPS automatique)**
- `GET /api/delivery/active` - Livraisons actives
- `PUT /api/delivery/:id/start` - Démarrer une livraison
- `PUT /api/delivery/:id/complete` - Terminer une livraison
- `GET /api/delivery/calculate-distance?lat=X&lng=Y` - Calculer une distance
- `GET /api/delivery/stats` - Statistiques

---

## 🧮 Algorithme GPS (Haversine)

Le système utilise la **formule de Haversine** pour calculer la distance entre deux points GPS sur une sphère.

### Formule

```
d = 2R × arcsin(√[sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)])
```

Où :
- `R` = Rayon de la Terre (6371 km)
- `φ` = Latitude en radians
- `λ` = Longitude en radians
- `Δφ` = Différence de latitude
- `Δλ` = Différence de longitude

### Implémentation

```typescript
// backend/src/utils/gps.ts
export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

---

## 🎨 Design System

### Couleurs
- **Primary**: `#171717` (Noir mat luxe)
- **Gold**: `#fbbf24` (Doré logo)
- **Orange**: `#ea580c` (Action)
- **Green**: `#1e3932` (Contraste)
- **Background**: `#FFFFFF`

### Typographie
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

---

## 🔒 Statuts de Commande

```typescript
enum OrderStatus {
  PENDING = 'PENDING',                    // En attente de paiement
  CONFIRMED = 'CONFIRMED',                // Payée, en préparation
  READY = 'READY',                        // Client prêt (GPS envoyé)
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', // En livraison
  DELIVERED = 'DELIVERED',                // Livrée
  CANCELLED = 'CANCELLED'                 // Annulée
}
```

---

## 🧑‍💻 Scripts Disponibles

### Frontend
```bash
npm run dev       # Démarrage dev (Vite)
npm run build     # Build production
npm run preview   # Prévisualiser build
```

### Backend
```bash
npm run dev       # Démarrage dev (tsx watch)
npm run build     # Compiler TypeScript
npm start         # Démarrer production
```

---

## 🚀 Déploiement

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Render / Railway / Heroku)
1. Connecter votre repo Git
2. Configurer les variables d'environnement
3. Build command: `npm run build`
4. Start command: `npm start`

### MongoDB
- **Local**: MongoDB Community Edition
- **Cloud**: MongoDB Atlas (gratuit jusqu'à 512 MB)

---

## 🐛 Troubleshooting

### Le backend ne démarre pas
```bash
# Vérifier MongoDB
mongod --version

# Vérifier que MongoDB tourne
ps aux | grep mongod

# Démarrer MongoDB (macOS)
brew services start mongodb-community

# Démarrer MongoDB (Linux)
sudo systemctl start mongod
```

### Erreurs GPS sur mobile
- Activer HTTPS (requis pour géolocalisation sur mobile)
- Vérifier les permissions de localisation du navigateur

### CORS Errors
- Vérifier que `CLIENT_URL` dans `.env` backend correspond au frontend
- Vérifier que `VITE_API_URL` pointe vers le backend

---

## 📄 Licence

© 2025 Chef★ - Tous droits réservés

---

## 🤝 Contribution

Pour contribuer :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📞 Contact

- **Email**: contact@chef-etoile.tg
- **WhatsApp**: +228 90 00 00 00
- **Localisation**: Lomé, Togo

---

## ⭐ Fonctionnalités Futures

- [ ] Authentification JWT
- [ ] Notifications Push (PWA)
- [ ] Carte interactive (Google Maps / Mapbox)
- [ ] Historique des livraisons
- [ ] Évaluations clients
- [ ] Paiement intégré (Mobile Money API)
- [ ] Multi-langues (FR/EN)
- [ ] Mode sombre

---

**Made with ❤️ in Togo 🇹🇬**
