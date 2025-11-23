import subscriptionRoutes from './routes/subscriptions.js';
import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import ordersRouter from './routes/orders.js';
import deliveryRouter from './routes/delivery.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';

// Charger les variables d'environnement
dotenv.config();

// Configuration
const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chef-etoile';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://chef-etoile.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (développement)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Chef★ API - Système de livraison intelligent',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      orders: '/api/orders',
      delivery: '/api/delivery',
      health: '/health'
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/delivery', deliveryRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Erreur serveur:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Socket.IO - Gestion des événements temps réel
io.on('connection', (socket) => {
  console.log(`🔌 Client connecté: ${socket.id}`);

  // Événement: Client a cliqué sur "Je suis prêt"
  socket.on('client_ready', (data) => {
    console.log('📍 Client prêt:', data);
    // Notifier tous les admins/livreurs
    io.emit('new_ready_order', {
      orderId: data.orderId,
      customerName: data.customerName,
      timestamp: new Date()
    });
  });

  // Événement: Livreur démarre une livraison
  socket.on('delivery_started', (data) => {
    console.log('🚚 Livraison démarrée:', data);
    // Notifier le client spécifique
    io.emit('delivery_status_update', {
      orderId: data.orderId,
      status: 'OUT_FOR_DELIVERY',
      message: 'Votre commande est en route !',
      timestamp: new Date()
    });
  });

  // Événement: Livraison terminée
  socket.on('delivery_completed', (data) => {
    console.log('✅ Livraison terminée:', data);
    io.emit('delivery_status_update', {
      orderId: data.orderId,
      status: 'DELIVERED',
      message: 'Votre commande a été livrée. Bon appétit !',
      timestamp: new Date()
    });
  });

  // Événement: Mise à jour de position livreur (optionnel)
  socket.on('update_driver_location', (data) => {
    io.emit('driver_location_updated', data);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client déconnecté: ${socket.id}`);
  });
});

// Connexion MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connecté');
    console.log(`📍 Base de données: ${mongoose.connection.name}`);

    // Démarrer le serveur seulement après connexion DB
    httpServer.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`🌍 URL: http://localhost:${PORT}`);
      console.log(`📡 Socket.IO prêt pour les connexions temps réel`);
      console.log(`🔧 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🍽️  Coordonnées cuisine: ${process.env.KITCHEN_LAT}, ${process.env.KITCHEN_LNG}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erreur connexion MongoDB:', error);
    process.exit(1);
  });

// Gestion des signaux de fermeture
process.on('SIGINT', async () => {
  console.log('\n⚠️  Arrêt du serveur...');
  await mongoose.connection.close();
  httpServer.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

export { app, io };
