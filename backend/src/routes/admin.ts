import { Router } from 'express';
import { authenticateAdmin } from '../middleware/adminAuth.js';
import {
  getReadyClients,
  generateRoutes,
  exportRoutes,
  getAdminStats,
  resetAllReadyStatus,
  getAllUsers,
  getPendingPayments,
  verifyPayment,
  calculateStock,
  exportDailyDeliveries
} from '../controllers/adminController.js';

const router = Router();

// Toutes les routes admin nécessitent une authentification admin
router.use(authenticateAdmin);

/**
 * @route   GET /api/admin/clients/ready
 * @desc    Récupérer tous les clients prêts à recevoir
 * @access  Admin
 */
router.get('/clients/ready', getReadyClients);

/**
 * @route   POST /api/admin/routes/generate
 * @desc    Générer les tournées de livraison optimisées
 * @access  Admin
 */
router.post('/routes/generate', generateRoutes);

/**
 * @route   POST /api/admin/routes/export
 * @desc    Exporter les tournées en format texte
 * @access  Admin
 */
router.post('/routes/export', exportRoutes);

/**
 * @route   GET /api/admin/stats
 * @desc    Récupérer les statistiques admin complètes
 * @access  Admin
 */
router.get('/stats', getAdminStats);

/**
 * @route   POST /api/admin/reset-ready
 * @desc    Réinitialiser le statut "prêt" de tous les clients
 * @access  Admin
 */
router.post('/reset-ready', resetAllReadyStatus);

/**
 * @route   GET /api/admin/users
 * @desc    Récupérer tous les utilisateurs (avec pagination)
 * @access  Admin
 */
router.get('/users', getAllUsers);

/**
 * @route   GET /api/admin/payments/pending
 * @desc    Récupérer les paiements en attente de vérification
 * @access  Admin
 */
router.get('/payments/pending', getPendingPayments);

/**
 * @route   POST /api/admin/payments/:userId/verify
 * @desc    Vérifier un paiement et activer l'abonnement
 * @access  Admin
 */
router.post('/payments/:userId/verify', verifyPayment);

/**
 * @route   POST /api/admin/stock/calculate
 * @desc    Calculer les stocks nécessaires (160g/personne)
 * @access  Admin
 */
router.post('/stock/calculate', calculateStock);

/**
 * @route   GET /api/admin/deliveries/export
 * @desc    Exporter la liste des livraisons du jour
 * @access  Admin
 */
router.get('/deliveries/export', exportDailyDeliveries);

export default router;
