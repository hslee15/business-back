# business-back

호텔 사업자용 백엔드 API 서버

## 프로젝트 구조 (기능 기반 구조)

```
├── auth/                       # 인증 관련
│   ├── User.js                 # 사용자 모델
│   └── authMiddleware.js       # JWT 토큰 검증 및 권한 체크
├── hotels/                     # 호텔 관리
│   ├── Hotel.js                # 호텔 모델
│   ├── hotelController.js      # 호텔 CRUD 로직
│   └── hotelRoutes.js          # 호텔 라우트
├── rooms/                      # 객실 관리
│   ├── Room.js                 # 객실 모델
│   ├── roomController.js       # 객실 CRUD 로직
│   └── roomRoutes.js           # 객실 라우트
├── inventory/                  # 재고 관리
│   ├── Inventory.js            # 재고 모델 (날짜별 재고/가격)
│   ├── inventoryController.js  # 재고 관리 로직
│   └── inventoryRoutes.js      # 재고 라우트
├── bookings/                    # 예약 관리
│   ├── Booking.js              # 예약 모델
│   ├── bookingController.js    # 예약 관리 로직
│   └── bookingRoutes.js        # 예약 라우트
├── settlements/                # 정산 관리
│   ├── Settlement.js           # 정산 모델
│   ├── settlementController.js # 정산 로직
│   └── settlementRoutes.js    # 정산 라우트
├── dashboard/                  # 대시보드
│   ├── dashboardController.js  # 대시보드 통계 로직
│   └── dashboardRoutes.js       # 대시보드 라우트
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
- `GET /api/business/dashboard/stats` - 대시보드 통계 조회
- `GET /api/business/dashboard/chart` - 매출 차트 데이터 조회

### 호텔 관리
- `GET /api/business/hotels` - 내 호텔 목록 조회
- `GET /api/business/hotels/:id` - 호텔 상세 조회
- `POST /api/business/hotels` - 호텔 생성
- `PUT /api/business/hotels/:id` - 호텔 수정
- `DELETE /api/business/hotels/:id` - 호텔 삭제

### 객실 관리
- `GET /api/business/rooms/hotels/:hotelId` - 호텔별 객실 목록 조회
- `POST /api/business/rooms/hotels/:hotelId` - 객실 생성
- `GET /api/business/rooms/:roomId` - 객실 상세 조회
- `PUT /api/business/rooms/:roomId` - 객실 수정

### 재고 관리
- `GET /api/business/rooms/:roomId/inventory` - 재고 목록 조회 (startDate, endDate 쿼리 파라미터)
- `PUT /api/business/rooms/:roomId/inventory` - 날짜별 재고 수정
- `POST /api/business/rooms/:roomId/pricing` - 기간별 가격 정책 설정

### 예약 관리
- `GET /api/business/reservations` - 내 예약 목록 조회
- `GET /api/business/reservations/:id` - 예약 상세 조회
- `PUT /api/business/reservations/:id/status` - 예약 상태 업데이트

### 정산
- `GET /api/business/settlements` - 정산 내역 목록 조회 (month, status 쿼리 파라미터)

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
