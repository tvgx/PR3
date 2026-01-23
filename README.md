# PR3 E-Commerce Platform

Hệ thống thương mại điện tử toàn diện với tích hợp thanh toán PayOS, admin dashboard, và quản lý sản phẩm.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16.0 (React 19.2)
- **Styling**: TailwindCSS v4
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js + Express 5.2
- **Database**: MongoDB + Mongoose
- **Authentication**: Passport.js + JWT
- **Payment**: PayOS Integration
- **Security**: Helmet + CORS

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local hoặc MongoDB Atlas)
- npm hoặc yarn

### Setup Instructions

1. **Clone repository**
```bash
git clone <repository-url>
cd PR3
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Backend (`.env` trong folder `backend/`):
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/e-commerce
JWT_SECRET=your-secret-key
PAYOS_CLIENT_ID=your-client-id
PAYOS_API_KEY=your-api-key
PAYOS_CHECKSUM_KEY=your-checksum-key
```

Frontend (`.env.local` trong folder `frontend/`):
```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8000/api
JWT_SECRET=same-as-backend
```

4. **Run development servers**

Backend:
```bash
npm run dev:backend
```

Frontend (in new terminal):
```bash
npm run dev:frontend
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:system
```

## 🚀 Deployment

### Quick Deploy Guide

Xem hướng dẫn chi tiết tại: `.gemini/antigravity/brain/<conversation-id>/quick_deploy_guide.md`

### Required Platforms
- **Database**: MongoDB Atlas
- **Backend**: Render
- **Frontend**: Vercel
- **CI/CD**: GitHub Actions

### Pre-Deployment Checklist
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables configured on Render & Vercel
- [ ] GitHub secrets added for CI/CD
- [ ] CORS URLs updated
- [ ] PayOS credentials verified

### Environment Variables

**Backend (Render)**:
- `NODE_ENV=production`
- `MONGO_URI` (MongoDB Atlas connection)
- `JWT_SECRET`
- `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`
- `FRONTEND_URL` (Vercel URL)

**Frontend (Vercel)**:
- `NEXT_PUBLIC_API_GATEWAY_URL` (Render backend URL + `/api`)
- `JWT_SECRET`

**GitHub Secrets**:
- `RENDER_DEPLOY_HOOK_URL`
- `BACKEND_URL`
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_API_GATEWAY_URL`

## 📚 Documentation

- **Project Status**: Tất cả tính năng đã hoàn thành
- **Implementation Plan**: Chi tiết kế hoạch triển khai
- **Quick Deploy Guide**: Hướng dẫn deploy từng bước
- **Environment Variables**: Tham chiếu biến môi trường

## ✨ Features

### For Users
- ✅ Đăng ký & đăng nhập
- ✅ Browse sản phẩm với filter & search
- ✅ Shopping cart & wishlist
- ✅ Checkout với PayOS payment
- ✅ Order tracking
- ✅ User profile & order history

### For Admins
- ✅ Dashboard với statistics
- ✅ Quản lý products, categories, events
- ✅ Order management
- ✅ Upload images

## 🔒 Security

- Helmet.js for HTTP headers
- CORS configured cho production
- JWT authentication
- Bcrypt password hashing
- Input validation với Joi & express-validator

## 📞 Support

Nếu gặp vấn đề:
1. Check `.env` files
2. Verify MongoDB connection
3. Review deployment logs (Render/Vercel)
4. Check GitHub Actions workflow status

## 📄 License

See LICENSE file for details.
