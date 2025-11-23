import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chef_etoile_secret_2024';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    phone: string;
    email?: string;
    role: string;
    fullName: string;
  };
}

/**
 * Middleware d'authentification générale
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé - Token manquant'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Vérifier que l'utilisateur existe toujours
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    req.user = {
      id: decoded.id,
      phone: decoded.phone,
      email: decoded.email,
      role: decoded.role,
      fullName: decoded.fullName
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
      error: error.message
    });
  }
};

/**
 * Middleware d'authentification admin
 */
export const authenticateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé - Token manquant'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Vérifier le rôle admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé aux administrateurs'
      });
    }

    // Vérifier que l'admin existe toujours
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    req.user = {
      id: decoded.id,
      phone: decoded.phone,
      email: decoded.email,
      role: decoded.role,
      fullName: decoded.fullName
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
      error: error.message
    });
  }
};

/**
 * Middleware d'authentification livreur
 */
export const authenticateLivreur = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé - Token manquant'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Vérifier le rôle livreur ou admin
    if (decoded.role !== 'livreur' && decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé aux livreurs'
      });
    }

    req.user = {
      id: decoded.id,
      phone: decoded.phone,
      email: decoded.email,
      role: decoded.role,
      fullName: decoded.fullName
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
      error: error.message
    });
  }
};
