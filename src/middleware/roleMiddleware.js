// 역할 기반 접근 제어 미들웨어
const checkRole = (...allowedRoles) => {
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

// 사업자 전용 미들웨어
const isBusiness = checkRole('business');

// 관리자 전용 미들웨어
const isAdmin = checkRole('admin');

module.exports = {
  checkRole,
  isBusiness,
  isAdmin
};

