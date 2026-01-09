# Payment System - Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Cloud Console account (for OAuth)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Fill in the OAuth configuration:
   - **Authorised JavaScript origins**: 
     - Add: `http://localhost:3000`
   - **Authorised redirect URIs**: 
     - Add: `http://localhost:5000/api/auth/google/callback`
7. Click "Create" and copy the Client ID and Client Secret to your backend `.env` file

## Features

- ✅ User registration and login
- ✅ Google OAuth authentication
- ✅ Money transfers between users
- ✅ Add money to wallet
- ✅ QR code generation and scanning for payments
- ✅ Transaction history
- ✅ User profile management

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions/deposit` - Add money
- `POST /api/transactions/transfer` - Transfer money

### QR Code
- `POST /api/qrcode/generate` - Generate QR code
- `GET /api/qrcode/:qrId` - Get QR code details
- `POST /api/qrcode/pay/:qrId` - Process QR payment

## Notes

- All API calls use `http://localhost:5000` for local development
- Make sure MongoDB is running before starting the backend
- The frontend proxy is configured to forward requests to the backend
