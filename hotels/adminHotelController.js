const Hotel = require('./Hotel');

// 관리자: 호텔 목록 조회
// GET /admin/hotels
exports.getHotels = async (req, res) => {
  try {
    const { status, city } = req.query;

    const filter = {};

    if (city) {
      filter.city = city;
    }

    // status 쿼리로 승인 상태 필터링 (pending/approved/rejected 같은 형태를 가정)
    if (status === 'pending') {
      filter.isApproved = false;
      filter.isActive = true;
    } else if (status === 'approved') {
      filter.isApproved = true;
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const hotels = await Hotel.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: '호텔 목록 조회 실패', error });
  }
};

// 관리자: 호텔 상세 조회
// GET /admin/hotels/:id
exports.getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: '호텔을 찾을 수 없습니다.' });
    }

    res.json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: '호텔 조회 실패', error });
  }
};

// 관리자: 호텔 등록
// POST /admin/hotels
exports.createHotel = async (req, res) => {
  try {
    const hotel = new Hotel({
      ...req.body,
      // 관리자가 직접 등록할 때는 ownerId를 body에서 받는다고 가정
    });

    await hotel.save();

    res.status(201).json({ success: true, message: '호텔 등록 성공', data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: '호텔 등록 실패', error });
  }
};

// 관리자: 호텔 수정
// PUT /admin/hotels/:id
exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: '호텔을 찾을 수 없습니다.' });
    }

    Object.assign(hotel, req.body);
    await hotel.save();

    res.json({ success: true, message: '호텔 수정 성공', data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: '호텔 수정 실패', error });
  }
};

// 관리자: 호텔 삭제 (비활성화)
// DELETE /admin/hotels/:id
exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: '호텔을 찾을 수 없습니다.' });
    }

    hotel.isActive = false;
    await hotel.save();

    res.json({ success: true, message: '호텔 삭제(비활성화) 성공' });
  } catch (error) {
    res.status(500).json({ success: false, message: '호텔 삭제 중 오류가 발생했습니다.', error });
  }
};

// 관리자: 호텔 승인
// POST /admin/hotels/:id/approve
exports.approveHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: '호텔을 찾을 수 없습니다.' });
    }

    hotel.isApproved = true;
    hotel.isActive = true;

    await hotel.save();

    res.json({ success: true, message: '호텔 승인 성공', data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: '호텔 승인 중 오류가 발생했습니다.', error });
  }
};

// 관리자: 호텔 승인 거부
// POST /admin/hotels/:id/reject
exports.rejectHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: '호텔을 찾을 수 없습니다.' });
    }

    hotel.isApproved = false;
    hotel.isActive = false;
    if (reason) {
      hotel.rejectReason = reason;
    }

    await hotel.save();

    res.json({ success: true, message: '호텔 승인 거부 처리 완료', data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: '호텔 승인 거부 중 오류가 발생했습니다.', error });
  }
};


