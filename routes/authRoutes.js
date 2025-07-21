const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { register, login, logout } = require('../Controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;