import { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/Order.js';
import {
  sortOrdersByDistance,
  calculateDistanceFromKitchen,
  generateMapsLink,
  estimateTravelTime,
  validateCoordinates
} from '../utils/gps.js';

/**
 * Récupérer la tournée de livraison optimisée
 * Trie les commandes par distance (du plus proche au plus loin)
 */
export const getDeliveryRoute = async (req: Request, res: Response) => {
  try {
    // Récupérer toutes les commandes READY (client a cliqué "Je suis prêt")
    const readyOrders = await Order.find({
      status: OrderStatus.READY,
      gps: { $exists: true }
    }).lean();

    if (readyOrders.length === 0) {
      return res.json({
        success: true,
        message: 'Aucune commande prête pour livraison',
        data: []
      });
    }

    // Trier par distance avec algorithme Haversine
    const sortedOrders = sortOrdersByDistance(readyOrders as any);

    // Enrichir avec infos supplémentaires
    const enrichedOrders = sortedOrders.map((order) => {
      const mapsLink = order.gps
        ? generateMapsLink(order.gps.lat, order.gps.lng)
        : null;

      const estimatedTime = order.distance
        ? estimateTravelTime(order.distance)
        : null;

      return {
        ...order,
        mapsLink,
        estimatedTime,
        distanceFormatted: order.distance
          ? `${order.distance.toFixed(2)} km`
          : 'N/A'
      };
    });

    // Mettre à jour les numéros d'ordre dans la base de données
    const updatePromises = enrichedOrders.map((order) =>
      Order.findByIdAndUpdate(order._id, {
        deliveryOrder: order.deliveryOrder,
        distance: order.distance
      })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: `${enrichedOrders.length} commande(s) prête(s) pour livraison`,
      data: enrichedOrders,
      stats: {
        totalOrders: enrichedOrders.length,
        totalDistance: enrichedOrders.reduce((acc, o) => acc + (o.distance || 0), 0).toFixed(2),
        estimatedTotalTime: enrichedOrders.reduce((acc, o) => acc + (o.estimatedTime || 0), 0)
      }
    });
  } catch (error: any) {
    console.error('Erreur récupération tournée:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la tournée',
      error: error.message
    });
  }
};

/**
 * Récupérer toutes les commandes en cours de livraison
 */
export const getActiveDeliveries = async (req: Request, res: Response) => {
  try {
    const activeOrders = await Order.find({
      status: { $in: [OrderStatus.READY, OrderStatus.OUT_FOR_DELIVERY] }
    })
      .sort({ deliveryOrder: 1 })
      .lean();

    res.json({
      success: true,
      data: activeOrders
    });
  } catch (error: any) {
    console.error('Erreur récupération livraisons actives:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des livraisons',
      error: error.message
    });
  }
};

/**
 * Marquer une commande comme "En livraison"
 */
export const startDelivery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
      id,
      { status: OrderStatus.OUT_FOR_DELIVERY },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande introuvable'
      });
    }

    res.json({
      success: true,
      message: 'Livraison démarrée',
      data: order
    });
  } catch (error: any) {
    console.error('Erreur démarrage livraison:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du démarrage de la livraison',
      error: error.message
    });
  }
};

/**
 * Marquer une commande comme "Livrée"
 */
export const completeDelivery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status: OrderStatus.DELIVERED,
        actualDeliveryTime: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande introuvable'
      });
    }

    res.json({
      success: true,
      message: 'Livraison terminée',
      data: order
    });
  } catch (error: any) {
    console.error('Erreur finalisation livraison:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la finalisation',
      error: error.message
    });
  }
};

/**
 * Calculer la distance entre la cuisine et une adresse GPS
 */
export const calculateDistance = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude et longitude requises'
      });
    }

    const coords = {
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string)
    };

    if (!validateCoordinates(coords)) {
      return res.status(400).json({
        success: false,
        message: 'Coordonnées invalides'
      });
    }

    const distance = calculateDistanceFromKitchen(coords.lat, coords.lng);
    const estimatedTime = estimateTravelTime(distance);
    const mapsLink = generateMapsLink(coords.lat, coords.lng);

    res.json({
      success: true,
      data: {
        distance: distance.toFixed(2),
        distanceKm: distance,
        estimatedTimeMinutes: estimatedTime,
        mapsLink
      }
    });
  } catch (error: any) {
    console.error('Erreur calcul distance:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul de distance',
      error: error.message
    });
  }
};

/**
 * Récupérer les statistiques de livraison
 */
export const getDeliveryStats = async (req: Request, res: Response) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      readyOrders,
      outForDeliveryOrders,
      deliveredOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: OrderStatus.PENDING }),
      Order.countDocuments({ status: OrderStatus.CONFIRMED }),
      Order.countDocuments({ status: OrderStatus.READY }),
      Order.countDocuments({ status: OrderStatus.OUT_FOR_DELIVERY }),
      Order.countDocuments({ status: OrderStatus.DELIVERED })
    ]);

    // Calculer le revenu total
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: OrderStatus.CANCELLED } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        ordersByStatus: {
          pending: pendingOrders,
          confirmed: confirmedOrders,
          ready: readyOrders,
          outForDelivery: outForDeliveryOrders,
          delivered: deliveredOrders
        },
        activeOrders: pendingOrders + confirmedOrders + readyOrders + outForDeliveryOrders,
        totalRevenue
      }
    });
  } catch (error: any) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};
