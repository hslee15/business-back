const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const bookingController = require('./bookingController');

// 모든 라우트는 인증 및 사업자 권한 필요
router.use(verifyToken, authorize('business'));

router.get('/', bookingController.getMyReservations);
router.get('/:id', bookingController.getReservationById);
router.put('/:id/status', bookingController.updateReservationStatus);

module.exports = router;

