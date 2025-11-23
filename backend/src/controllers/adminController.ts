import { Response } from 'express';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/adminAuth.js';
import { generateDeliveryRoutes, generateDeliveryReport, ClientWithDistance } from '../services/routingService.js';

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
 * Récupérer les statistiques admin
 */
export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalClients,
      readyClients,
      totalLivreurs,
      totalAdmins
    ] = await Promise.all([
      User.countDocuments({ role: 'client' }),
      User.countDocuments({ role: 'client', readyToReceive: true }),
      User.countDocuments({ role: 'livreur' }),
      User.countDocuments({ role: 'admin' })
    ]);

    res.json({
      success: true,
      data: {
        totalClients,
        readyClients,
        totalLivreurs,
        totalAdmins
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
