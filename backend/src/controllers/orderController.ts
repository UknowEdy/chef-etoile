import { Request, Response } from 'express';
import { Order, OrderStatus, PlanType, MealTime } from '../models/Order.js';
import { User } from '../models/User.js';

/**
 * Créer une nouvelle commande
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      phone,
      address,
      plan,
      mealPreference,
      totalPrice,
      allergies
    } = req.body;

    // Validation basique
    if (!customerName || !phone || !address || !plan || !mealPreference || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Vérifier ou créer l'utilisateur
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        fullName: customerName,
        phone,
        address,
        allergies
      });
    }

    // Créer la commande
    const order = await Order.create({
      userId: user._id,
      customerName,
      phone,
      address,
      plan,
      mealPreference,
      totalPrice,
      allergies,
      status: OrderStatus.PENDING
    });

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      data: order
    });
  } catch (error: any) {
    console.error('Erreur création commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande',
      error: error.message
    });
  }
};

/**
 * Récupérer toutes les commandes
 */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('userId', 'fullName phone email');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes',
      error: error.message
    });
  }
};

/**
 * Récupérer une commande par ID
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('userId', 'fullName phone email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande introuvable'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande',
      error: error.message
    });
  }
};

/**
 * Mettre à jour le statut d'une commande
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, gps } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Le statut est requis'
      });
    }

    const updateData: any = { status };

    // Si le statut est READY et que des coordonnées GPS sont fournies
    if (status === OrderStatus.READY && gps) {
      updateData.gps = {
        lat: gps.lat,
        lng: gps.lng,
        timestamp: new Date()
      };
    }

    // Si livré, enregistrer l'heure
    if (status === OrderStatus.DELIVERED) {
      updateData.actualDeliveryTime = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande introuvable'
      });
    }

    res.json({
      success: true,
      message: 'Statut mis à jour',
      data: order
    });
  } catch (error: any) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

/**
 * Mettre à jour les coordonnées GPS d'une commande (bouton "Je suis prêt")
 */
export const updateOrderGPS = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Les coordonnées GPS sont requises'
      });
    }

    // Validation des coordonnées
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Coordonnées GPS invalides'
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        gps: {
          lat,
          lng,
          timestamp: new Date()
        },
        status: OrderStatus.READY
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande introuvable'
      });
    }

    res.json({
      success: true,
      message: 'Position GPS enregistrée',
      data: order
    });
  } catch (error: any) {
    console.error('Erreur mise à jour GPS:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de la position',
      error: error.message
    });
  }
};

/**
 * Supprimer une commande
 */
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande introuvable'
      });
    }

    res.json({
      success: true,
      message: 'Commande supprimée'
    });
  } catch (error: any) {
    console.error('Erreur suppression commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};
