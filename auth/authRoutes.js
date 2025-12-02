const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('./authMiddleware');
const authController = require('./authController');

// 로그인
router.post('/login', authController.login);

// 로그아웃 (토큰 클라이언트 삭제 방식)
router.post('/logout', authController.logout);

// 내 정보 조회
router.get('/me', verifyToken, authorize('business', 'admin'), authController.getMyInfo);

// 비밀번호 변경
router.put('/password', verifyToken, authorize('business', 'admin'), authController.changePassword);

// 비밀번호 재설정 요청
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;


