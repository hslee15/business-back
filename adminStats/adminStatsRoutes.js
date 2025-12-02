const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const adminStatsController = require('./adminStatsController');

// 모든 라우트는 인증 및 관리자 권한 필요
router.use(verifyToken, authorize('admin'));

// 대시보드 통계
router.get('/dashboard', adminStatsController.getDashboardStats);

// 매출 통계
router.get('/revenue', adminStatsController.getRevenueStats);

// 예약 통계
router.get('/bookings', adminStatsController.getBookingStats);

// 사용자 통계
router.get('/users', adminStatsController.getUserStats);

// 호텔 통계
router.get('/hotels', adminStatsController.getHotelStats);

module.exports = router;


