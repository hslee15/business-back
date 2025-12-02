const User = require('../auth/User');
const Hotel = require('../hotels/Hotel');
const Booking = require('../bookings/Booking');

// 공통: 날짜 필터 빌더
const buildDateFilter = (from, to, field = 'createdAt') => {
  const filter = {};
  if (from || to) {
    filter[field] = {};
    if (from) filter[field].$gte = new Date(from);
    if (to) filter[field].$lte = new Date(to);
  }
  return filter;
};

// GET /admin/stats/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [userCounts, hotelCounts, bookingAgg] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: '$role',
            total: { $sum: 1 },
            active: {
              $sum: {
                $cond: [{ $eq: ['$isActive', true] }, 1, 0],
              },
            },
          },
        },
      ]),
      Hotel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            approved: {
              $sum: {
                $cond: [{ $eq: ['$isApproved', true] }, 1, 0],
              },
            },
            pending: {
              $sum: {
                $cond: [{ $eq: ['$isApproved', false] }, 1, 0],
              },
            },
            inactive: {
              $sum: {
                $cond: [{ $eq: ['$isActive', false] }, 1, 0],
              },
            },
          },
        },
      ]),
      Booking.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            totalBookings: { $sum: 1 },
          },
        },
      ]),
    ]);

    const hotelInfo = hotelCounts[0] || {};
    const bookingInfo = bookingAgg[0] || {};

    res.json({
      success: true,
      data: {
        users: userCounts,
        hotels: {
          total: hotelInfo.total || 0,
          approved: hotelInfo.approved || 0,
          pending: hotelInfo.pending || 0,
          inactive: hotelInfo.inactive || 0,
        },
        bookings: {
          total: bookingInfo.totalBookings || 0,
          revenue: bookingInfo.totalRevenue || 0,
        },
      },
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({
      success: false,
      message: '대시보드 통계 조회 실패',
      error: error.message,
    });
  }
};

// GET /admin/stats/revenue
exports.getRevenueStats = async (req, res) => {
  try {
    const { from, to, groupBy = 'day' } = req.query;

    let groupExpr;
    if (groupBy === 'month') {
      groupExpr = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    } else if (groupBy === 'year') {
      groupExpr = { $dateToString: { format: '%Y', date: '$createdAt' } };
    } else {
      groupExpr = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    }

    const dateFilter = buildDateFilter(from, to, 'createdAt');

    const data = await Booking.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: groupExpr,
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    console.error('getRevenueStats error:', error);
    res.status(500).json({
      success: false,
      message: '매출 통계 조회 실패',
      error: error.message,
    });
  }
};

// GET /admin/stats/bookings
exports.getBookingStats = async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateFilter = buildDateFilter(from, to, 'createdAt');

    const data = await Booking.aggregate([
      {
        $match: {
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    console.error('getBookingStats error:', error);
    res.status(500).json({
      success: false,
      message: '예약 통계 조회 실패',
      error: error.message,
    });
  }
};

// GET /admin/stats/users
exports.getUserStats = async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $group: {
          _id: '$role',
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ['$isActive', true] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    console.error('getUserStats error:', error);
    res.status(500).json({
      success: false,
      message: '사용자 통계 조회 실패',
      error: error.message,
    });
  }
};

// GET /admin/stats/hotels
exports.getHotelStats = async (req, res) => {
  try {
    const data = await Hotel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [{ $eq: ['$isApproved', true] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$isApproved', false] }, 1, 0],
            },
          },
          inactive: {
            $sum: {
              $cond: [{ $eq: ['$isActive', false] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: data[0] || { total: 0, approved: 0, pending: 0, inactive: 0 },
    });
  } catch (error) {
    console.error('getHotelStats error:', error);
    res.status(500).json({
      success: false,
      message: '호텔 통계 조회 실패',
      error: error.message,
    });
  }
};


