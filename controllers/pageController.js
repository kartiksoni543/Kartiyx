import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import Message from '../models/Message.js';
import Setting from '../models/Setting.js';

// Default static fallback blogs for uninterrupted site loading
const defaultBlogs = [
  {
    _id: 'default_blog_1',
    title: 'Top 10 UI/UX Designers To Follow For Better Product Thinking',
    slug: 'ui-ux-designers',
    category: 'Tutorial',
    tags: ['UI/UX', 'Product Design', 'Tutorial'],
    excerpt: 'Following exceptional UI/UX designers is one of the fastest ways to improve your design judgment and product taste.',
    content: '<p>Following exceptional UI/UX designers is one of the fastest ways to improve your design judgment and product taste.</p>',
    featuredImage: '/assets/img/blog/1.jpg',
    readingTime: '5 min read',
    publishedDate: new Date('2025-02-14'),
    views: 240,
    status: 'Published'
  },
  {
    _id: 'default_blog_2',
    title: 'App Development Guides For Teams Building Better Products',
    slug: 'app-development-guides',
    category: 'Tips',
    tags: ['App Development', 'Architecture'],
    excerpt: 'Strong app development does not begin with features. It begins with deciding what the product must do clearly.',
    content: '<p>Strong app development does not begin with features. It begins with deciding what the product must do clearly.</p>',
    featuredImage: '/assets/img/blog/2.jpg',
    readingTime: '4 min read',
    publishedDate: new Date('2025-04-09'),
    views: 185,
    status: 'Published'
  },
  {
    _id: 'default_blog_3',
    title: 'Learn Graphic Design Free With Smarter Practice Habits',
    slug: 'learn-graphic-design-free',
    category: 'Freebies',
    tags: ['Graphic Design', 'Freebies'],
    excerpt: 'Learning graphic design for free is realistic if your practice is focused and intentional.',
    content: '<p>Learning graphic design for free is realistic if your practice is focused.</p>',
    featuredImage: '/assets/img/blog/3.jpg',
    readingTime: '6 min read',
    publishedDate: new Date('2025-06-21'),
    views: 310,
    status: 'Published'
  }
];

const defaultSettings = {
  siteName: 'Kartik Soni - Personal Portfolio & Blog',
  metaTitle: 'Kartik Soni | Senior Full Stack Developer & UI/UX Architect',
  metaDescription: 'Personal Portfolio & Blog of Kartik Soni, Senior Full Stack Node.js & React Developer.',
  keywords: 'Kartik Soni, Portfolio, Node.js Developer, Web Development, Full Stack',
  contactEmail: 'kartiksoni543@gmail.com'
};

// Helper to get site settings safely
const getSiteSettings = async () => {
  try {
    if (mongoose.connection.readyState !== 1) return defaultSettings;
    const settings = await Setting.findOne();
    return settings || defaultSettings;
  } catch (err) {
    return defaultSettings;
  }
};

// Home Page
export const renderHome = async (req, res) => {
  try {
    const settings = await getSiteSettings();
    let recentBlogs = defaultBlogs;

    if (mongoose.connection.readyState === 1) {
      try {
        const dbBlogs = await Blog.find({ status: 'Published' })
          .sort({ publishedDate: -1 })
          .limit(3);
        if (dbBlogs.length > 0) recentBlogs = dbBlogs;
      } catch (e) {
        recentBlogs = defaultBlogs;
      }
    }

    res.render('index', {
      settings,
      blogs: recentBlogs,
      pageTitle: 'Home',
      currentPath: '/'
    });
  } catch (error) {
    console.error('[PageController - renderHome Error]:', error);
    res.status(500).render('404', { settings: defaultSettings, message: 'Error loading home page' });
  }
};

// About Page
export const renderAbout = async (req, res) => {
  const settings = await getSiteSettings();
  res.render('about', { settings, pageTitle: 'About Me', currentPath: '/about' });
};

// Projects Page
export const renderProjects = async (req, res) => {
  const settings = await getSiteSettings();
  res.render('projects', { settings, pageTitle: 'Projects Portfolio', currentPath: '/projects' });
};

// Services Page
export const renderServices = async (req, res) => {
  const settings = await getSiteSettings();
  res.render('services', { settings, pageTitle: 'Services & Solutions', currentPath: '/services' });
};

// Experience Page
export const renderExperience = async (req, res) => {
  const settings = await getSiteSettings();
  res.render('experience', { settings, pageTitle: 'Work Experience', currentPath: '/experience' });
};

// Skills Page
export const renderSkills = async (req, res) => {
  const settings = await getSiteSettings();
  res.render('skills', { settings, pageTitle: 'Technical Skills', currentPath: '/skills' });
};

