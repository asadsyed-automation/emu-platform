import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const testPrimaryDirect = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://eumsyedasad14_db_user:QvBWyzG0fXdawsSQ@ac-x53x6do-shard-00-01.sjjmybr.mongodb.net:27017/emu_db?ssl=true&authSource=admin&directConnection=true";
  console.log('Testing Primary Direct Connection...');
  try {
    const conn = await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 5000 });
    console.log(`✅ SUCCESS: Connected to Primary! Host: ${conn.connection.host}`);
    const col = conn.connection.db.collection('_test');
    await col.insertOne({ verified: true, time: new Date() });
    await col.deleteMany({ verified: true });
    console.log(`✅ SUCCESS: Write and Delete verified on primary host!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(`❌ Error: ${e.message}`);
    process.exit(1);
  }
};

testPrimaryDirect();
