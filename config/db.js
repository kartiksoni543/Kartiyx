import mongoose from 'mongoose';

// Disable Mongoose command buffering so DB queries fail instantly if MongoDB is offline
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kartik_portfolio', {
      serverSelectionTimeoutMS: 2500 // Fast 2.5s timeout if no local MongoDB service
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] ${error.message}`);
    console.warn(`[MongoDB Info] Server operating with fallback memory mode for instant response.`);
  }
};

export default connectDB;
