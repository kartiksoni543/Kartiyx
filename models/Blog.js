import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    index: true,
    lowercase: true
  },
  featuredImage: {
    type: String,
    default: 'assets/img/blog/1.jpg'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    default: 'Tutorial',
    trim: true
  },
  tags: [
    {
      type: String,
      trim: true
    }
  ],
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  author: {
    name: { type: String, default: 'Kartik Soni' },
    avatar: { type: String, default: 'assets/img/blog/author.jpg' },
    role: { type: String, default: 'Full Stack Engineer & Designer' }
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  readingTime: {
    type: String,
    default: '5 min read'
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Published'
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate reading time & generate slug before saving
blogSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const textOnly = this.content.replace(/<[^>]*>/g, '');
    const wordCount = textOnly.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    this.readingTime = `${minutes} min read`;
  }

  this.updatedDate = Date.now();
  next();
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;
