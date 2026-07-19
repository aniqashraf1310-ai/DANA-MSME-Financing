import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import healthRoutes from './routes/health.routes.js';
import applicationRoutes from './routes/applications.routes.js';
import offerRoutes from './routes/offers.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/health', healthRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/auth', authRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});
const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`DANA API running on http://localhost:${port}`));
