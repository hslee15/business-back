const jwt = require('jsonwebtoken');
const User = require('./User');

// JWT 토큰 검증 미들웨어
const verifyToken = async (req, res, next) => {
  try {
    // 헤더에서 토큰 추출
    const token = req.headers.authorization?.split(' ')[1]; // Bearer 토큰 형식

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '인증 토큰이 필요합니다.'
      });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 사용자 정보 조회
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: '비활성화된 계정입니다.'
      });
    }

    // req.user에 사용자 정보 저장
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '토큰이 만료되었습니다.'
      });
    }
    return res.status(500).json({
      success: false,
      message: '인증 처리 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 역할 기반 접근 제어 미들웨어
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '접근 권한이 없습니다.'
      });
    }

    next();
  };
};

// 하위 호환성을 위한 별칭
const authenticate = verifyToken;
const checkRole = authorize;

module.exports = {
  verifyToken,
  authorize,
  authenticate, // 하위 호환성
  checkRole // 하위 호환성
};

