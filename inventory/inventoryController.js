const Inventory = require('./Inventory');
const Room = require('../rooms/Room');
const Hotel = require('../hotels/Hotel');

exports.getInventory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { startDate, endDate } = req.query;
    const userId = req.user._id;
    
    // 객실 소유권 확인
    const room = await Room.findById(roomId).populate('hotelId');
    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }
    
    const hotel = await Hotel.findOne({ _id: room.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    const query = { room: roomId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const inventories = await Inventory.find(query).sort({ date: 1 });
    res.json({ success: true, data: inventories });
  } catch (error) {
    res.status(500).json({ message: '재고 조회 실패', error });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { date, totalRooms, availableRooms, priceOverride, status } = req.body;
    const userId = req.user._id;
    
    // 객실 소유권 확인
    const room = await Room.findById(roomId).populate('hotelId');
    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }
    
    const hotel = await Hotel.findOne({ _id: room.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    // 재고 정보를 찾아서 업데이트하거나 새로 생성
    const updateData = {
      totalRooms,
      availableCount: availableRooms,
      status: status || (availableRooms > 0 ? 'available' : 'soldout')
    };
    
    if (priceOverride !== undefined) {
      updateData.priceOverride = priceOverride;
    }
    
    const inventory = await Inventory.findOneAndUpdate(
      { room: roomId, date: new Date(date) },
      updateData,
      { new: true, upsert: true }
    );
    
    res.json({ message: '재고 업데이트 성공', inventory });
  } catch (error) {
    res.status(500).json({ message: '재고 업데이트 실패', error });
  }
};

exports.setPricePolicy = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { startDate, endDate, priceOverride } = req.body;
    const userId = req.user._id;
    
    // 객실 소유권 확인
    const room = await Room.findById(roomId).populate('hotelId');
    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }
    
    const hotel = await Hotel.findOne({ _id: room.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    // 기간 내 모든 날짜에 가격 정책 적용
    const start = new Date(startDate);
    const end = new Date(endDate);
    const operations = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      operations.push({
        updateOne: {
          filter: { room: roomId, date: new Date(d) },
          update: { $set: { priceOverride } },
          upsert: true
        }
      });
    }
    
    await Inventory.bulkWrite(operations);
    
    res.json({ message: '가격 정책 설정 성공' });
  } catch (error) {
    res.status(500).json({ message: '가격 정책 설정 실패', error });
  }
};

