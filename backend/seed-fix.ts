import mongoose from 'mongoose';
const uri='mongodb+srv://edemkukuz_db_user:GGd43WiW722MaHA9@kobarapide.d6ora5t.mongodb.net/chef-etoile';
mongoose.connect(uri).then(async()=>{
console.log('🔌 Connecté');
const db=mongoose.connection.db;
await db.collection('users').drop().catch(()=>{});
await db.collection('orders').drop().catch(()=>{});
console.log('🗑️ Collections supprimées');
const US=new mongoose.Schema({nom:String,prenom:String,phone:String,email:String,quartier:String,adresse:String,gps:{lat:Number,lng:Number}},{timestamps:true});
const OS=new mongoose.Schema({userId:mongoose.Schema.Types.ObjectId,customerName:String,phone:String,neighborhood:String,address:String,formule:String,amount:Number,status:String,paymentMethod:String,paymentStatus:String,gps:{lat:Number,lng:Number,timestamp:Date}},{timestamps:true});
const User=mongoose.model('User',US);
const Order=mongoose.model('Order',OS);
const q=[{n:'Bè',l:6.1156,g:1.2425},{n:'Tokoin',l:6.1467,g:1.2314},{n:'Agoè',l:6.1833,g:1.2167}];
for(let i=1;i<=15;i++){
const qr=q[i%3];
const u=await User.create({nom:`Client${i}`,prenom:'Test',phone:`+228 90 ${i}0 00 ${i}0`,email:`client${i}@test.tg`,quartier:qr.n,adresse:`Rue ${i}`,gps:{lat:qr.l,lng:qr.g}});
const st=['CONFIRMED','READY','DELIVERING'][i%3];
await Order.create({userId:u._id,customerName:`Test Client${i}`,phone:u.phone,neighborhood:u.quartier,address:u.adresse,formule:'COMPLETE',amount:10000,status:st,paymentMethod:'MOBILE_MONEY',paymentStatus:'PAID',gps:st==='READY'?{lat:u.gps.lat,lng:u.gps.lng,timestamp:new Date()}:undefined});
}
const t=await Order.countDocuments();
console.log(`✅ ${t} commandes avec dates`);
process.exit(0);
});
