import express, { Request, Response } from 'express';
import { User, UserType } from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// POST /api/auth/login - Client login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Téléphone et mot de passe requis'
      });
    }

    // Find user by phone
    const user = await User.findOne({ phone, userType: UserType.CLIENT });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Téléphone ou mot de passe incorrect'
      });
    }

    // Compare plain text password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Téléphone ou mot de passe incorrect'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        userId: user._id,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Erreur login client:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/auth/admin/login - Admin login
router.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Find user by email
    const user = await User.findOne({ email, userType: UserType.ADMIN });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Compare plain text password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Connexion admin réussie',
      data: {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Erreur login admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/auth/register - Client registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { fullName, phone, address, password, referralCode } = req.body;

    // Validation
    if (!fullName || !phone || !address || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ce numéro de téléphone existe déjà'
      });
    }

    // Create unique codes
    const qrCodeId = uuidv4();
    const userReferralCode = `CHEF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    // Create user
    const newUser = new User({
      fullName,
      phone,
      address,
      password,
      userType: UserType.CLIENT,
      qrCodeId,
      referralCode: userReferralCode,
      referredByCode: referralCode || undefined
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: {
        userId: newUser._id,
        fullName: newUser.fullName,
        phone: newUser.phone,
        referralCode: newUser.referralCode
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

export default router;