// Blog List Page
export const renderBlogList = async (req, res) => {
  try {
    const settings = await getSiteSettings();
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const category = req.query.category || '';
    const search = req.query.search || '';

    let blogs = defaultBlogs;
    let totalBlogs = defaultBlogs.length;
    let categories = ['Tutorial', 'Tips', 'Freebies'];

    if (mongoose.connection.readyState === 1) {
      try {
        const query = { status: 'Published' };
        if (category) query.category = category;
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { excerpt: { $regex: search, $options: 'i' } }
          ];
        }

        totalBlogs = await Blog.countDocuments(query);
        blogs = await Blog.find(query)
          .sort({ publishedDate: -1 })
          .skip(skip)
          .limit(limit);

        categories = await Blog.distinct('category', { status: 'Published' });
      } catch (e) {
        blogs = defaultBlogs;
      }
    }

    res.render('blog', {
      settings,
      blogs,
      categories,
      currentCategory: category,
      searchQuery: search,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalBlogs / limit)),
      pageTitle: 'Blog & Articles',
      currentPath: '/blog'
    });
  } catch (error) {
    console.error('[PageController - renderBlogList Error]:', error);
    res.status(500).render('404', { settings: defaultSettings, message: 'Error loading blogs' });
  }
};

// Blog Details Page
export const renderBlogDetails = async (req, res) => {
  try {
    const settings = await getSiteSettings();
    const { slug } = req.params;

    let blog = null;

    if (mongoose.connection.readyState === 1) {
      try {
        blog = await Blog.findOne({ slug });
        if (blog) {
          blog.views += 1;
          await blog.save();
        }
      } catch (e) {}
    }

    if (!blog) {
      blog = defaultBlogs.find(b => b.slug === slug) || defaultBlogs[0];
    }

    const previousPost = defaultBlogs[0].slug !== slug ? defaultBlogs[0] : null;
    const nextPost = defaultBlogs[1].slug !== slug ? defaultBlogs[1] : null;

    res.render('blog-details', {
      settings,
      blog,
      previousPost,
      nextPost,
      pageTitle: blog.metaTitle || blog.title,
      currentPath: `/blog/${slug}`
    });
  } catch (error) {
    console.error('[PageController - renderBlogDetails Error]:', error);
    res.status(500).render('404', { settings: defaultSettings, message: 'Error loading article' });
  }
};

// Contact Page
export const renderContact = async (req, res) => {
  const settings = await getSiteSettings();
  res.render('contact', { settings, pageTitle: 'Contact Me', currentPath: '/contact' });
};

// Admin Views
export const renderAdminLogin = (req, res) => {
  if (req.session && req.session.adminToken) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { error: null });
};

export const renderAdminDashboard = async (req, res) => {
  let totalBlogs = 3;
  let publishedBlogs = 3;
  let totalMessages = 0;
  let unreadMessages = 0;

  if (mongoose.connection.readyState === 1) {
    try {
      totalBlogs = await Blog.countDocuments();
      publishedBlogs = await Blog.countDocuments({ status: 'Published' });
      totalMessages = await Message.countDocuments();
      unreadMessages = await Message.countDocuments({ status: 'Unread' });
    } catch (e) {}
  }

  res.render('admin/dashboard', {
    stats: { totalBlogs, publishedBlogs, totalMessages, unreadMessages },
    user: req.session.adminUser || 'Admin'
  });
};

export const renderAdminBlogs = async (req, res) => {
  let blogs = defaultBlogs;
  if (mongoose.connection.readyState === 1) {
    try {
      blogs = await Blog.find().sort({ publishedDate: -1 });
    } catch (e) {}
  }
  res.render('admin/blogs', { blogs });
};

export const renderAdminBlogEditor = async (req, res) => {
  const { id } = req.params;
  let blog = null;
  if (id && mongoose.connection.readyState === 1) {
    try {
      blog = await Blog.findById(id);
    } catch (e) {}
  }
  res.render('admin/blog-editor', { blog });
};

export const renderAdminMessages = async (req, res) => {
  let messages = [];
  if (mongoose.connection.readyState === 1) {
    try {
      messages = await Message.find().sort({ createdAt: -1 });
    } catch (e) {}
  }
  res.render('admin/messages', { messages });
};

export const renderAdminSettings = async (req, res) => {
  const settings = await getSiteSettings();
  res.render('admin/settings', { settings });
};

// 404 Page
export const render404 = async (req, res) => {
  const settings = await getSiteSettings();
  res.status(404).render('404', { settings, pageTitle: 'Page Not Found', currentPath: req.originalUrl });
};
