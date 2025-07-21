module.exports = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only', code: 'AUTH_004' });
  }
  next();
};
