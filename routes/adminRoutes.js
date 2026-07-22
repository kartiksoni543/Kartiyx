import express from 'express';
import {
  loginAdmin,
  logoutAdmin,
  getDashboardStats,
  getMessages,
  deleteMessage,
  updateSettings
} from '../controllers/adminController.js';
import {
  renderAdminLogin,
  renderAdminDashboard,
  renderAdminBlogs,
  renderAdminBlogEditor,
  renderAdminMessages,
  renderAdminSettings
} from '../controllers/pageController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin Auth Views & Actions
router.get('/login', renderAdminLogin);
router.post('/login', loginAdmin);
router.get('/logout', logoutAdmin);

// Protected Admin Panel Views
router.get('/', protectAdmin, renderAdminDashboard);
router.get('/dashboard', protectAdmin, renderAdminDashboard);
router.get('/blogs', protectAdmin, renderAdminBlogs);
router.get('/blogs/create', protectAdmin, renderAdminBlogEditor);
router.get('/blogs/edit/:id', protectAdmin, renderAdminBlogEditor);
router.get('/messages', protectAdmin, renderAdminMessages);
router.get('/settings', protectAdmin, renderAdminSettings);

// Admin Data APIs
router.get('/stats', protectAdmin, getDashboardStats);
router.get('/api/messages', protectAdmin, getMessages);
router.delete('/api/messages/:id', protectAdmin, deleteMessage);
router.post('/settings', protectAdmin, updateSettings);

export default router;
