# Money Manager - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd money-manager-backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd money-manager-frontend
npm install
```

### Step 2: Setup MongoDB

**Option A: Use MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `money-manager-backend/.env`:
   ```
   MONGODB_URI=your-connection-string-here
   ```

**Option B: Use Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Keep default in `.env`: `MONGODB_URI=mongodb://localhost:27017/money-manager`

### Step 3: Start the Applications

**Terminal 1 - Backend:**
```bash
cd money-manager-backend
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd money-manager-frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

### Step 4: Open the App

Open your browser and go to: **http://localhost:5173**

### Step 5: Create an Account

1. Click "Sign up"
2. Enter your details
3. Click "Create Account"
4. You're in! 🎉

## 🎯 First Steps in the App

1. **Add Your First Transaction**
   - Click the "+ Add Transaction" button
   - Choose Income or Expense tab
   - Fill in the details
   - Click "Add"

2. **Explore the Dashboard**
   - View your stats cards
   - Check out the charts
   - Try different period filters (Daily/Weekly/Monthly/Yearly)

3. **Try Filtering**
   - Go to Transactions page
   - Click "Filters"
   - Try filtering by category, division, or date

4. **Test Edit Feature**
   - Hover over a transaction
   - Click the edit icon
   - Make changes
   - Save

## 🔧 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists
- Check MongoDB connection string

### Frontend won't start
- Clear node_modules: `rm -rf node_modules && npm install`
- Check if port 5173 is available

### Can't connect to API
- Make sure backend is running on port 5000
- Check `.env` in frontend has correct API URL
- Check browser console for errors

## 📚 What to Explore

### Dashboard
- Period selector at the top right
- Beautiful gradient cards
- Interactive charts
- Recent transactions

### Transactions
- Add/Edit/Delete transactions
- Advanced filtering
- Search functionality
- 12-hour edit window

### Categories
- Default categories are created automatically
- Each category has an icon and color
- Filter transactions by category

## 🎨 Design Features to Notice

1. **Smooth Animations**
   - Page transitions
   - Modal animations
   - Hover effects

2. **Responsive Design**
   - Try resizing your browser
   - Works on mobile, tablet, desktop

3. **Visual Feedback**
   - Loading spinners
   - Success/error messages
   - Time remaining indicators

4. **Modern UI**
   - Glassmorphism effects
   - Gradient backgrounds
   - Soft shadows

## 📱 Mobile Testing

1. Open browser DevTools (F12)
2. Click device toolbar icon
3. Select a mobile device
4. Test the responsive design

## 🚀 Ready to Deploy?

See `DEPLOYMENT_GUIDE.md` for complete deployment instructions.

## 💡 Tips

1. **Sample Data**: Add a few transactions to see charts populate
2. **Categories**: Try creating custom categories
3. **Filters**: Combine multiple filters for powerful searches
4. **Divisions**: Use Office/Personal to separate expenses
5. **Accounts**: Track different bank accounts or wallets

## 🎓 Learning Points

This project demonstrates:
- Full-stack development (MERN stack)
- RESTful API design
- JWT authentication
- React Context API
- TailwindCSS styling
- Responsive design
- Data visualization
- Form validation
- Error handling

## 📞 Need Help?

1. Check `README.md` files in each folder
2. Review `DEPLOYMENT_GUIDE.md`
3. Check `PROJECT_SUMMARY.md`
4. Look at code comments

---

**Happy Money Managing! 💰**
