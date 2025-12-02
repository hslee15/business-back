const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const bookingController = require('./bookingController');

// 모든 라우트는 인증 및 사업자/관리자 권한 필요
router.use(verifyToken, authorize('business', 'admin'));

// 예약 목록 조회
router.get('/', bookingController.getMyReservations);

// 예약 상세 조회
router.get('/:id', bookingController.getReservationById);

// 예약 상태 변경
router.put('/:id/status', bookingController.updateReservationStatus);

// 예약 취소
router.post('/:id/cancel', bookingController.cancelReservation);

// 예약 삭제
router.delete('/:id', bookingController.deleteReservation);

module.exports = router;


