const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const roomController = require('./roomController');

// 모든 라우트는 인증 및 사업자 권한 필요
router.use(verifyToken, authorize('business'));

router.get('/hotels/:hotelId', roomController.getRoomsByHotel);
router.post('/hotels/:hotelId', roomController.createRoom);
router.get('/:roomId', roomController.getRoomById);
router.put('/:roomId', roomController.updateRoom);

module.exports = router;

