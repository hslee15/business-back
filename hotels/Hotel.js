const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
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
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// ownerId로 인덱스 생성
hotelSchema.index({ ownerId: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);

