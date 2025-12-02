const User = require('../auth/User');

// 공통: 필터 빌더
const buildUserFilter = ({ role, status, search }) => {
  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (status) {
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
  }

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [
      { email: regex },
      { name: regex },
      { businessNumber: regex },
      { phone: regex },
    ];
  }

  return filter;
};

// GET /admin/users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;

    const filter = buildUserFilter({ role, status, search });

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        items,
        total,
        page: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('getUsers error:', error);
    res.status(500).json({
      success: false,
      message: '사용자 목록 조회 실패',
      error: error.message,
    });
  }
};

// GET /admin/users/:id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('getUserById error:', error);
    res.status(500).json({
      success: false,
      message: '사용자 상세 조회 실패',
      error: error.message,
    });
  }
};

// PUT /admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // 민감한 필드 보호 옵션 (원하면 제한 가능)
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    Object.assign(user, updateData);
    await user.save();

    const sanitized = user.toObject();
    delete sanitized.password;

    res.json({
      success: true,
      message: '사용자 정보가 수정되었습니다.',
      data: sanitized,
    });
  } catch (error) {
    console.error('updateUser error:', error);
    res.status(500).json({
      success: false,
      message: '사용자 정보 수정 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// DELETE /admin/users/:id
// 실제 삭제 대신 isActive=false 로 비활성화 처리
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: '사용자가 비활성화(삭제)되었습니다.',
    });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({
      success: false,
      message: '사용자 삭제 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// PUT /admin/users/:id/status
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active' | 'inactive'

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'status 는 active 또는 inactive 여야 합니다.',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    user.isActive = status === 'active';
    await user.save();

    const sanitized = user.toObject();
    delete sanitized.password;

    res.json({
      success: true,
      message: '사용자 상태가 변경되었습니다.',
      data: sanitized,
    });
  } catch (error) {
    console.error('updateUserStatus error:', error);
    res.status(500).json({
      success: false,
      message: '사용자 상태 변경 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// GET /admin/users/business
exports.getBusinessUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const filter = buildUserFilter({
      role: 'business',
      status,
      search,
    });

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        items,
        total,
        page: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('getBusinessUsers error:', error);
    res.status(500).json({
      success: false,
      message: '사업자 목록 조회 실패',
      error: error.message,
    });
  }
};


