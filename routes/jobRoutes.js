const express = require('express');
const router = express.Router();
const jobController = require('../Controllers/jobController');
const authenticate = require('../middlewares/auth');
const role = require('../middlewares/role');

router.post('/send-report',   authenticate, role('coach', 'admin'), jobController.sendReportJob);
router.post('/reminder',   authenticate, role('coach', 'admin'), jobController.sendReminderJob);

module.exports = router;
