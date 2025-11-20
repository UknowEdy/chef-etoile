import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderGPS,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Créer une nouvelle commande
 * @access  Public
 */
router.post('/', createOrder);

/**
 * @route   GET /api/orders
 * @desc    Récupérer toutes les commandes (avec filtres optionnels)
 * @access  Public
 * @query   status, page, limit
 */
router.get('/', getAllOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Récupérer une commande par ID
 * @access  Public
 */
router.get('/:id', getOrderById);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Mettre à jour le statut d'une commande
 * @access  Public
 */
router.put('/:id/status', updateOrderStatus);

/**
 * @route   PUT /api/orders/:id/gps
 * @desc    Mettre à jour les coordonnées GPS (Bouton "Je suis prêt")
 * @access  Public
 */
router.put('/:id/gps', updateOrderGPS);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Supprimer une commande
 * @access  Public
 */
router.delete('/:id', deleteOrder);

export default router;
