const jwt = require('jsonwebtoken');
const User = require('./User');

// JWT 토큰 생성 헬퍼
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// 응답용 사용자 데이터 정제
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

// POST /admin/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email과 password가 필요합니다.',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: '비활성화된 계정입니다.',
      });
    }

    // 사업자/관리자 역할만 허용 (현재는 business 중심)
    if (!['business', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: '접근 권한이 없는 계정입니다.',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({
      success: false,
      message: '로그인 처리 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// POST /admin/auth/logout
// 서버 측 상태를 두지 않으므로 단순 200 응답
exports.logout = async (req, res) => {
  return res.json({
    success: true,
    message: '로그아웃되었습니다.',
  });
};

// GET /admin/auth/me
exports.getMyInfo = async (req, res) => {
  try {
    // verifyToken 에서 req.user 설정
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.',
      });
    }

    return res.json({
      success: true,
      data: sanitizeUser(req.user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '내 정보 조회 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// PUT /admin/auth/password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.',
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'currentPassword와 newPassword가 필요합니다.',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: '현재 비밀번호가 올바르지 않습니다.',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: '비밀번호가 변경되었습니다.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '비밀번호 변경 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// POST /admin/auth/forgot-password
// 실제 이메일 발송 대신 성공 응답만 반환 (프런트 mock과 맞춤)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'email이 필요합니다.',
      });
    }

    // TODO: 실제 서비스에서는 비밀번호 재설정 토큰 발급 및 이메일 발송 구현

    return res.json({
      success: true,
      message: '비밀번호 재설정 요청이 접수되었습니다.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '비밀번호 재설정 요청 처리 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};


