import express from 'express';
import {
  renderHome,
  renderAbout,
  renderProjects,
  renderServices,
  renderExperience,
  renderSkills,
  renderBlogList,
  renderBlogDetails,
  renderContact
} from '../controllers/pageController.js';

const router = express.Router();

router.get('/', renderHome);
router.get('/about', renderAbout);
router.get('/projects', renderProjects);
router.get('/services', renderServices);
router.get('/experience', renderExperience);
router.get('/skills', renderSkills);
router.get('/blog', renderBlogList);
router.get('/blog/:slug', renderBlogDetails);
router.get('/contact', renderContact);

export default router;
