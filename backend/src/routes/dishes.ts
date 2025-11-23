import express from 'express';
import { Dish } from '../models/Dish';
import { Vote } from '../models/Vote';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// GET tous les plats
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find().sort({ likesCount: -1 });
    res.json({ success: true, data: dishes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET top 5 plats les plus aimés
router.get('/top', async (req, res) => {
  try {
    const dishes = await Dish.find().sort({ likesCount: -1 }).limit(5);
    res.json({ success: true, data: dishes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET un plat par ID
router.get('/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ success: false, error: 'Plat non trouvé' });
    }
    res.json({ success: true, data: dish });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST créer un plat (admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, image, description, ingredients, category, isVegetarian, containsFish, containsMeat, allergens } = req.body;

    const dish = new Dish({
      name,
      image,
      description,
      ingredients: ingredients || [],
      category: category || 'plat_principal',
      isVegetarian: isVegetarian || false,
      containsFish: containsFish || false,
      containsMeat: containsMeat !== false,
      allergens: allergens || []
    });

    await dish.save();
    res.status(201).json({ success: true, data: dish });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT modifier un plat (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!dish) {
      return res.status(404).json({ success: false, error: 'Plat non trouvé' });
    }
    res.json({ success: true, data: dish });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE supprimer un plat (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) {
      return res.status(404).json({ success: false, error: 'Plat non trouvé' });
    }
    // Supprimer aussi les votes associés
    await Vote.deleteMany({ dishId: req.params.id });
    res.json({ success: true, message: 'Plat supprimé' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST voter pour un plat (like)
router.post('/:id/vote', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const dishId = req.params.id;

    // Vérifier si le vote existe déjà
    const existingVote = await Vote.findOne({ userId, dishId });

    if (existingVote) {
      // Retirer le vote
      await Vote.deleteOne({ _id: existingVote._id });
      await Dish.findByIdAndUpdate(dishId, { $inc: { likesCount: -1 } });
      return res.json({ success: true, message: 'Vote retiré', liked: false });
    }

    // Ajouter le vote
    const vote = new Vote({ userId, dishId });
    await vote.save();
    await Dish.findByIdAndUpdate(dishId, { $inc: { likesCount: 1 } });

    // Vérifier parrainage (5 votes = 1 repas gratuit)
    const userVotesCount = await Vote.countDocuments({ userId });

    res.json({ success: true, message: 'Vote ajouté', liked: true, totalVotes: userVotesCount });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET vérifier si l'utilisateur a voté pour un plat
router.get('/:id/vote-status', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const dishId = req.params.id;

    const vote = await Vote.findOne({ userId, dishId });
    res.json({ success: true, liked: !!vote });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
