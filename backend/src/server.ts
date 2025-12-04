import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

//app.use('/api/user', userRoutes);

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'DSA Duo Backend is Active 🚀', status: 'OK' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n⚡️ Server running on http://localhost:${PORT}`);
  console.log(`   Database URL: ${process.env.DATABASE_URL ? 'Loaded' : 'Missing'}\n`);
});