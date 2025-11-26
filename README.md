# business-back

호텔 사업자용 백엔드 API 서버

## 프로젝트 구조

```
├── src/
│   ├── controllers/
│   │   ├── businessController.js  # 사업자 전용 로직 (대시보드, 정산 등)
│   │   ├── hotelController.js     # 호텔 CRUD (사업자용)
│   │   └── roomController.js       # 객실/재고 CRUD (사업자용)
│   ├── models/
│   │   ├── User.js                 # 사업자 정보 포함 (businessNumber 등)
│   │   ├── Hotel.js                # ownerId 필드 필수
│   │   ├── Room.js
│   │   ├── Inventory.js            # 날짜별 재고/가격 (핵심)
│   │   ├── Booking.js
│   │   └── Settlement.js           # 정산 내역 모델
│   ├── routes/
│   │   └── businessRoutes.js       # /api/business/* 라우트 정의
│   ├── middleware/
│   │   ├── authMiddleware.js       # 토큰 검증
│   │   └── roleMiddleware.js       # role === 'business' 체크
└── server.js
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/business-back
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
```

### 3. 서버 실행

```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

## API 엔드포인트

모든 API는 `/api/business`로 시작하며, 인증 토큰이 필요합니다.

### 대시보드
- `GET /api/business/dashboard` - 대시보드 데이터 조회

### 정산
- `GET /api/business/settlements` - 정산 내역 목록 조회
- `GET /api/business/settlements/:id` - 정산 상세 조회

### 호텔 관리
- `GET /api/business/hotels` - 호텔 목록 조회
- `GET /api/business/hotels/:id` - 호텔 상세 조회
- `POST /api/business/hotels` - 호텔 생성
- `PUT /api/business/hotels/:id` - 호텔 수정
- `DELETE /api/business/hotels/:id` - 호텔 삭제

### 객실 관리
- `GET /api/business/rooms` - 객실 목록 조회
- `GET /api/business/rooms/:id` - 객실 상세 조회
- `POST /api/business/rooms` - 객실 생성
- `PUT /api/business/rooms/:id` - 객실 수정
- `DELETE /api/business/rooms/:id` - 객실 삭제

### 재고 관리
- `GET /api/business/inventories` - 재고 목록 조회 (roomId, startDate, endDate 쿼리 파라미터)
- `POST /api/business/inventories` - 재고 일괄 업데이트

## 주요 기능

- JWT 기반 인증
- 사업자 역할 기반 접근 제어
- 호텔 및 객실 관리
- 날짜별 재고 및 가격 관리
- 정산 내역 관리
- 대시보드 통계

## 기술 스택

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs