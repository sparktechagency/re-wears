# Re-Wears Backend API

A robust backend API for Re-Wears e-commerce platform built with TypeScript and Express.js.

## 🚀 Features

- 🛍️ Product Management System
- 🔐 Authentication & Authorization
- 📱 Social Login (Facebook, Google)
- 📱 Real-time Socket.IO Integration
- 📄 File Upload & Management
- 📊 Category Management
- 📊 Wishlist Management
- 🔍 Advanced Search & Filtering
- 📅 Scheduled Tasks with Node-Cron
- 📧 Email Notifications

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT & Passport.js
- **Storage**: Firebase Admin
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Logging**: Winston
- **Email**: Nodemailer
- **Development Tools**: TypeScript, ts-node-dev

## 📋 Prerequisites

- Node.js (>= 16.x)
- npm or yarn
- MongoDB
- Firebase Admin SDK credentials
- Environment variables

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/bdCalling-Sdt-hub/re-wears.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Firebase Admin
FIREBASE_SERVICE_ACCOUNT=your_service_account_json

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
```

4. Build the project:
```bash
npm run build
# or
yarn build
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 📦 Project Structure

```
re-wears/
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── product/
│   │   │   ├── user/
│   │   │   ├── auth/
│   │   │   └── ... other modules
│   │   ├── middlewares/
│   │   ├── errors/
│   │   └── ... other directories
│   ├── config/
│   └── shared/
├── uploads/
├── winston/
└── ... other directories
```

## 🛠️ Development Setup

1. Run the development server:
```bash
npm run dev
```

2. Build for production:
```bash
npm run build
```

3. Start production server:
```bash
npm start
```

## 📝 API Documentation

The API documentation is available at `/api-docs` when the server is running.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors and users
- Special thanks to the open-source community

## 📞 Support

For support, please contact us at [support@re-wears.com](mailto:support@re-wears.com) or create an issue in the GitHub repository.