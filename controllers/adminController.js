import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Message from '../models/Message.js';
import Setting from '../models/Setting.js';
import jwt from 'jsonwebtoken';

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Default fallback check against env credentials if DB user is not yet created
    let user = await User.findOne({ $or: [{ username }, { email: username }] });

    let isMatch = false;
    if (user) {
      isMatch = await user.comparePassword(password);
    } else if (username === (process.env.ADMIN_USERNAME || 'admin') && password === (process.env.ADMIN_PASSWORD || 'AdminPassword123!')) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user ? user._id : 'admin_default', username: username, role: 'admin' },
      process.env.JWT_SECRET || 'super_secret_jwt_key_kartik_portfolio_2026',
      { expiresIn: '7d' }
    );

    if (req.session) {
      req.session.adminToken = token;
      req.session.adminUser = username;
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { username, role: 'admin' }
    });
  } catch (error) {
    console.error('[Admin Controller - Login Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// Admin Logout
export const logoutAdmin = (req, res) => {
  if (req.session) {
    req.session.adminToken = null;
    req.session.adminUser = null;
  }
  return res.redirect('/admin/login');
};

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'Published' });
    const draftBlogs = await Blog.countDocuments({ status: 'Draft' });
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ status: 'Unread' });

    const totalViewsResult = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalMessages,
        unreadMessages,
        totalViews
      }
    });
  } catch (error) {
    console.error('[Admin Controller - Stats Error]:', error);
    return res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};

// Get Contact Messages
export const getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments();

    return res.status(200).json({
      success: true,
      count: messages.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      messages
    });
  } catch (error) {
    console.error('[Admin Controller - getMessages Error]:', error);
    return res.status(500).json({ success: false, message: 'Error fetching messages' });
  }
};

// Delete Contact Message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('[Admin Controller - deleteMessage Error]:', error);
    return res.status(500).json({ success: false, message: 'Error deleting message' });
  }
};

// Update Website / SEO Settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    const { siteName, metaTitle, metaDescription, keywords, contactEmail, githubUrl, linkedinUrl, twitterUrl } = req.body;

    if (siteName) settings.siteName = siteName;
    if (metaTitle) settings.metaTitle = metaTitle;
    if (metaDescription) settings.metaDescription = metaDescription;
    if (keywords) settings.keywords = keywords;
    if (contactEmail) settings.contactEmail = contactEmail;
    if (githubUrl) settings.githubUrl = githubUrl;
    if (linkedinUrl) settings.linkedinUrl = linkedinUrl;
    if (twitterUrl) settings.twitterUrl = twitterUrl;

    settings.updatedAt = Date.now();
    await settings.save();

    return res.status(200).json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('[Admin Controller - updateSettings Error]:', error);
    return res.status(500).json({ success: false, message: 'Error updating settings' });
  }
};
