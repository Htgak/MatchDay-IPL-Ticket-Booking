const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.use(authMiddleware, isAdmin);

router.get('/stats', adminController.getDashboardStats);
router.post('/matches', adminController.createMatch);

module.exports = router;
