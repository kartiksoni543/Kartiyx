import jwt from 'jsonwebtoken';

export const protectAdmin = (req, res, next) => {
  let token = null;

  // Check Authorization header or session/cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.session && req.session.adminToken) {
    token = req.session.adminToken;
  }

  if (!token) {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
    }
    return res.redirect('/admin/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_kartik_portfolio_2026');
    req.admin = decoded;
    next();
  } catch (error) {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
    req.session.adminToken = null;
    return res.redirect('/admin/login');
  }
};
