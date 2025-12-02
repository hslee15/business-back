const Review = require('./Review');

// 공통: 필터 빌더
const buildFilterFromQuery = (query) => {
  const filter = {};

  if (query.hotelId) {
    filter.hotelId = query.hotelId;
  }
  if (query.roomId) {
    filter.roomId = query.roomId;
  }
  if (query.bookingId) {
    filter.bookingId = query.bookingId;
  }
  if (query.minRating || query.maxRating) {
    filter.rating = {};
    if (query.minRating) filter.rating.$gte = Number(query.minRating);
    if (query.maxRating) filter.rating.$lte = Number(query.maxRating);
  }

  return filter;
};

// GET /admin/reviews
exports.getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const filter = buildFilterFromQuery(req.query);

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Review.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        items,
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '리뷰 목록 조회 실패', error });
  }
};

// GET /admin/reviews/:id
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: '리뷰를 찾을 수 없습니다.' });
    }

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: '리뷰 조회 실패', error });
  }
};

// DELETE /admin/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: '리뷰를 찾을 수 없습니다.' });
    }

    await Review.deleteOne({ _id: id });

    res.json({ success: true, message: '리뷰가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, message: '리뷰 삭제 중 오류가 발생했습니다.', error });
  }
};

// GET /admin/reviews/reported
exports.getReportedReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const filter = buildFilterFromQuery(req.query);
    filter.isReported = true;

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Review.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        items,
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '신고된 리뷰 목록 조회 실패', error });
  }
};

// POST /admin/reviews/:id/report
// action: 'approve' | 'dismiss' | 'delete'
exports.handleReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: '리뷰를 찾을 수 없습니다.' });
    }

    if (action === 'delete') {
      await Review.deleteOne({ _id: id });
      return res.json({ success: true, message: '리뷰가 삭제되었습니다.' });
    }

    if (action === 'approve') {
      review.isReported = false;
      review.reportStatus = 'resolved';
    } else if (action === 'dismiss') {
      review.isReported = false;
      review.reportStatus = 'dismissed';
    } else {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 action 값입니다. (approve | dismiss | delete)',
      });
    }

    await review.save();

    res.json({ success: true, message: '리뷰 신고가 처리되었습니다.', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: '리뷰 신고 처리 중 오류가 발생했습니다.', error });
  }
};


