import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import Setting from '../models/Setting.js';

dotenv.config();

const initialBlogs = [
  {
    title: 'Top 10 UI/UX Designers To Follow For Better Product Thinking',
    category: 'Tutorial',
    tags: ['UI/UX', 'Product Design', 'Tutorial'],
    excerpt: 'Following exceptional UI/UX designers is one of the fastest ways to improve your design judgment and product taste.',
    content: `
      <p>Following exceptional UI/UX designers is one of the fastest ways to improve your design judgment and product taste.</p>
      <p>The best designers teach through systems, user flows, and thoughtful decision-making, not only through polished final screens.</p>
      <p>Watching how they frame problems, simplify interfaces, and guide attention helps teams build stronger digital experiences with more confidence.</p>
      <blockquote class="wp-block-quote">
         <p>“Great design is about making product complexity feel calm, clear, and purposeful.”</p>
         <p><cite>Design Note</cite></p>
      </blockquote>
      <h4>Why Strong UI/UX Designers Are Worth Following</h4>
      <p>Their case studies usually reveal more than visual taste. They expose hierarchy, spacing, onboarding logic, and the reasoning behind every interaction.</p>
      <h6>Key Points</h6>
      <ul>
         <li>Study systems, not isolated screens</li>
         <li>Focus on hierarchy and interaction clarity</li>
         <li>Observe how strong portfolios explain decisions</li>
         <li>Use inspiration to improve judgment</li>
      </ul>
    `,
    featuredImage: '/assets/img/blog/1.jpg',
    status: 'Published',
    isFeatured: true,
    views: 240
  },
  {
    title: 'App Development Guides For Teams Building Better Products',
    category: 'Tips',
    tags: ['App Development', 'Architecture', 'Node.js'],
    excerpt: 'Strong app development does not begin with features. It begins with deciding what the product must do clearly.',
    content: `
      <p>Strong app development does not begin with features. It begins with deciding what the product must do clearly, reliably, and fast for the user.</p>
      <p>Good development guides help teams move from idea to release with fewer surprises by giving structure to planning, architecture, testing, and iteration.</p>
      <blockquote class="wp-block-quote">
         <p>“Quality development guides reduce ambiguity and foster technical alignment.”</p>
         <p><cite>Dev Note</cite></p>
      </blockquote>
      <h4>What A Practical Development Guide Should Cover</h4>
      <p>A useful guide should break the work into product scope, technical foundation, interface requirements, QA, analytics, and release planning.</p>
      <h6>Key Points</h6>
      <ul>
         <li>Define scope before writing implementation details</li>
         <li>Document architecture and data flow early</li>
         <li>Plan testing and release criteria from the start</li>
      </ul>
    `,
    featuredImage: '/assets/img/blog/2.jpg',
    status: 'Published',
    isFeatured: false,
    views: 185
  },
  {
    title: 'Learn Graphic Design Free With Smarter Practice Habits',
    category: 'Freebies',
    tags: ['Graphic Design', 'Branding', 'Freebies'],
    excerpt: 'Learning graphic design for free is realistic if your practice is focused and intentional.',
    content: `
      <p>Learning graphic design for free is realistic if your practice is focused. The internet has more than enough resources, but progress depends on how intentionally you use them.</p>
      <p>Free tutorials, design breakdowns, portfolio reviews, and public briefs can build strong fundamentals when you pair them with regular critique and repetition.</p>
      <h4>How To Learn Faster Without Paid Courses</h4>
      <p>Start with typography, layout, spacing, contrast, and composition. Those principles give structure to everything else you make.</p>
    `,
    featuredImage: '/assets/img/blog/3.jpg',
    status: 'Published',
    isFeatured: false,
    views: 310
  }
];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kartik_portfolio';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Seed Admin User
    const adminExists = await User.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    if (!adminExists) {
      await User.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'kartiksoni543@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'AdminPassword123!',
        role: 'admin'
      });
      console.log('[Seeder] Created default Admin user account.');
    }

    // Seed Blogs if empty
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.insertMany(initialBlogs);
      console.log('[Seeder] Inserted initial blog entries into MongoDB.');
    }

    // Seed Settings if empty
    const settingCount = await Setting.countDocuments();
    if (settingCount === 0) {
      await Setting.create({
        siteName: 'Kartik Soni - Personal Portfolio & Blog',
        metaTitle: 'Kartik Soni | Senior Full Stack Developer & UI/UX Architect',
        metaDescription: 'Personal Portfolio & Blog of Kartik Soni, Senior Full Stack Node.js & React Developer.',
        keywords: 'Kartik Soni, Portfolio, Node.js Developer, Web Development, Full Stack',
        contactEmail: process.env.ADMIN_EMAIL || 'kartiksoni543@gmail.com'
      });
      console.log('[Seeder] Created default site settings.');
    }
  } catch (error) {
    console.error('[Seeder Warning]:', error.message);
  }
};
