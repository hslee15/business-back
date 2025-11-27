const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const settlementController = require('./settlementController');

// 모든 라우트는 인증 및 사업자 권한 필요
router.use(verifyToken, authorize('business'));

router.get('/', settlementController.getSettlements);

module.exports = router;

