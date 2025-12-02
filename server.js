const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 기능별 라우트 임포트
const dashboardRoutes = require('./dashboard/dashboardRoutes');
const hotelRoutes = require('./hotels/hotelRoutes');
const adminHotelRoutes = require('./hotels/adminHotelRoutes');
const roomRoutes = require('./rooms/roomRoutes');
const inventoryRoutes = require('./inventory/inventoryRoutes');
const bookingRoutes = require('./bookings/bookingRoutes');
const adminBookingRoutes = require('./bookings/adminBookingRoutes');
const settlementRoutes = require('./settlements/settlementRoutes');
const adminAuthRoutes = require('./auth/authRoutes');
const adminReviewRoutes = require('./reviews/reviewRoutes');
const adminStatsRoutes = require('./adminStats/adminStatsRoutes');
const adminUserRoutes = require('./users/userAdminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-back', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB 연결 성공');
  })
  .catch((error) => {
    console.error('MongoDB 연결 실패:', error);
    process.exit(1);
  });

// 기능별 라우트 등록
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/hotels', adminHotelRoutes);
app.use('/api/admin/bookings', adminBookingRoutes);
app.use('/api/admin/reviews', adminReviewRoutes);
app.use('/api/admin/stats', adminStatsRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/business/dashboard', dashboardRoutes);
app.use('/api/business/hotels', hotelRoutes);
app.use('/api/business/rooms', roomRoutes);
app.use('/api/business', inventoryRoutes); // /api/business/rooms/:roomId/inventory, /api/business/rooms/:roomId/pricing
app.use('/api/business/reservations', bookingRoutes);
app.use('/api/business/settlements', settlementRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Business Backend API',
    version: '1.0.0'
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 리소스를 찾을 수 없습니다.'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('에러:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '서버 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = app;
