const jwt = require('jsonwebtoken');
const User = require('../Models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // 1. Token missing
    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized: Token missing from cookies', 
        code: 'AUTH_001' 
      });
    }

    // 2. Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT Verification Error:', err.message);
      return res.status(401).json({ 
        error: 'Unauthorized: Invalid or expired token', 
        code: 'AUTH_002' 
      });
    }

    // 3. Find user from DB
    const user = await User.findById(decoded.id);

    // 4. User not found
    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized: User not found in database', 
        code: 'AUTH_003' 
      });
    }

    // 5. Check if user is active (optional field: user.status === 'active')
    if (user.status && user.status !== 'active') {
      return res.status(403).json({ 
        error: 'Forbidden: User is inactive or banned', 
        code: 'AUTH_004' 
      });
    }

    // 6. Attach user data to request (lightweight object)
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next(); // Allow route to continue
  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    res.status(500).json({ 
      error: 'Internal Server Error in auth middleware', 
      code: 'AUTH_500' 
    });
  }
};