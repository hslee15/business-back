const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const reviewController = require('./reviewController');

// 모든 라우트는 인증 및 관리자 권한 필요
router.use(verifyToken, authorize('admin'));

// 리뷰 목록 조회
router.get('/', reviewController.getReviews);

// 신고된 리뷰 목록 조회
router.get('/reported', reviewController.getReportedReviews);

// 리뷰 상세 조회
router.get('/:id', reviewController.getReviewById);

// 리뷰 삭제
router.delete('/:id', reviewController.deleteReview);

// 리뷰 신고 처리
router.post('/:id/report', reviewController.handleReport);

module.exports = router;


