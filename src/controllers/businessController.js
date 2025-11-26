const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id; // JWT에서 추출한 사업자 ID

    // 1. 내 호텔 ID 목록 조회
    const myHotels = await Hotel.find({ owner: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);

    // 2. 예약 데이터 집계 (매출, 예약 건수)
    const stats = await Booking.aggregate([
      { $match: { hotel: { $in: hotelIds }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalBookings: { $count: {} }
        }
      }
    ]);

    // 3. 이번 달 데이터 별도 집계 (날짜 필터링)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    
    // ... (월간 데이터 집계 로직 추가)

    res.json({
      totalRevenue: stats[0]?.totalRevenue || 0,
      bookingCount: stats[0]?.totalBookings || 0,
      // ... 기타 mockData 구조에 맞는 데이터 반환
    });
  } catch (error) {
    res.status(500).json({ message: '통계 조회 실패', error });
  }
};