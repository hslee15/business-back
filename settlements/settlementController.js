const Settlement = require('./Settlement');

exports.getSettlements = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, status } = req.query;
    
    const query = { businessUser: userId };
    if (month) query.month = month;
    if (status) query.status = status;
    
    const settlements = await Settlement.find(query)
      .sort({ month: -1 });
    
    const totalAmount = settlements.reduce((sum, s) => sum + s.finalAmount, 0);
    
    res.json({
      success: true,
      data: {
        settlements,
        totalAmount
      }
    });
  } catch (error) {
    res.status(500).json({ message: '정산 내역 조회 실패', error });
  }
};

