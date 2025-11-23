import express from 'express';
import { Delivery } from '../models/Delivery';
import { User } from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Middleware pour vérifier le rôle livreur
const livreurMiddleware = (req: any, res: any, next: any) => {
  if (req.user.role !== 'livreur' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Accès réservé aux livreurs' });
  }
  next();
};

// GET livraisons du jour pour le livreur
router.get('/deliveries/today', authMiddleware, livreurMiddleware, async (req: any, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const deliveries = await Delivery.find({
      date: { $gte: today, $lt: tomorrow },
      $or: [
        { livreurId: req.user._id },
        { livreurId: null, status: { $in: ['confirmed', 'in_progress'] } }
      ]
    })
      .sort({ status: 1, deliveryOrder: 1 })
      .populate('userId', 'fullName phone address location');

    // Trier: confirmés d'abord, puis en cours, puis livrés
    const sorted = deliveries.sort((a, b) => {
      const order = { confirmed: 0, in_progress: 1, pending: 2, delivered: 3, failed: 4 };
      return (order[a.status] || 5) - (order[b.status] || 5);
    });

    res.json({ success: true, data: sorted });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET statistiques livreur du jour
router.get('/stats/today', authMiddleware, livreurMiddleware, async (req: any, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = await Delivery.aggregate([
      {
        $match: {
          livreurId: req.user._id,
          date: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      total: 0,
      delivered: 0,
      pending: 0,
      inProgress: 0
    };

    stats.forEach(s => {
      result.total += s.count;
      if (s._id === 'delivered') result.delivered = s.count;
      if (s._id === 'pending' || s._id === 'confirmed') result.pending += s.count;
      if (s._id === 'in_progress') result.inProgress = s.count;
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST scanner QR code ou saisir numéro confirmation
router.post('/scan', authMiddleware, livreurMiddleware, async (req: any, res) => {
  try {
    const { qrCode, confirmationNumber } = req.body;

    let delivery;

    if (qrCode) {
      // QR code format: CHEF-ETOILE:CEXXXXXXXX
      const confNum = qrCode.replace('CHEF-ETOILE:', '');
      delivery = await Delivery.findOne({ confirmationNumber: confNum });
    } else if (confirmationNumber) {
      delivery = await Delivery.findOne({ confirmationNumber });
    }

    if (!delivery) {
      return res.status(404).json({
        success: false,
        error: 'Livraison non trouvée. Vérifiez le code.'
      });
    }

    if (delivery.status === 'delivered') {
      return res.status(400).json({
        success: false,
        error: 'Cette livraison a déjà été effectuée.'
      });
    }

    // Marquer comme scannée
    delivery.scannedAt = new Date();
    delivery.scannedBy = req.user._id;
    delivery.status = 'in_progress';
    await delivery.save();

    res.json({
      success: true,
      data: delivery,
      message: 'Client trouvé!'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST marquer comme livré
router.post('/deliveries/:id/complete', authMiddleware, livreurMiddleware, async (req: any, res) => {
  try {
    const { photo, notes } = req.body;

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ success: false, error: 'Livraison non trouvée' });
    }

    if (delivery.status === 'delivered') {
      return res.status(400).json({ success: false, error: 'Déjà livrée' });
    }

    delivery.status = 'delivered';
    delivery.deliveredAt = new Date();
    delivery.livreurId = req.user._id;
    if (photo) delivery.deliveryPhoto = photo;
    if (notes) delivery.notes = notes;

    await delivery.save();

    res.json({
      success: true,
      data: delivery,
      message: 'Livraison confirmée!'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST marquer comme échec
router.post('/deliveries/:id/fail', authMiddleware, livreurMiddleware, async (req: any, res) => {
  try {
    const { notes } = req.body;

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ success: false, error: 'Livraison non trouvée' });
    }

    delivery.status = 'failed';
    delivery.livreurId = req.user._id;
    if (notes) delivery.notes = notes;

    await delivery.save();

    res.json({
      success: true,
      data: delivery,
      message: 'Livraison marquée comme échouée'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET détails d'une livraison
router.get('/deliveries/:id', authMiddleware, livreurMiddleware, async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('userId', 'fullName phone address location dietaryPreferences allergies');

    if (!delivery) {
      return res.status(404).json({ success: false, error: 'Livraison non trouvée' });
    }

    res.json({ success: true, data: delivery });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
