const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
  businessUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // 예: "2024-11"
  totalRevenue: { type: Number, required: true }, // 총 매출
  platformFee: { type: Number, required: true },  // 수수료
  tax: { type: Number, required: true },          // 세금
  finalAmount: { type: Number, required: true },  // 실 지급액
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  paymentDate: { type: Date } // 지급 예정일/완료일
}, {
  timestamps: true
});

// businessUser와 month로 인덱스 생성
settlementSchema.index({ businessUser: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Settlement', settlementSchema);

