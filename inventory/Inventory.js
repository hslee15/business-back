const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  date: { type: Date, required: true }, // 날짜 (시간 제외)
  totalRooms: { type: Number, required: true }, // 총 객실 수 (변경 가능성 고려)
  reservedCount: { type: Number, default: 0 },  // 예약된 수
  availableCount: { type: Number, required: true }, // 판매 가능 수 (수동 조절 가능)
  priceOverride: { type: Number }, // 해당 날짜 특별가 (기본가 덮어쓰기)
  status: { 
    type: String, 
    enum: ['available', 'soldout', 'blocked'], 
    default: 'available' 
  }
});

// 쿼리 성능을 위해 room과 date에 복합 인덱스 설정
inventorySchema.index({ room: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);

