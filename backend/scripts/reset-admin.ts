import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

async function resetAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connecté');

    // Supprimer l'ancien admin
    await mongoose.connection.db.collection('users').deleteOne({
      email: 'edemkukuz+admin@gmail.com'
    });
    console.log('🗑️ Ancien admin supprimé');


    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    await mongoose.connection.db.collection('users').insertOne({
      fullName: 'Admin Chef Étoile',
      phone: '+228 90 00 00 00',
      email: 'edemkukuz+admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      address: 'Lomé, Togo',
      referralCode: 'ADMIN001',
      referralCount: 0,
      freeMealsEarned: 0,
      readyToReceive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('🎉 Admin créé !');
    console.log('Email: edemkukuz+admin@gmail.com');
    console.log('Mot de passe: Admin123!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

resetAdmin();
