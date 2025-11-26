const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const businessController = require('../controllers/businessController');
const hotelController = require('../controllers/hotelController');
const roomController = require('../controllers/roomController');

// 미들웨어 일괄 적용 (모든 요청은 사업자 권한 필요)
router.use(verifyToken, authorize('business'));

// --- 대시보드 ---
router.get('/dashboard/stats', businessController.getDashboardStats);
router.get('/dashboard/chart', businessController.getRevenueChart);

// --- 호텔 관리 ---
router.get('/hotels', hotelController.getMyHotels); // 내 호텔 목록만 조회
router.get('/hotels/:id', hotelController.getHotelById);
router.post('/hotels', hotelController.createHotel);
router.put('/hotels/:id', hotelController.updateHotel);
router.delete('/hotels/:id', hotelController.deleteHotel);

// --- 객실 관리 ---
router.get('/hotels/:hotelId/rooms', roomController.getRoomsByHotel);
router.post('/hotels/:hotelId/rooms', roomController.createRoom);
router.get('/rooms/:roomId', roomController.getRoomById);
router.put('/rooms/:roomId', roomController.updateRoom);

// --- 재고 및 가격 정책 (중요) ---
router.get('/rooms/:roomId/inventory', roomController.getInventory);
router.put('/rooms/:roomId/inventory', roomController.updateInventory); // 날짜별 재고 수정
router.post('/rooms/:roomId/pricing', roomController.setPricePolicy);   // 기간별 가격 설정

// --- 예약 관리 ---
router.get('/reservations', businessController.getMyReservations);
router.get('/reservations/:id', businessController.getReservationById);
router.put('/reservations/:id/status', businessController.updateReservationStatus);

// --- 정산 ---
router.get('/settlements', businessController.getSettlements);

module.exports = router;