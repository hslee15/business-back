const Hotel = require('./Hotel');

exports.getMyHotels = async (req, res) => {
  try {
    const userId = req.user._id;
    const hotels = await Hotel.find({ ownerId: userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: hotels });
  } catch (error) {
    res.status(500).json({ message: '호텔 목록 조회 실패', error });
  }
};

exports.getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const hotel = await Hotel.findOne({ _id: id, ownerId: userId });
    
    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ message: '호텔 조회 실패', error });
  }
};

exports.createHotel = async (req, res) => {
  try {
    const newHotel = new Hotel({
      ...req.body,
      ownerId: req.user._id,
      isApproved: false
    });
    
    await newHotel.save();
    res.status(201).json({ message: '호텔 등록 성공', hotel: newHotel });
  } catch (error) {
    res.status(500).json({ message: '호텔 등록 실패', error });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const hotel = await Hotel.findOne({ _id: id, ownerId: userId });
    
    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }
    
    Object.assign(hotel, req.body);
    await hotel.save();
    
    res.json({ message: '호텔 수정 성공', hotel });
  } catch (error) {
    res.status(500).json({ message: '호텔 수정 실패', error });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const hotel = await Hotel.findOne({ _id: id, ownerId: userId });
    
    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }
    
    hotel.isActive = false;
    await hotel.save();
    
    res.json({ message: '호텔 삭제 성공' });
  } catch (error) {
    res.status(500).json({ message: '호텔 삭제 실패', error });
  }
};

