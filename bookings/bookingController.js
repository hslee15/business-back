const Booking = require('./Booking');
const Hotel = require('../hotels/Hotel');

exports.getMyReservations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 내 호텔 ID 목록 조회
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);
    
    const bookings = await Booking.find({ hotelId: { $in: hotelIds } })
      .populate('hotelId', 'name')
      .populate('roomId', 'name type')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: '예약 목록 조회 실패', error });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const booking = await Booking.findById(id)
      .populate('hotelId')
      .populate('roomId');
    
    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }
    
    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: booking.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: '예약 조회 실패', error });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const userId = req.user._id;
    
    const booking = await Booking.findById(id).populate('hotelId');
    
    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }
    
    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: booking.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    
    await booking.save();
    
    res.json({ message: '예약 상태 업데이트 성공', booking });
  } catch (error) {
    res.status(500).json({ message: '예약 상태 업데이트 실패', error });
  }
};

// POST /admin/bookings/:id/cancel
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const booking = await Booking.findById(id).populate('hotelId');

    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: booking.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }

    booking.status = 'cancelled';
    if (reason) {
      booking.cancelReason = reason;
    }

    await booking.save();

    res.json({ message: '예약이 취소되었습니다.', booking });
  } catch (error) {
    res.status(500).json({ message: '예약 취소 중 오류가 발생했습니다.', error });
  }
};

// DELETE /admin/bookings/:id
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(id).populate('hotelId');

    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: booking.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }

    await Booking.deleteOne({ _id: id });

    res.json({ message: '예약이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '예약 삭제 중 오류가 발생했습니다.', error });
  }
};


