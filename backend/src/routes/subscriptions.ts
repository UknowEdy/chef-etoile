import fs from 'fs';
import express from 'express';
import User from '../models/User';
import WeeklyMenu from '../models/WeeklyMenu';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET menu actif
router.get('/weekly-menu', async (req, res) => {
  try {
    const menu = await WeeklyMenu.findOne({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: menu });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer menu (admin)
router.post('/weekly-menu', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { weekNumber, year, meals } = req.body;
    await WeeklyMenu.updateMany({ isActive: true }, { isActive: false });
    const menu = new WeeklyMenu({ weekNumber, year, isActive: true, meals });
    await menu.save();
    res.json({ success: true, data: menu });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET liste clients (admin)
router.get('/clients', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const clients = await User.find({ role: 'CLIENT' })
      .select('name email phone address subscription')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: clients });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT activer abonnement (admin)
router.put('/clients/:clientId/subscription', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { clientId } = req.params;
    const { isActive, type, startDate, endDate } = req.body;
    const user = await User.findById(clientId);
    if (!user) return res.status(404).json({ error: 'Client non trouvé' });
    user.subscription = {
      isActive,
      type,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    await user.save();
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
