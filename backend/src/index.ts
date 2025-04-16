import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

export default app;
