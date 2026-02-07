# Money Manager Backend

A comprehensive RESTful API for managing personal finances built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT-based authentication
- 💰 Income and expense tracking
- 📊 Dashboard with analytics
- 📁 Custom categories with icons
- 🏢 Office/Personal division tracking
- ⏰ 12-hour edit restriction
- 📈 Trends and statistics
- 🔍 Advanced filtering and search
- 💳 Multi-account support

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update MongoDB URI and JWT secret

3. Start the server:

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Transactions
- `GET /api/transactions` - Get all transactions with filters
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction (within 12 hours)
- `DELETE /api/transactions/:id` - Delete transaction (within 12 hours)
- `GET /api/transactions/summary/by-category` - Get category summary

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/trends` - Get trends data
- `GET /api/dashboard/recent` - Get recent transactions
- `GET /api/dashboard/accounts` - Get account summary
- `GET /api/dashboard/statistics` - Get detailed statistics

## Query Parameters

### Transactions
- `type`: income | expense
- `category`: Category name
- `division`: office | personal
- `startDate`: ISO date string
- `endDate`: ISO date string
- `account`: Account name
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

### Dashboard
- `period`: daily | weekly | monthly | yearly

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/money-manager
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Default Categories

When a user registers, the following default categories are created:

**Income:**
- Salary 💰
- Freelance 💼
- Investment 📈

**Expense:**
- Food 🍔
- Fuel ⛽
- Movie 🎬
- Medical 🏥
- Loan 🏦
- Shopping 🛍️
- Transport 🚗
- Bills 📄
- Entertainment 🎮

## Business Rules

1. **12-Hour Edit Restriction**: Transactions can only be edited or deleted within 12 hours of creation
2. **Authentication Required**: All transaction and category endpoints require JWT authentication
3. **User Isolation**: Users can only access their own data
4. **Default Categories**: Cannot be deleted but can be modified

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use MongoDB Atlas for database
3. Set strong JWT secret
4. Enable HTTPS
5. Configure CORS for your frontend domain

## License

ISC
