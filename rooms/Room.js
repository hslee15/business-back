const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// hotelId로 인덱스 생성
roomSchema.index({ hotelId: 1 });

module.exports = mongoose.model('Room', roomSchema);

