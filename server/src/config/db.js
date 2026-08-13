import mongoose from 'mongoose';
import dns from 'dns';

// Use Google/Cloudflare public DNS to bypass local ISP/router SRV lookup timeouts
dns.setServers(['8.8.8.8', '1.1.1.1']);

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      console.warn('⚠️ MONGODB_URI is not defined in environment. Server starting without DB connection.');
      return;
    }
    const conn = await mongoose.connect(connStr);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
