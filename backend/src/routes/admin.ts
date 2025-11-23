import { Router } from 'express';
import { authenticateAdmin } from '../middleware/adminAuth.js';
import {
  getReadyClients,
  generateRoutes,
  exportRoutes,
  getAdminStats,
  resetAllReadyStatus,
  getAllUsers
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
 * @desc    Récupérer les statistiques admin
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

export default router;
