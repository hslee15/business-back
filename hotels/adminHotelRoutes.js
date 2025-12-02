const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const adminHotelController = require('./adminHotelController');

// 모든 라우트는 인증 및 관리자 권한 필요
router.use(verifyToken, authorize('admin'));

// 호텔 목록 조회
router.get('/', adminHotelController.getHotels);

// 호텔 상세 조회
router.get('/:id', adminHotelController.getHotelById);

// 호텔 등록
router.post('/', adminHotelController.createHotel);

// 호텔 수정
router.put('/:id', adminHotelController.updateHotel);

// 호텔 삭제 (비활성화)
router.delete('/:id', adminHotelController.deleteHotel);

// 호텔 승인
router.post('/:id/approve', adminHotelController.approveHotel);

// 호텔 승인 거부
router.post('/:id/reject', adminHotelController.rejectHotel);

module.exports = router;


