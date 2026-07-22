import express from 'express';
import { handleContactSubmit } from '../controllers/contactController.js';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { contactRateLimiter } from '../middlewares/rateLimiter.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public APIs
router.post('/contact', contactRateLimiter, handleContactSubmit);
router.get('/blogs', getBlogs);
router.get('/blog/:slug', getBlogBySlug);

// Admin / Upload APIs
router.post('/upload', protectAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded' });
  }
  return res.status(200).json({
    success: true,
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename
  });
});

router.post('/blogs', protectAdmin, upload.single('featuredImage'), createBlog);
router.put('/blogs/:id', protectAdmin, upload.single('featuredImage'), updateBlog);
router.delete('/blogs/:id', protectAdmin, deleteBlog);

export default router;
