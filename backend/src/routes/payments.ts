import express, { Request, Response } from 'express';
import { Payment, PaymentStatus } from '../models/Payment.js';
import { Subscription } from '../models/Subscription.js';
import mongoose from 'mongoose';

const router = express.Router();

// POST /api/payments - Create payment record
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, subscriptionId, amount, proofImage, transactionId } = req.body;

    if (!userId || !subscriptionId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'userId, subscriptionId et amount requis'
      });
    }

    // Verify subscription exists
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Abonnement non trouvé'
      });
    }

    const payment = new Payment({
      userId,
      subscriptionId,
      amount,
      currency: 'FCFA',
      proofImage,
      transactionId,
      status: PaymentStatus.PENDING
    });

    await payment.save();

    return res.status(201).json({
      success: true,
      message: 'Paiement enregistré (en attente de vérification)',
      data: payment
    });
  } catch (error) {
    console.error('Erreur création paiement:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/payments/pending - Get all pending payments (Admin)
router.get('/pending', async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({ status: PaymentStatus.PENDING })
      .populate('userId', 'fullName phone')
      .populate('subscriptionId', 'planType pricePerWeek')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Erreur récupération paiements:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/payments/user/:userId - Get user payments
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID utilisateur invalide'
      });
    }

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Erreur récupération paiements utilisateur:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT /api/payments/:id/verify - Verify payment (Admin)
router.put('/:id/verify', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID paiement invalide'
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      id,
      {
        status: PaymentStatus.VERIFIED,
        verifiedAt: new Date(),
        verifiedBy: adminId
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    // Activate subscription
    await Subscription.findByIdAndUpdate(
      payment.subscriptionId,
      { status: 'ACTIVE' }
    );

    return res.status(200).json({
      success: true,
      message: 'Paiement vérifié et abonnement activé',
      data: payment
    });
  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT /api/payments/:id/reject - Reject payment (Admin)
router.put('/:id/reject', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID paiement invalide'
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      id,
      {
        status: PaymentStatus.REJECTED,
        rejectionReason: reason
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Paiement rejeté',
      data: payment
    });
  } catch (error) {
    console.error('Erreur rejet paiement:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

export default router;
