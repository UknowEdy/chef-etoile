import express from 'express';
import WeeklyMenu from '../models/WeeklyMenu';
import { Dish } from '../models/Dish';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// GET menu actif de la semaine
router.get('/current', async (req, res) => {
  try {
    const menu = await WeeklyMenu.findOne({ isActive: true })
      .populate('meals.dejeuner.dish')
      .populate('meals.diner.dish');

    if (!menu) {
      return res.json({ success: true, data: null, message: 'Aucun menu actif' });
    }

    res.json({ success: true, data: menu });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET historique des menus (semaines passées)
router.get('/history', async (req, res) => {
  try {
    const menus = await WeeklyMenu.find({ isArchived: true })
      .sort({ startDate: -1 })
      .limit(10)
      .populate('meals.dejeuner.dish')
      .populate('meals.diner.dish');

    res.json({ success: true, data: menus });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET tous les menus (admin)
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const menus = await WeeklyMenu.find()
      .sort({ year: -1, weekNumber: -1 })
      .populate('meals.dejeuner.dish')
      .populate('meals.diner.dish');

    res.json({ success: true, data: menus });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET un menu par ID
router.get('/:id', async (req, res) => {
  try {
    const menu = await WeeklyMenu.findById(req.params.id)
      .populate('meals.dejeuner.dish')
      .populate('meals.diner.dish');

    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu non trouvé' });
    }

    res.json({ success: true, data: menu });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST créer un nouveau menu (admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { weekNumber, year, startDate, endDate, meals, setActive } = req.body;

    // Si setActive, désactiver les autres menus
    if (setActive) {
      await WeeklyMenu.updateMany({ isActive: true }, { isActive: false });
    }

    const menu = new WeeklyMenu({
      weekNumber,
      year,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: setActive || false,
      isArchived: false,
      meals: meals || []
    });

    await menu.save();
    res.status(201).json({ success: true, data: menu });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT modifier un menu (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { setActive, ...updateData } = req.body;

    // Si setActive, désactiver les autres menus
    if (setActive) {
      await WeeklyMenu.updateMany({ isActive: true }, { isActive: false });
      updateData.isActive = true;
    }

    const menu = await WeeklyMenu.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('meals.dejeuner.dish').populate('meals.diner.dish');

    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu non trouvé' });
    }

    res.json({ success: true, data: menu });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT ajouter/modifier un repas dans un menu (admin)
router.put('/:id/meal', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { day, dejeuner, diner } = req.body;

    const menu = await WeeklyMenu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu non trouvé' });
    }

    // Trouver ou créer l'entrée du jour
    const dayIndex = menu.meals.findIndex(m => m.day === day);

    const mealData = {
      day,
      dejeuner: dejeuner || { name: '', image: '', description: '' },
      diner: diner || { name: '', image: '', description: '' }
    };

    if (dayIndex >= 0) {
      menu.meals[dayIndex] = mealData as any;
    } else {
      menu.meals.push(mealData as any);
    }

    await menu.save();

    res.json({ success: true, data: menu });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST activer un menu (admin)
router.post('/:id/activate', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Désactiver tous les autres menus et archiver l'ancien actif
    await WeeklyMenu.updateMany(
      { isActive: true },
      { isActive: false, isArchived: true }
    );

    // Activer le menu sélectionné
    const menu = await WeeklyMenu.findByIdAndUpdate(
      req.params.id,
      { isActive: true, isArchived: false },
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu non trouvé' });
    }

    res.json({ success: true, data: menu, message: 'Menu activé' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE supprimer un menu (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const menu = await WeeklyMenu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu non trouvé' });
    }
    res.json({ success: true, message: 'Menu supprimé' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
