import Blog from '../models/Blog.js';

export const generateSitemapXML = async (baseUrl) => {
  const domain = baseUrl || process.env.SITE_URL || 'https://kartiksoni.gt.tc';
  
  const staticPages = [
    '',
    '/about',
    '/projects',
    '/services',
    '/experience',
    '/skills',
    '/blog',
    '/contact'
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static URLs
  staticPages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${domain}${page}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Dynamic Blog Posts
  try {
    const blogs = await Blog.find({ status: 'Published' }).select('slug updatedAt publishedDate');
    blogs.forEach(blog => {
      xml += `  <url>\n`;
      xml += `    <loc>${domain}/blog/${blog.slug}</loc>\n`;
      xml += `    <lastmod>${(blog.updatedAt || blog.publishedDate || new Date()).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });
  } catch (err) {
    console.error('[Sitemap Generation Error]:', err.message);
  }

  xml += `</urlset>`;
  return xml;
};

export const generateRobotsTxt = (baseUrl) => {
  const domain = baseUrl || process.env.SITE_URL || 'https://kartiksoni.gt.tc';
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${domain}/sitemap.xml
`;
};
