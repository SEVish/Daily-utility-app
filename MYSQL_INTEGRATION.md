# MySQL Integration - Quick Start Guide

## ✅ What Was Installed

Your React app has been successfully connected to a MySQL database! Here's what we set up:

### Backend Components
- **Express.js** - Node.js web server
- **MySQL2** - MySQL driver for Node.js
- **CORS** - Cross-origin request handling
- **Nodemon** - Auto-reload development server
- **Concurrently** - Run both servers at once

### Backend Structure
```
server/
├── config/db.js          # Database connection & auto-schema creation
├── routes/
│   ├── users.js          # User management endpoints
│   ├── claims.js         # Claims management endpoints
│   ├── grocery.js        # Grocery items endpoints
│   └── charts.js         # Charts/datasets endpoints
└── server.js             # Main Express application
```

### Database Tables (Created Automatically)
- `users` - Store user profiles
- `claims` - Store insurance claims
- `grocery_items` - Store grocery shopping items
- `saved_datasets` - Store chart data

---

## 🚀 Getting Started

### Step 1: Install MySQL
Download and install MySQL from: https://dev.mysql.com/downloads/mysql/

### Step 2: Create Database
```bash
# Open MySQL command line and run:
CREATE DATABASE IF NOT EXISTS daily_utility_app;
```

### Step 3: Configure .env File
Edit `.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=daily_utility_app
PORT=5000
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Run the Full Application
```bash
npm run dev
```

This will start:
- ✅ Backend server on `http://localhost:5000`
- ✅ Frontend on `http://localhost:3000`
- ✅ Database auto-initialization

---

## 📡 API Endpoints Available

### Users API
```
GET    /api/users           # Get all users
GET    /api/users/:id       # Get by ID
POST   /api/users           # Create user
PUT    /api/users/:id       # Update user
DELETE /api/users/:id       # Delete user
```

### Claims API
```
GET    /api/claims          # Get all claims
GET    /api/claims/:id      # Get by ID
POST   /api/claims          # Submit claim
PUT    /api/claims/:id      # Update claim status
DELETE /api/claims/:id      # Delete claim
```

### Grocery API
```
GET    /api/grocery         # Get all items
POST   /api/grocery         # Add item
PUT    /api/grocery/:id/toggle   # Toggle completion
PUT    /api/grocery/:id     # Update item
DELETE /api/grocery/:id     # Delete item
```

### Charts API
```
GET    /api/charts          # Get all datasets
POST   /api/charts          # Save new dataset
PUT    /api/charts/:id      # Update dataset
DELETE /api/charts/:id      # Delete dataset
```

---

## 🔄 How It Works

### Data Flow
```
React Component
    ↓
Redux Dispatch Action
    ↓
Redux Async Thunk (fetchClaims, addClaim, etc.)
    ↓
API Service (src/services/dbApi.js)
    ↓
HTTP Request to Backend
    ↓
Express Server (server/server.js)
    ↓
MySQL Database
    ↓
Response → Redux Store → React Component Updates
```

### Example: Adding a Claim
```javascript
// Component
dispatch(addClaim({ 
  description: "Medical claim", 
  amount: 500 
}));

// Redux Thunk calls backend
POST /api/claims { description, amount }

// Database saves and returns ID
INSERT INTO claims (description, amount, status)
VALUES ('Medical claim', 500, 'Pending')

// Component updates with new claim
```

---

## 📝 Redux Actions (Updated)

### Claims
```javascript
import { fetchClaims, addClaim, updateClaim, deleteClaim } from './store';

// Fetch all claims from database
dispatch(fetchClaims());

// Add new claim
dispatch(addClaim({ description, amount }));

// Update claim status
dispatch(updateClaim({ id, status: 'Approved' }));

// Delete claim
dispatch(deleteClaim(claimId));
```

### Grocery Items
```javascript
import { fetchGroceryItems, addGroceryItem, toggleGroceryItem, removeGroceryItem } from './store';

// Fetch all items
dispatch(fetchGroceryItems());

// Add item
dispatch(addGroceryItem({ name: 'Milk', category: 'dairy' }));

// Toggle completion
dispatch(toggleGroceryItem(itemId));

// Remove item
dispatch(removeGroceryItem(itemId));
```

### Users
```javascript
import { fetchUsers, addUser } from './store';

// Fetch users
dispatch(fetchUsers());

// Create user
dispatch(addUser({ name: 'John', email: 'john@example.com' }));
```

### Charts
```javascript
import { fetchCharts, saveChart } from './store';

// Get saved datasets
dispatch(fetchCharts());

// Save chart data
dispatch(saveChart({
  dataset_name: 'Sales Q1',
  dataset_type: 'bar',
  data: [...]
}));
```

---

## 🛠️ Development Commands

```bash
# Run both servers
npm run dev

# Run backend only
npm run server:dev

# Run frontend only
npm start

# Production build
npm run build

# Test database connection
curl http://localhost:5000/api/health
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Connection refused" | Make sure MySQL server is running |
| "Access denied" | Check DB credentials in `.env` |
| "Port 5000 in use" | Change PORT in `.env` or kill the process |
| "Tables not created" | Check server console for errors; manually create tables in MySQL |
| Database not created | Manually run `CREATE DATABASE daily_utility_app;` |

---

## 🔐 Security Notes

⚠️ **For Development Only**
- Never commit `.env` with real credentials to GitHub
- `.env` is already in `.gitignore` - keep it that way

✅ **For Production**
- Use environment variables on the server
- Add authentication (JWT/OAuth)
- Validate all inputs
- Use HTTPS
- Implement rate limiting
- Add proper error handling

---

## 📚 File Changes Summary

### New Files Created
- `server/server.js` - Backend application
- `server/config/db.js` - Database configuration
- `server/routes/users.js` - User endpoints
- `server/routes/claims.js` - Claims endpoints
- `server/routes/grocery.js` - Grocery endpoints  
- `server/routes/charts.js` - Charts endpoints
- `src/services/dbApi.js` - Frontend API client
- `DATABASE_SETUP.md` - Detailed setup guide
- `BACKEND_GUIDE.md` - Backend architecture guide

### Modified Files
- `src/store.js` - Updated with database async thunks
- `src/ClaimsComponent.jsx` - Connected to database
- `src/GroceryComponent.jsx` - Connected to database
- `src/index.js` - Fixed store import
- `.env` - Added database configuration
- `package.json` - Added backend scripts and dependencies

### Old Files
- `src/store.old.js` - Backup of original store (safe to delete)

---

## ✨ Features Now Available

✅ **Persistent Storage** - All data saved to MySQL  
✅ **Multi-user Ready** - User table for future authentication  
✅ **Real-time Sync** - Changes immediately reflect in database  
✅ **Scalable** - MySQL connection pooling for performance  
✅ **RESTful API** - Standard HTTP endpoints  
✅ **Automatic Schema** - Tables created on first run  
✅ **Error Handling** - Comprehensive error management  

---

## 🎯 Next Steps

1. Install MySQL and create the database
2. Update `.env` with your MySQL credentials
3. Run `npm run dev` to start both servers
4. Go to `http://localhost:3000` and test the app
5. All data will now persist in MySQL!

Happy coding! 🚀
