import express, { Request, Response } from 'express';
import {
  getDeliveryRoute,
  getActiveDeliveries,
  startDelivery,
  completeDelivery,
  calculateDistance,
  getDeliveryStats
} from '../controllers/deliveryController.js';
import { Order } from '../models/Order.js';

const router = express.Router();

/**
 * @route   GET /api/delivery/route
 * @desc    Récupérer la tournée optimisée (tri par distance GPS)
 * @access  Public
 */
router.get('/route', getDeliveryRoute);

/**
 * @route   GET /api/delivery/active
 * @desc    Récupérer toutes les livraisons actives
 * @access  Public
 */
router.get('/active', getActiveDeliveries);

/**
 * @route   PUT /api/delivery/:id/start
 * @desc    Démarrer une livraison (passer en OUT_FOR_DELIVERY)
 * @access  Public
 */
router.put('/:id/start', startDelivery);

/**
 * @route   PUT /api/delivery/:id/complete
 * @desc    Terminer une livraison (passer en DELIVERED)
 * @access  Public
 */
router.put('/:id/complete', completeDelivery);

/**
 * @route   GET /api/delivery/calculate-distance
 * @desc    Calculer la distance entre la cuisine et des coordonnées GPS
 * @access  Public
 * @query   lat, lng
 */
router.get('/calculate-distance', calculateDistance);

/**
 * @route   GET /api/delivery/stats
 * @desc    Récupérer les statistiques de livraison
 * @access  Public
 */
router.get('/stats', getDeliveryStats);

/**
 * @route   GET /api/delivery/list
 * @desc    Récupérer la liste des commandes pour un livreur
 * @access  Public
 * @query   driverId
 */
router.get('/list', async (req: Request, res: Response) => {
  try {
    const { driverId } = req.query;

    // Get all confirmed orders (ready for delivery)
    const orders = await Order.find({
      status: { $in: ['CONFIRMED', 'READY', 'OUT_FOR_DELIVERY'] }
    })
      .sort({ status: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Erreur récupération livraisons:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

export default router;
