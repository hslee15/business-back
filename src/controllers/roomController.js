const Inventory = require('../models/Inventory');

exports.updateInventory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { date, totalRooms, availableRooms } = req.body;

    // 해당 날짜의 재고 정보를 찾아서 업데이트하거나 새로 생성
    const inventory = await Inventory.findOneAndUpdate(
      { room: roomId, date: new Date(date) },
      { 
        totalRooms, 
        availableCount: availableRooms,
        // 예약 가능 수가 0이면 자동으로 soldout 처리
        status: availableRooms > 0 ? 'available' : 'soldout'
      },
      { new: true, upsert: true } // upsert: true가 핵심
    );

    res.json({ message: '재고 업데이트 성공', inventory });
  } catch (error) {
    res.status(500).json({ message: '재고 업데이트 실패', error });
  }
};