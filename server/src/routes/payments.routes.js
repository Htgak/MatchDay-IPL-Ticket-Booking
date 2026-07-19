const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments.controller');
const authMiddleware = require('../middlewares/auth');

router.post('/create-order', authMiddleware, paymentsController.createOrder);
router.post('/verify', authMiddleware, paymentsController.verifyPayment);

module.exports = router;
