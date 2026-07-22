import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

import connectDB from './config/db.js';
import pageRoutes from './routes/pageRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { generateSitemapXML, generateRobotsTxt } from './services/seoService.js';
import { seedDatabase } from './utils/seeder.js';
import { render404 } from './controllers/pageController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database & Seed initial data
connectDB().then(() => {
  seedDatabase();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security & Utility Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disabled inline CSP for GSAP, Google Fonts & local assets compatibility
  crossOriginResourcePolicy: false
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use(xss());

// Session Management
app.use(session({
  secret: process.env.JWT_SECRET || 'kartik-portfolio-secret-key-2026',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
}));

// Static files (Assets & Uploads)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(__dirname));

// SEO Routes
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const xml = await generateSitemapXML(baseUrl);
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).end();
  }
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.type('text/plain');
  res.send(generateRobotsTxt(baseUrl));
});

// Application Routes
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/', pageRoutes);

// 404 Error Handler
app.use(render404);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`[Kartik Soni Portfolio Server Running]`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log(`Admin Portal: http://localhost:${PORT}/admin/login`);
  console.log(`====================================================`);
});

export default app;
