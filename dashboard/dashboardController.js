const Hotel = require('../hotels/Hotel');
const Booking = require('../bookings/Booking');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. 내 호텔 ID 목록 조회
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);

    // 2. 전체 예약 데이터 집계 (매출, 예약 건수)
    const stats = await Booking.aggregate([
      { $match: { hotelId: { $in: hotelIds }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    // 3. 이번 달 데이터 집계
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyStats = await Booking.aggregate([
      { 
        $match: { 
          hotelId: { $in: hotelIds }, 
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startOfMonth }
        } 
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: '$totalPrice' },
          monthlyBookings: { $sum: 1 }
        }
      }
    ]);

    // 4. 오늘 예약 건수
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({
      hotelId: { $in: hotelIds },
      checkIn: { $gte: today },
      status: { $ne: 'cancelled' }
    });

    res.json({
      success: true,
      data: {
        totalHotels: myHotels.length,
        totalRevenue: stats[0]?.totalRevenue || 0,
        totalBookings: stats[0]?.totalBookings || 0,
        monthlyRevenue: monthlyStats[0]?.monthlyRevenue || 0,
        monthlyBookings: monthlyStats[0]?.monthlyBookings || 0,
        todayBookings
      }
    });
  } catch (error) {
    res.status(500).json({ message: '통계 조회 실패', error });
  }
};

exports.getRevenueChart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = 'month' } = req.query; // month, week, year
    
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);
    
    let groupFormat;
    let dateFilter = {};
    
    if (period === 'month') {
      groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);
      dateFilter.createdAt = { $gte: startDate };
    } else if (period === 'week') {
      groupFormat = { $dateToString: { format: '%Y-%U', date: '$createdAt' } };
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 12 * 7);
      dateFilter.createdAt = { $gte: startDate };
    } else {
      groupFormat = { $dateToString: { format: '%Y', date: '$createdAt' } };
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 5);
      dateFilter.createdAt = { $gte: startDate };
    }
    
    const chartData = await Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          status: { $ne: 'cancelled' },
          ...dateFilter
        }
      },
      {
        $group: {
          _id: groupFormat,
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    res.status(500).json({ message: '차트 데이터 조회 실패', error });
  }
};

