const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const userAdminController = require('./userAdminController');

// 모든 라우트는 관리자 전용
router.use(verifyToken, authorize('admin'));

// 사용자 목록 조회
router.get('/', userAdminController.getUsers);

// 사업자 사용자 목록 조회
router.get('/business', userAdminController.getBusinessUsers);

// 사용자 상세 조회
router.get('/:id', userAdminController.getUserById);

// 사용자 정보 수정
router.put('/:id', userAdminController.updateUser);

// 사용자 삭제(비활성화)
router.delete('/:id', userAdminController.deleteUser);

// 사용자 상태 변경 (활성/비활성)
router.put('/:id/status', userAdminController.updateUserStatus);

module.exports = router;


