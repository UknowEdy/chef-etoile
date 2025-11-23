import { Response } from 'express';
import { User } from '../models/User.js';
import { Dish } from '../models/Dish.js';
import { Delivery } from '../models/Delivery.js';
import { AuthRequest } from '../middleware/adminAuth.js';
import { generateDeliveryRoutes, generateDeliveryReport, ClientWithDistance } from '../services/routingService.js';

// Prix des formules
const PRICES = {
  COMPLETE: 14000,
  PARTIEL: 7500
};

/**
 * Récupérer tous les clients prêts à recevoir
 */
export const getReadyClients = async (req: AuthRequest, res: Response) => {
  try {
    const clients = await User.find({
      role: 'client',
      readyToReceive: true,
      'location.lat': { $exists: true },
      'location.lng': { $exists: true }
    }).select('fullName phone address location readyAt readyToReceive allergies');

    res.json({
      success: true,
      data: clients,
      count: clients.length
    });
  } catch (error: any) {
    console.error('Erreur getReadyClients:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des clients',
      error: error.message
    });
  }
};

/**
 * Générer les tournées de livraison
 */
export const generateRoutes = async (req: AuthRequest, res: Response) => {
  try {
    const { numLivreurs } = req.body;

    if (!numLivreurs || numLivreurs < 1 || numLivreurs > 10) {
      return res.status(400).json({
        success: false,
        message: 'Nombre de livreurs invalide (1-10)'
      });
    }

    // Récupérer les clients prêts
    const clients = await User.find({
      role: 'client',
      readyToReceive: true,
      'location.lat': { $exists: true },
      'location.lng': { $exists: true }
    }).select('fullName phone address location readyAt allergies').lean();

    if (clients.length === 0) {
      return res.json({
        success: true,
        message: 'Aucun client prêt à recevoir',
        data: {
          routes: [],
          totalClients: 0,
          totalDistance: 0,
          totalEstimatedTime: 0
        }
      });
    }

    // Transformer en format ClientWithDistance
    const clientsForRouting: ClientWithDistance[] = clients.map(c => ({
      _id: c._id.toString(),
      fullName: c.fullName,
      phone: c.phone,
      address: c.address || '',
      location: c.location as any,
      readyAt: c.readyAt
    }));

    // Générer les routes optimisées
    const result = generateDeliveryRoutes(clientsForRouting, numLivreurs);

    res.json({
      success: true,
      message: `${result.routes.length} tournée(s) générée(s) pour ${result.totalClients} client(s)`,
      data: result
    });
  } catch (error: any) {
    console.error('Erreur generateRoutes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération des tournées',
      error: error.message
    });
  }
};

/**
 * Exporter les tournées en texte (pour PDF/impression)
 */
export const exportRoutes = async (req: AuthRequest, res: Response) => {
  try {
    const { numLivreurs } = req.body;

    if (!numLivreurs || numLivreurs < 1 || numLivreurs > 10) {
      return res.status(400).json({
        success: false,
        message: 'Nombre de livreurs invalide (1-10)'
      });
    }

    // Récupérer les clients prêts
    const clients = await User.find({
      role: 'client',
      readyToReceive: true,
      'location.lat': { $exists: true },
      'location.lng': { $exists: true }
    }).select('fullName phone address location readyAt allergies').lean();

    const clientsForRouting: ClientWithDistance[] = clients.map(c => ({
      _id: c._id.toString(),
      fullName: c.fullName,
      phone: c.phone,
      address: c.address || '',
      location: c.location as any,
      readyAt: c.readyAt
    }));

    const result = generateDeliveryRoutes(clientsForRouting, numLivreurs);
    const report = generateDeliveryReport(result);

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=tournees.txt');
    res.send(report);
  } catch (error: any) {
    console.error('Erreur exportRoutes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export',
      error: error.message
    });
  }
};

/**
 * Récupérer les statistiques admin complètes
 */
