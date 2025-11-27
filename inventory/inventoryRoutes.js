const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const inventoryController = require('./inventoryController');

// 모든 라우트는 인증 및 사업자 권한 필요
router.use(verifyToken, authorize('business'));

router.get('/rooms/:roomId/inventory', inventoryController.getInventory);
router.put('/rooms/:roomId/inventory', inventoryController.updateInventory);
router.post('/rooms/:roomId/pricing', inventoryController.setPricePolicy);

module.exports = router;

