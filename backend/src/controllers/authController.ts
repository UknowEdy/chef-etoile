import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chef_etoile_secret_2024';
const JWT_EXPIRES_IN = '7d';

/**
 * Génère un token JWT
 */
function generateToken(user: IUser): string {
  return jwt.sign(
    {
      id: user._id,
      phone: user.phone,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Inscription client
 */
export const registerClient = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, password, address, email, allergies } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un compte existe déjà avec ce numéro de téléphone'
      });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      fullName,
      phone,
      password,
      address: address || '',
      email,
      allergies,
      role: 'client'
    });

    // Générer le token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          role: user.role,
          address: user.address
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Erreur inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

/**
 * Login client (téléphone + mot de passe)
 */
export const loginClient = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Téléphone et mot de passe requis'
      });
    }

    // Trouver l'utilisateur avec le mot de passe
    const user = await User.findOne({ phone }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Générer le token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          role: user.role,
          address: user.address,
          readyToReceive: user.readyToReceive,
          location: user.location
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Erreur login client:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

/**
 * Login admin (email + mot de passe)
 */
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Trouver l'admin avec le mot de passe
    const user = await User.findOne({ email, role: 'admin' }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects ou accès non autorisé'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Générer le token avec rôle admin
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Connexion admin réussie',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Erreur login admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion admin',
      error: error.message
    });
  }
};

/**
 * Créer un admin (à utiliser une seule fois pour setup)
 */
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // Vérifier si un admin existe déjà avec cet email
    const existingAdmin = await User.findOne({ email, role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Un admin existe déjà avec cet email'
      });
    }

    // Créer l'admin
    const admin = await User.create({
      fullName,
      email,
      password,
      phone: phone || `admin_${Date.now()}`,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin créé avec succès',
      data: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error: any) {
    console.error('Erreur création admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'admin',
      error: error.message
    });
  }
};

/**
 * Vérifier le token et retourner l'utilisateur
 */
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          role: user.role,
          address: user.address,
          readyToReceive: user.readyToReceive,
          location: user.location
        }
      }
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Token invalide',
      error: error.message
    });
  }
};

/**
 * Mettre à jour le statut "prêt à recevoir" avec position GPS
 */
export const setReadyToReceive = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { lat, lng, ready } = req.body;

    if (ready && (!lat || !lng)) {
      return res.status(400).json({
        success: false,
        message: 'Position GPS requise pour être prêt à recevoir'
      });
    }

    const updateData: any = {
      readyToReceive: ready
    };

    if (ready) {
      updateData.location = {
        lat,
        lng,
        updatedAt: new Date()
      };
      updateData.readyAt = new Date();
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: ready ? 'Vous êtes maintenant prêt à recevoir votre commande' : 'Statut mis à jour',
      data: {
        readyToReceive: user.readyToReceive,
        location: user.location
      }
    });
  } catch (error: any) {
    console.error('Erreur setReadyToReceive:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};