export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalClients,
      readyClients,
      totalLivreurs,
      totalAdmins,
      activeSubscribers,
      pendingPayments,
      topDishes
    ] = await Promise.all([
      User.countDocuments({ role: 'client' }),
      User.countDocuments({ role: 'client', readyToReceive: true }),
      User.countDocuments({ role: 'livreur' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'client', 'subscription.isActive': true }),
      User.countDocuments({ role: 'client', 'subscription.paymentProof': { $exists: true }, 'subscription.paymentVerified': false }),
      Dish.find().sort({ likesCount: -1 }).limit(5)
    ]);

    // Calcul revenus semaine
    const subscribersWithPlan = await User.find({
      role: 'client',
      'subscription.isActive': true
    }).select('subscription.plan');

    let weeklyRevenue = 0;
    subscribersWithPlan.forEach(user => {
      if (user.subscription?.plan === 'COMPLETE') {
        weeklyRevenue += PRICES.COMPLETE;
      } else if (user.subscription?.plan === 'PARTIEL') {
        weeklyRevenue += PRICES.PARTIEL;
      }
    });

    res.json({
      success: true,
      data: {
        totalClients,
        readyClients,
        totalLivreurs,
        totalAdmins,
        activeSubscribers,
        pendingPayments,
        weeklyRevenue,
        topDishes
      }
    });
  } catch (error: any) {
    console.error('Erreur getAdminStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

/**
 * Réinitialiser le statut "prêt" de tous les clients
 */
export const resetAllReadyStatus = async (req: AuthRequest, res: Response) => {
  try {
    const result = await User.updateMany(
      { role: 'client', readyToReceive: true },
      { readyToReceive: false, readyAt: null }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} client(s) réinitialisé(s)`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error: any) {
    console.error('Erreur resetAllReadyStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation',
      error: error.message
    });
  }
};

/**
 * Récupérer tous les utilisateurs (clients, livreurs)
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;

    const filter: any = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Erreur getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

/**
 * Récupérer les paiements en attente de vérification
 */
export const getPendingPayments = async (req: AuthRequest, res: Response) => {
  try {
    const pendingPayments = await User.find({
      role: 'client',
      'subscription.paymentProof': { $exists: true, $ne: '' },
      'subscription.paymentVerified': false
    }).select('fullName phone email subscription createdAt');

    res.json({
      success: true,
      data: pendingPayments
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paiements',
      error: error.message
    });
  }
};

/**
 * Vérifier un paiement et activer l'abonnement
 */
export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { approved, plan, mealPreference } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    if (approved) {
      // Générer QR code et numéro de confirmation
      const confirmationNumber = `CE${Date.now().toString(36).toUpperCase()}`;
      const qrCode = `CHEF-ETOILE:${confirmationNumber}`;

      user.subscription = {
        isActive: true,
        plan: plan || user.subscription?.plan || 'COMPLETE',
        mealPreference: mealPreference || user.subscription?.mealPreference || 'BOTH',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 jours
        paymentProof: user.subscription?.paymentProof,
        paymentVerified: true
      };
      user.qrCode = qrCode;
      user.confirmationNumber = confirmationNumber;

      // Vérifier parrainage
      if (user.referredBy) {
        const referrer = await User.findOne({ referralCode: user.referredBy });
        if (referrer) {
          referrer.referralCount = (referrer.referralCount || 0) + 1;
          // 5 filleuls = 1 repas gratuit
          if (referrer.referralCount % 5 === 0) {
            referrer.freeMealsEarned = (referrer.freeMealsEarned || 0) + 1;
          }
          await referrer.save();
        }
      }

      await user.save();

      res.json({
        success: true,
        message: 'Abonnement activé avec succès',
        data: {
          user: {
            fullName: user.fullName,
            confirmationNumber,
            qrCode,
            subscription: user.subscription
          }
        }
      });
    } else {
      // Paiement refusé
      user.subscription = {
        ...user.subscription,
        paymentVerified: false,
        isActive: false
      } as any;
      await user.save();

      res.json({
        success: true,
        message: 'Paiement refusé'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification',
      error: error.message
    });
  }
};

/**
 * Calcul de stock (160g par personne)
 */
export const calculateStock = async (req: AuthRequest, res: Response) => {
  try {
    const { clientCount, gramsPerPerson = 160 } = req.body;

    // Si pas de clientCount fourni, compter les abonnés actifs
    let count = clientCount;
    if (!count) {
      count = await User.countDocuments({
        role: 'client',
        'subscription.isActive': true
      });
    }

    const totalGrams = count * gramsPerPerson;
    const totalKg = totalGrams / 1000;

    res.json({
      success: true,
      data: {
        clientCount: count,
        gramsPerPerson,
        totalGrams,
        totalKg: Math.ceil(totalKg * 10) / 10 // Arrondi au 100g supérieur
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul',
      error: error.message
    });
  }
};

/**
 * Exporter liste livraisons du jour (pour PDF)
 */
export const exportDailyDeliveries = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Clients avec abonnement actif
    const activeClients = await User.find({
      role: 'client',
      'subscription.isActive': true
    }).select('fullName phone address subscription confirmationNumber').sort({ fullName: 1 });

    let report = `═══════════════════════════════════════════\n`;
    report += `     CHEF ÉTOILE - LIVRAISONS DU JOUR\n`;
    report += `     ${today.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n`;
    report += `═══════════════════════════════════════════\n\n`;
    report += `Total clients: ${activeClients.length}\n\n`;

    activeClients.forEach((client, index) => {
      report += `${index + 1}. ${client.fullName}\n`;
      report += `   📞 ${client.phone}\n`;
      report += `   📍 ${client.address || 'Adresse non renseignée'}\n`;
      report += `   📋 ${client.subscription?.plan || 'N/A'} - ${client.subscription?.mealPreference || 'N/A'}\n`;
      report += `   🔢 ${client.confirmationNumber || 'N/A'}\n`;
      report += `   ─────────────────────────────────────\n`;
    });

    report += `\n═══════════════════════════════════════════\n`;
    report += `Généré le ${new Date().toLocaleString('fr-FR')}\n`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=livraisons_${today.toISOString().split('T')[0]}.txt`);
    res.send(report);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export',
      error: error.message
    });
  }
};
