const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate either registered user (JWT) or Guest session
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  const guestSessionId = req.headers['x-guest-session-id'];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_detective_jwt_key_replace_in_production');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists',
          error: { code: 'USER_NOT_FOUND' }
        });
      }
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authorization token',
        error: { code: 'TOKEN_INVALID' }
      });
    }
  }

  // Fallback to guest session if header exists
  if (guestSessionId) {
    req.guestSessionId = guestSessionId;
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Access denied: Authentication or guest session header required',
    error: { code: 'UNAUTHORIZED' }
  });
};

// Optional auth: populate req.user or req.guestSessionId if present, but allow public browsing
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  const guestSessionId = req.headers['x-guest-session-id'];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_detective_jwt_key_replace_in_production');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore token decode error in optional auth
    }
  }

  if (guestSessionId) {
    req.guestSessionId = guestSessionId;
  }

  next();
};

module.exports = { protect, optionalAuth };

