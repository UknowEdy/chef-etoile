import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

// Coordonnées GPS à Lomé, Togo
const LOME_CENTER = { lat: 6.1256, lng: 1.2254 };

// Fonction pour générer des coordonnées aléatoires autour de Lomé
function randomGPS() {
  return {
    lat: LOME_CENTER.lat + (Math.random() - 0.5) * 0.1,
    lng: LOME_CENTER.lng + (Math.random() - 0.5) * 0.1
  };
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connecté');

    // Nettoyer la base
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️ Base nettoyée');

    const users = mongoose.connection.db.collection('users');
    const dishes = mongoose.connection.db.collection('dishes');
    const orders = mongoose.connection.db.collection('orders');

    // 1. ADMIN
    const admin = await users.insertOne({
      fullName: 'Admin Chef Étoile',
      phone: '+228 90 00 00 00',
      email: 'edemkukuz+admin@gmail.com',
      password: 'Admin123!',
      role: 'admin',
      address: 'Lomé Centre, Togo',
      referralCode: 'ADMIN001',
      referralCount: 0,
      freeMealsEarned: 0,
      readyToReceive: false,
      createdAt: new Date()
    });
    console.log('👤 Admin créé');

    // 2. LIVREURS (3)
    const livreurIds = [];
    for (let i = 1; i <= 3; i++) {
      const livreur = await users.insertOne({
        fullName: `Livreur ${i}`,
        phone: `+228 90 00 00 ${10 + i}`,
        password: 'Livreur123!',
        role: 'livreur',
        address: `Zone ${i}, Lomé`,
        referralCode: `LIV00${i}`,
        referralCount: 0,
        freeMealsEarned: 0,
        readyToReceive: false,
        createdAt: new Date()
      });
      livreurIds.push(livreur.insertedId);
    }
    console.log('🚴 3 livreurs créés');

    // 3. CLIENTS (25 avec GPS)
    const clientIds = [];
    for (let i = 1; i <= 25; i++) {
      const gps = randomGPS();
      const client = await users.insertOne({
        fullName: `Client ${i}`,
        phone: `+228 90 ${String(i).padStart(2, '0')} 00 00`,
        password: 'Client123!',
        role: 'client',
        address: `Quartier ${i}, Lomé`,
        location: { lat: gps.lat, lng: gps.lng, updatedAt: new Date() },
        referralCode: `CLI${String(i).padStart(3, '0')}`,
        referralCount: 0,
        freeMealsEarned: 0,
        readyToReceive: true,
        readyAt: new Date(),
        createdAt: new Date()
      });
      clientIds.push(client.insertedId);
    }
    console.log('👥 25 clients créés avec GPS');

    // 4. PLATS
    const platsData = [
      {name: 'Riz Sauce Tomate', description: 'Riz avec sauce tomate maison', likesCount: 15},
      {name: 'Attiéké Poisson', description: 'Attiéké avec poisson grillé', likesCount: 20},
      {name: 'Fufu Sauce Graine', description: 'Fufu traditionnel sauce graine', likesCount: 18},
      {name: 'Pâtes Carbonara', description: 'Pâtes crémeuses à l\'italienne', likesCount: 12},
      {name: 'Poulet Braisé', description: 'Poulet braisé avec accompagnement', likesCount: 25}
    ];
    
    const platIds = [];
    for (const plat of platsData) {
      const inserted = await dishes.insertOne({...plat, createdAt: new Date()});
      platIds.push(inserted.insertedId);
    }
    console.log('🍽️ 5 plats créés');

    // 5. COMMANDES (pour les 25 clients)
    for (const clientId of clientIds) {
      await orders.insertOne({
        userId: clientId,
        items: [
          { dishId: platIds[Math.floor(Math.random() * platIds.length)], quantity: 1 }
        ],
        status: 'PENDING',
        deliveryAddress: 'Adresse du client',
        totalAmount: 14000,
        createdAt: new Date()
      });
    }
    console.log('📦 25 commandes créées');

    // RÉCAPITULATIF
    console.log('\n🎉 SEED TERMINÉ !');
    console.log('\n📊 DONNÉES GÉNÉRÉES :');
    console.log('- 1 Admin : edemkukuz+admin@gmail.com / Admin123!');
    console.log('- 3 Livreurs : +228 90 00 00 11/12/13 / Livreur123!');
    console.log('- 25 Clients avec GPS : +228 90 01/02/.../25 00 00 / Client123!');
    console.log('- 5 Plats avec votes');
    console.log('- 25 Commandes en attente');
    console.log('\n✅ Tous prêts pour la livraison !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

seedDatabase();
