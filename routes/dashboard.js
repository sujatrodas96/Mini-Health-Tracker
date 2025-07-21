const express = require('express');
const router = express.Router();
const { getAdminDashboard } = require('../Controllers/dashboardController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.get('/api/dashboard/admin', auth, isAdmin, getAdminDashboard);

module.exports = router;
