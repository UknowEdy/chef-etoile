import express, { Request, Response } from 'express';
import { Dish } from '../models/Dish.js';

const router = express.Router();

// GET /api/dishes - Get all dishes
router.get('/', async (req: Request, res: Response) => {
  try {
    const dishes = await Dish.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: dishes
    });
  } catch (error) {
    console.error('Erreur récupération plats:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/dishes/:id - Get dish by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findById(id);

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Plat non trouvé'
      });
    }

    return res.status(200).json({
      success: true,
      data: dish
    });
  } catch (error) {
    console.error('Erreur récupération plat:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/dishes - Create dish (Admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, image, ingredients } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Nom et description requis'
      });
    }

    const newDish = new Dish({
      name,
      description,
      image,
      ingredients: ingredients || []
    });

    await newDish.save();

    return res.status(201).json({
      success: true,
      data: newDish
    });
  } catch (error) {
    console.error('Erreur création plat:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT /api/dishes/:id - Update dish (Admin only)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const dish = await Dish.findByIdAndUpdate(id, updates, { new: true });

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Plat non trouvé'
      });
    }

    return res.status(200).json({
      success: true,
      data: dish
    });
  } catch (error) {
    console.error('Erreur mise à jour plat:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// DELETE /api/dishes/:id - Delete dish (Admin only)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findByIdAndDelete(id);

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Plat non trouvé'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Plat supprimé'
    });
  } catch (error) {
    console.error('Erreur suppression plat:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/dishes/:id/like - Like a dish
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findByIdAndUpdate(
      id,
      { $inc: { likesCount: 1 } },
      { new: true }
    );

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Plat non trouvé'
      });
    }

    return res.status(200).json({
      success: true,
      data: dish
    });
  } catch (error) {
    console.error('Erreur like plat:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

export default router;
