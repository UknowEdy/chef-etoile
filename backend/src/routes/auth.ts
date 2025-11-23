import express from 'express';
import {
  registerClient,
  loginClient,
  loginAdmin,
  createAdmin,
  verifyToken,
  setReadyToReceive
} from '../controllers/authController.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Inscription client
 * @access  Public
 */
router.post('/register', registerClient);

/**
 * @route   POST /api/auth/login
 * @desc    Login client (téléphone + mot de passe)
 * @access  Public
 */
router.post('/login', loginClient);

/**
 * @route   POST /api/auth/admin/login
 * @desc    Login admin (email + mot de passe)
 * @access  Public
 */
router.post('/admin/login', loginAdmin);

/**
 * @route   POST /api/auth/admin/create
 * @desc    Créer un admin (setup initial)
 * @access  Public (à sécuriser en production)
 */
router.post('/admin/create', createAdmin);

/**
 * @route   GET /api/auth/verify
 * @desc    Vérifier le token et retourner l'utilisateur
 * @access  Private
 */
router.get('/verify', verifyToken);

/**
 * @route   PUT /api/auth/ready/:userId
 * @desc    Mettre à jour le statut "prêt à recevoir" avec GPS
 * @access  Private
 */
router.put('/ready/:userId', setReadyToReceive);

export default router;
