const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const dashboardController = require('./dashboardController');

// 모든 라우트는 인증 및 사업자 권한 필요
router.use(verifyToken, authorize('business'));

router.get('/stats', dashboardController.getDashboardStats);
router.get('/chart', dashboardController.getRevenueChart);

module.exports = router;

