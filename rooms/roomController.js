const Room = require('./Room');
const Hotel = require('../hotels/Hotel');

exports.getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user._id;
    
    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: hotelId, ownerId: userId });
    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }
    
    const rooms = await Room.find({ hotelId }).sort({ createdAt: -1 });
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ message: '객실 목록 조회 실패', error });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;
    
    const room = await Room.findById(roomId).populate('hotelId');
    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }
    
    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: room.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ message: '객실 조회 실패', error });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user._id;
    
    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: hotelId, ownerId: userId });
    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }
    
    const newRoom = new Room({
      ...req.body,
      hotelId
    });
    
    await newRoom.save();
    res.status(201).json({ message: '객실 생성 성공', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: '객실 생성 실패', error });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;
    
    const room = await Room.findById(roomId).populate('hotelId');
    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }
    
    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: room.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    Object.assign(room, req.body);
    await room.save();
    
    res.json({ message: '객실 수정 성공', room });
  } catch (error) {
    res.status(500).json({ message: '객실 수정 실패', error });
  }
};

