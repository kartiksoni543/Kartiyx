import Blog from '../models/Blog.js';

// Public: Get blogs with search, category, tag & pagination
export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const skip = (page - 1) * limit;

    const { category, tag, search, featured } = req.query;
    const query = { status: 'Published' };

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (featured === 'true') query.isFeatured = true;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ publishedDate: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: blogs
    });
  } catch (error) {
    console.error('[Blog Controller - getBlogs Error]:', error);
    return res.status(500).json({ success: false, message: 'Server Error fetching blog posts' });
  }
};

// Public: Get single blog post by slug
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    // Fetch previous & next post for navigation
    const previousPost = await Blog.findOne({
      status: 'Published',
      publishedDate: { $lt: blog.publishedDate }
    }).sort({ publishedDate: -1 });

    const nextPost = await Blog.findOne({
      status: 'Published',
      publishedDate: { $gt: blog.publishedDate }
    }).sort({ publishedDate: 1 });

    return res.status(200).json({
      success: true,
      data: blog,
      previousPost: previousPost ? { title: previousPost.title, slug: previousPost.slug, featuredImage: previousPost.featuredImage } : null,
      nextPost: nextPost ? { title: nextPost.title, slug: nextPost.slug, featuredImage: nextPost.featuredImage } : null
    });
  } catch (error) {
    console.error('[Blog Controller - getBlogBySlug Error]:', error);
    return res.status(500).json({ success: false, message: 'Server Error fetching blog post' });
  }
};

// Admin: Create Blog
export const createBlog = async (req, res) => {
  try {
    const { title, category, tags, excerpt, content, featuredImage, isFeatured, status, metaTitle, metaDescription } = req.body;

    const parsedTags = Array.isArray(tags)
      ? tags
      : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []);

    const newBlog = await Blog.create({
      title,
      category,
      tags: parsedTags,
      excerpt,
      content,
      featuredImage: req.file ? `/uploads/${req.file.filename}` : (featuredImage || 'assets/img/blog/1.jpg'),
      isFeatured: isFeatured === 'true' || isFeatured === true,
      status: status || 'Published',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt
    });

    return res.status(201).json({ success: true, message: 'Blog post created successfully', data: newBlog });
  } catch (error) {
    console.error('[Blog Controller - createBlog Error]:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error creating blog post' });
  }
};

// Admin: Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const { title, category, tags, excerpt, content, featuredImage, isFeatured, status, metaTitle, metaDescription } = req.body;

    if (title) blog.title = title;
    if (category) blog.category = category;
    if (excerpt) blog.excerpt = excerpt;
    if (content) blog.content = content;
    if (metaTitle) blog.metaTitle = metaTitle;
    if (metaDescription) blog.metaDescription = metaDescription;
    if (status) blog.status = status;
    if (typeof isFeatured !== 'undefined') blog.isFeatured = isFeatured === 'true' || isFeatured === true;

    if (tags) {
      blog.tags = Array.isArray(tags)
        ? tags
        : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []);
    }

    if (req.file) {
      blog.featuredImage = `/uploads/${req.file.filename}`;
    } else if (featuredImage) {
      blog.featuredImage = featuredImage;
    }

    await blog.save();
    return res.status(200).json({ success: true, message: 'Blog post updated successfully', data: blog });
  } catch (error) {
    console.error('[Blog Controller - updateBlog Error]:', error);
    return res.status(500).json({ success: false, message: 'Error updating blog post' });
  }
};

// Admin: Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    return res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('[Blog Controller - deleteBlog Error]:', error);
    return res.status(500).json({ success: false, message: 'Error deleting blog post' });
  }
};
