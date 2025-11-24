import express, { Request, Response } from 'express';
import { Subscription, SubscriptionStatus, SubscriptionPlanType } from '../models/Subscription.js';
import { User } from '../models/User.js';
import { Payment } from '../models/Payment.js';
import mongoose from 'mongoose';

const router = express.Router();

// Subscription pricing config
const SUBSCRIPTION_PRICES = {
  [SubscriptionPlanType.PARTIAL]: 7500,    // 5 meals/week
  [SubscriptionPlanType.COMPLETE]: 14000   // 10 meals/week
};

const SUBSCRIPTION_MEALS = {
  [SubscriptionPlanType.PARTIAL]: 5,
  [SubscriptionPlanType.COMPLETE]: 10
};

// GET /api/subscriptions/user/:userId - Get user subscription
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID utilisateur invalide'
      });
    }

    const subscription = await Subscription.findOne({
      userId,
      status: { $ne: SubscriptionStatus.CANCELLED }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Aucun abonnement actif'
      });
    }

    return res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Erreur récupération abonnement:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/subscriptions - Create subscription
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, planType } = req.body;

    if (!userId || !planType) {
      return res.status(400).json({
        success: false,
        message: 'userId et planType requis'
      });
    }

    if (!Object.values(SubscriptionPlanType).includes(planType)) {
      return res.status(400).json({
        success: false,
        message: 'Type de plan invalide'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Check if user already has active subscription
    const existingSubscription = await Subscription.findOne({
      userId,
      status: { $ne: SubscriptionStatus.CANCELLED }
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'L\'utilisateur a déjà un abonnement actif'
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 1 week subscription

    const subscription = new Subscription({
      userId,
      planType,
      status: SubscriptionStatus.PENDING,
      startDate,
      endDate,
      pricePerWeek: SUBSCRIPTION_PRICES[planType],
      mealsPerWeek: SUBSCRIPTION_MEALS[planType],
      mealsRemaining: SUBSCRIPTION_MEALS[planType]
    });

    await subscription.save();

    return res.status(201).json({
      success: true,
      message: 'Abonnement créé (en attente de paiement)',
      data: subscription
    });
  } catch (error) {
    console.error('Erreur création abonnement:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT /api/subscriptions/:id/activate - Admin activates subscription after payment
router.put('/:id/activate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID abonnement invalide'
      });
    }

    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { status: SubscriptionStatus.ACTIVE },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Abonnement non trouvé'
      });
    }

    // Generate QR Code for the user
    const user = await User.findById(subscription.userId);
    if (user && !user.qrCodeId) {
      user.qrCodeId = `CHEF-${Date.now()}`;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Abonnement activé',
      data: subscription
    });
  } catch (error) {
    console.error('Erreur activation abonnement:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT /api/subscriptions/:id/deduct-meal - Deduct one meal
router.put('/:id/deduct-meal', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Abonnement non trouvé'
      });
    }

    if ((subscription.mealsRemaining || 0) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Pas de repas restant'
      });
    }

    subscription.mealsRemaining = (subscription.mealsRemaining || 0) - 1;
    await subscription.save();

    return res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Erreur déduction repas:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

export default router;
