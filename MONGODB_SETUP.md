# MongoDB Atlas Setup Guide (5 Minutes)

## Step-by-Step Instructions

### 1. Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with Google/GitHub or email
4. Verify your email

### 2. Create Cluster
1. After login, click "Build a Database"
2. Choose **M0 FREE** tier
3. Select cloud provider: **AWS** (recommended)
4. Select region: Choose closest to you
5. Cluster Name: Leave default or name it `money-manager`
6. Click "Create Cluster" (takes 1-3 minutes)

### 3. Create Database User
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `moneymanager` (or your choice)
5. Password: Click "Autogenerate Secure Password" and **COPY IT**
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### 4. Allow Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### 5. Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string

It will look like:
```
mongodb+srv://moneymanager:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Update Backend .env File

1. Open `money-manager-backend/.env`
2. Replace `<password>` with your actual password
3. Add database name after `.net/`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://moneymanager:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/money-manager?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

**Example:**
```env
MONGODB_URI=mongodb+srv://moneymanager:MyP@ssw0rd123@cluster0.abc123.mongodb.net/money-manager?retryWrites=true&w=majority
```

### 7. Test Connection

```bash
cd money-manager-backend
npm run dev
```

**Success looks like:**
```
✅ Connected to MongoDB
🚀 Server is running on port 5000
```

**If you see an error:**
- Check password is correct (no < > symbols)
- Check network access is allowed
- Check connection string format

## Quick Reference

### Connection String Format
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

### Replace:
- `USERNAME` - Your database user (e.g., moneymanager)
- `PASSWORD` - Your database password
- `CLUSTER` - Your cluster address (from Atlas)
- `DATABASE_NAME` - money-manager

## Alternative: Local MongoDB

If you prefer local development:

### Windows
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Edition
3. Start MongoDB service
4. Use in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/money-manager
   ```

### Mac (with Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu)
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## Troubleshooting

### "Authentication failed"
- Check password in connection string
- Make sure no special characters are URL-encoded

### "Network timeout"
- Check "Network Access" allows your IP
- Try "Allow Access from Anywhere" for testing

### "Database not found"
- MongoDB will create it automatically on first connection
- Just make sure database name is in connection string

## You're Done! 🎉

Your MongoDB is ready. Now run:

```bash
# Terminal 1 - Backend
cd money-manager-backend
npm run dev

# Terminal 2 - Frontend  
cd money-manager-frontend
npm run dev
```

Open http://localhost:5173/ and start using the app!

---

**Need Help?**
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Connection String Guide: https://docs.mongodb.com/manual/reference/connection-string/
