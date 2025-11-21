import mongoose from 'mongoose';
const uri='mongodb+srv://edemkukuz_db_user:GGd43WiW722MaHA9@kobarapide.d6ora5t.mongodb.net/chef-etoile';
mongoose.connect(uri).then(async()=>{
console.log('🔌 Connecté');
const db=mongoose.connection.db;
await db.dropDatabase();
console.log('🗑️ Base supprimée');
const U=mongoose.model('u',new mongoose.Schema({
nom:String,phone:String,quartier:String,
gps:{lat:Number,lng:Number}
}));
const O=mongoose.model('o',new mongoose.Schema({
customerName:String,phone:String,neighborhood:String,
formule:String,amount:Number,status:String,
paymentStatus:String,
gps:{lat:Number,lng:Number,timestamp:Date}
}));
const q=[
{n:'Bè',l:6.1156,g:1.2425},
{n:'Tokoin',l:6.1467,g:1.2314},
{n:'Agoè',l:6.1833,g:1.2167},
{n:'Cacavéli',l:6.1445,g:1.2456}
];
console.log('👥 Création 20 users...');
for(let i=1;i<=20;i++){
const qr=q[i%4];
const u=await U.create({
nom:`Client${i}`,
phone:`+228 90 ${i}0 00 ${i}0`,
quartier:qr.n,
gps:{lat:qr.l,lng:qr.g}
});
const st=['PENDING','CONFIRMED','READY','DELIVERING','DELIVERED'][i%5];
await O.create({customerName:`Test Client${i}`,phone:u.phone,neighborhood:u.quartier,formule:i%2?'COMPLETE':'SIMPLE_DEJEUNER',amount:i%2?10000:5000,status:st,paymentStatus:st==='PENDING'?'PENDING':'PAID',gps:st==='READY'?{lat:u.gps.lat,lng:u.gps.lng,timestamp:new Date()}:undefined});
}
const t=await O.countDocuments();
const r=await O.countDocuments({status:'READY'});
console.log(`✅ ${t} commandes | 🟢 ${r} READY`);
process.exit(0);
});
