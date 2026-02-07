# 💰 Money Manager - Full Stack Application

A comprehensive web application for managing personal and business finances with beautiful UI, real-time analytics, and powerful features.

![Money Manager](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38bdf8)

## 🌟 Features

### Core Functionality
- ✅ **Income & Expense Tracking** - Record all financial transactions with detailed information
- ✅ **Dashboard Analytics** - Beautiful charts showing trends and insights
- ✅ **Period-based Views** - Daily, Weekly, Monthly, and Yearly summaries
- ✅ **Advanced Filtering** - Filter by type, category, division, and date range
- ✅ **12-Hour Edit Window** - Edit or delete transactions within 12 hours of creation
- ✅ **Category Management** - Custom categories with icons and colors
- ✅ **Division Tracking** - Separate Office and Personal expenses
- ✅ **Multi-Account Support** - Track transactions across different accounts
- ✅ **Search Functionality** - Quick search through transaction descriptions
- ✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop

### Technical Features
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 📊 **Interactive Charts** - Powered by Recharts for beautiful visualizations
- 🎨 **Modern UI/UX** - Glassmorphism, gradients, and smooth animations
- ⚡ **Fast Performance** - Optimized with Vite and efficient API calls
- 🔄 **Real-time Updates** - Instant reflection of changes across the app
- 📱 **PWA Ready** - Can be installed as a progressive web app
- 🌐 **RESTful API** - Well-structured backend API
- 🗄️ **MongoDB Atlas** - Cloud database with automatic backups

## 🏗️ Project Structure

```
money-manager/
├── money-manager-frontend/     # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── context/            # React Context
│   │   ├── services/           # API services
│   │   ├── utils/              # Utility functions
│   │   └── index.css           # TailwindCSS styles
│   ├── public/                 # Static assets
│   └── package.json
│
├── money-manager-backend/      # Node.js + Express backend
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── server.js               # Entry point
│   └── package.json
│
└── DEPLOYMENT_GUIDE.md         # Deployment instructions
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd money-manager-backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd money-manager-frontend
npm install
cp .env.example .env
# Edit .env with your backend API URL
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📸 Screenshots

### Dashboard
- Beautiful gradient cards showing Income, Expense, and Balance
- Interactive line chart for trends
- Pie chart for category breakdown
- Recent transactions list

### Transactions
- Comprehensive transaction list with filters
- Add/Edit modal with tabs for Income/Expense
- Real-time search and filtering
- Edit/Delete with 12-hour restriction indicator

### Authentication
- Modern login/register pages
- Form validation
- Secure JWT-based authentication

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Express Validator
- **Security**: Bcrypt for password hashing
- **CORS**: Enabled for cross-origin requests

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary/by-category` - Category summary

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Dashboard
- `GET /api/dashboard/overview` - Dashboard overview
- `GET /api/dashboard/trends` - Trends data
- `GET /api/dashboard/recent` - Recent transactions
- `GET /api/dashboard/accounts` - Account summary
- `GET /api/dashboard/statistics` - Detailed statistics

## 🎯 Key Features Explained

### 12-Hour Edit Restriction
Transactions can only be edited or deleted within 12 hours of creation. This is implemented both on the backend (validation) and frontend (UI indicators showing time remaining).

### Division Tracking
Every transaction is categorized as either "Office" or "Personal", allowing users to separate business and personal expenses for better financial management and tax purposes.

### Period-based Analytics
The dashboard supports four different time periods:
- **Daily**: Today's transactions
- **Weekly**: Current week (Monday to Sunday)
- **Monthly**: Current month
- **Yearly**: Current year

### Category System
Users get default categories on registration (Salary, Food, Fuel, etc.) and can create custom categories with:
- Custom names
- Emoji icons
- Color coding
- Type specification (Income/Expense/Both)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- MongoDB injection prevention

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Laptops (1024px and up)
- 🖥️ Desktops (1280px and up)

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Success**: Green (#22c55e) - for income
- **Danger**: Red (#ef4444) - for expenses
- **Warning**: Amber (#f59e0b)

### Typography
- Font Family: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800

### Components
- Rounded corners (xl/2xl)
- Soft shadows
- Glassmorphism effects
- Smooth transitions
- Hover effects
- Loading states

## 📦 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy Links
- **Frontend**: Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend**: Deploy to [Render](https://render.com) or [Railway](https://railway.app)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Add income transaction
- [ ] Add expense transaction
- [ ] Edit transaction within 12 hours
- [ ] Try to edit transaction after 12 hours (should fail)
- [ ] Delete transaction
- [ ] Filter transactions by type
- [ ] Filter by category
- [ ] Filter by division
- [ ] Filter by date range
- [ ] Search transactions
- [ ] View dashboard with different periods
- [ ] Check responsive design on mobile
- [ ] Logout and login again

## 📄 License

ISC

## 👨‍💻 Author

Created as part of the GUVI Full Stack Development Program

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please create an issue in the GitHub repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- Recharts for beautiful charts
- MongoDB for the database
- All open-source contributors

---

**Made with ❤️ for better financial management**
