const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const hotelController = require('./hotelController');

// 모든 라우트는 인증 및 사업자 권한 필요
router.use(verifyToken, authorize('business'));

router.get('/', hotelController.getMyHotels);
router.get('/:id', hotelController.getHotelById);
router.post('/', hotelController.createHotel);
router.put('/:id', hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

module.exports = router;

