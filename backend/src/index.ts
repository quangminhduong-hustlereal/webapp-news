import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/database';

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// Port configuration
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health‑check route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running!');
});

// Connect database first, then start server
(async () => {
  try {
    await connectDB(); // wait for MongoDB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();

export default app;
