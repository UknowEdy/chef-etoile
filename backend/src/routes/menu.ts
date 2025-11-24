import express, { Request, Response } from 'express';
import { WeeklyMenu } from '../models/WeeklyMenu.js';
import { Dish } from '../models/Dish.js';
import mongoose from 'mongoose';

const router = express.Router();

// Helper function to get Monday of the given week
function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// GET /api/menu/current - Get current week menu
router.get('/current', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const weekStart = getMondayOfWeek(today);

    let menu = await WeeklyMenu.findOne({ weekStart }).populate([
      { path: 'meals.lunch', model: 'Dish' },
      { path: 'meals.dinner', model: 'Dish' }
    ]);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu de la semaine non trouvé'
      });
    }

    return res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    console.error('Erreur récupération menu:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/menu/:weekStart - Get menu for specific week
router.get('/:weekStart', async (req: Request, res: Response) => {
  try {
    const { weekStart } = req.params;
    const date = new Date(weekStart);

    const menu = await WeeklyMenu.findOne({ weekStart: date }).populate([
      { path: 'meals.lunch', model: 'Dish' },
      { path: 'meals.dinner', model: 'Dish' }
    ]);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu non trouvé'
      });
    }

    return res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    console.error('Erreur récupération menu:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/menu - Create or update weekly menu (Admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { weekStart, meals } = req.body;

    if (!weekStart || !meals) {
      return res.status(400).json({
        success: false,
        message: 'weekStart et meals requis'
      });
    }

    // Validate meals structure
    const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    for (const meal of meals) {
      if (!validDays.includes(meal.dayOfWeek)) {
        return res.status(400).json({
          success: false,
          message: 'Jour invalide'
        });
      }

      // Validate that lunch/dinner are valid ObjectIds
      if (meal.lunch && !mongoose.Types.ObjectId.isValid(meal.lunch)) {
        return res.status(400).json({
          success: false,
          message: 'ID de plat invalide'
        });
      }
      if (meal.dinner && !mongoose.Types.ObjectId.isValid(meal.dinner)) {
        return res.status(400).json({
          success: false,
          message: 'ID de plat invalide'
        });
      }
    }

    const date = new Date(weekStart);
    const menu = await WeeklyMenu.findOneAndUpdate(
      { weekStart: date },
      { meals },
      { upsert: true, new: true }
    ).populate([
      { path: 'meals.lunch', model: 'Dish' },
      { path: 'meals.dinner', model: 'Dish' }
    ]);

    return res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    console.error('Erreur création/mise à jour menu:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT /api/menu/:menuId/meal/:day - Update meal for specific day
router.put('/:menuId/meal/:day', async (req: Request, res: Response) => {
  try {
    const { menuId, day } = req.params;
    const { lunch, dinner } = req.body;

    const menu = await WeeklyMenu.findById(menuId);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu non trouvé'
      });
    }

    const mealIndex = menu.meals.findIndex(m => m.dayOfWeek === day);

    if (mealIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Jour non trouvé'
      });
    }

    if (lunch) menu.meals[mealIndex].lunch = lunch as any;
    if (dinner) menu.meals[mealIndex].dinner = dinner as any;

    await menu.save();
    await menu.populate([
      { path: 'meals.lunch', model: 'Dish' },
      { path: 'meals.dinner', model: 'Dish' }
    ]);

    return res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    console.error('Erreur mise à jour meal:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

export default router;
