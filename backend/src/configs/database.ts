import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('❌  MONGODB_URI environment variable is missing.');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI);
    console.log('✅  MongoDB connection established successfully.');
  } catch (error) {
    console.error('❌  Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
