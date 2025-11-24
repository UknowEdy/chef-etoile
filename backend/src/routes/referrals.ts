import express, { Request, Response } from 'express';
import { Referral } from '../models/Referral.js';
import { User } from '../models/User.js';
import { Subscription } from '../models/Subscription.js';
import mongoose from 'mongoose';

const router = express.Router();

const REFERRAL_BONUS_THRESHOLD = 5; // 5 friends = 1 free meal

// POST /api/referrals - Track new referral
router.post('/', async (req: Request, res: Response) => {
  try {
    const { referredId, referrerCode } = req.body;

    if (!referredId || !referrerCode) {
      return res.status(400).json({
        success: false,
        message: 'referredId et referrerCode requis'
      });
    }

    // Find referrer by code
    const referrer = await User.findOne({ referralCode: referrerCode });
    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: 'Code de parrainage invalide'
      });
    }

    // Check if referred user has active subscription
    const referredSubscription = await Subscription.findOne({
      userId: referredId,
      status: 'ACTIVE'
    });

    if (!referredSubscription) {
      return res.status(400).json({
        success: false,
        message: 'L\'utilisateur doit avoir un abonnement actif'
      });
    }

    // Create referral
    const referral = new Referral({
      referrerId: referrer._id,
      referredId,
      referrerCode,
      status: 'ACTIVE'
    });

    await referral.save();

    // Check if referrer reached bonus threshold
    const referralCount = await Referral.countDocuments({
      referrerId: referrer._id,
      status: 'ACTIVE'
    });

    if (referralCount >= REFERRAL_BONUS_THRESHOLD) {
      // Award bonus meal
      await User.findByIdAndUpdate(referrer._id, {
        $inc: { 'referralBonusMeals': 1 }
      });

      // Update referral status to USED
      const oldestReferral = await Referral.findOne({
        referrerId: referrer._id,
        status: 'ACTIVE'
      }).sort({ createdAt: 1 });

      if (oldestReferral) {
        oldestReferral.status = 'USED';
        oldestReferral.bonusMealsEarned = 1;
        await oldestReferral.save();
      }

      // Add bonus meal to current subscription
      const referrerSubscription = await Subscription.findOne({
        userId: referrer._id,
        status: 'ACTIVE'
      });

      if (referrerSubscription) {
        referrerSubscription.referralBonusMeals = (referrerSubscription.referralBonusMeals || 0) + 1;
        await referrerSubscription.save();
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Parrainage enregistré',
      data: referral
    });
  } catch (error) {
    console.error('Erreur création referral:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/referrals/user/:userId - Get user referrals count
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID utilisateur invalide'
      });
    }

    const referralCount = await Referral.countDocuments({
      referrerId: userId,
      status: 'ACTIVE'
    });

    const user = await User.findById(userId).select('referralCode');

    return res.status(200).json({
      success: true,
      data: {
        referralCode: user?.referralCode,
        activeReferrals: referralCount,
        bonusThreshold: REFERRAL_BONUS_THRESHOLD
      }
    });
  } catch (error) {
    console.error('Erreur récupération referrals:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

export default router;
