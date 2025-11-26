exports.createHotel = async (req, res) => {
  try {
    const newHotel = new Hotel({
      ...req.body,
      owner: req.user.id, // JWT에서 추출한 사업자 ID 자동 할당
      isApproved: false   // 관리자 승인 대기 상태로 생성
    });
    
    await newHotel.save();
    res.status(201).json({ message: '호텔 등록 성공', hotel: newHotel });
  } catch (error) {
    res.status(500).json({ message: '호텔 등록 실패', error });
  }
};