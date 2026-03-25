# MySQL Database Setup Guide

## 📋 Prerequisites
1. **MySQL Server** installed on your system
2. **Node.js** and npm installed
3. Database management tool (MySQL Workbench, phpMyAdmin, or command line)

---

## 🔧 Step 1: Install MySQL Server

### Windows
1. Download from https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the Setup Wizard
3. Remember the **root** password you set!
4. Make sure MySQL Server runs as a service (default option)

### Mac
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

---

## 🗄️ Step 2: Create the Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE IF NOT EXISTS daily_utility_app;
USE daily_utility_app;
```

---

## ⚙️ Step 3: Configure Database Credentials

Edit the `.env` file in the root directory with your MySQL credentials:

```env
# MySQL Database Configuration
DB_HOST=localhost          # Usually 'localhost'
DB_USER=root              # Your MySQL username
DB_PASSWORD=your_password # Your MySQL password (set during installation)
DB_NAME=daily_utility_app # Database name
PORT=5000                 # Backend server port
```

**Important:** If you don't have a password, leave `DB_PASSWORD=` blank.

---

## 🚀 Step 4: Start the Application

### Option 1: Run Backend and Frontend Together (Recommended)
```bash
npm run dev
```
This will start both the backend server (http://localhost:5000) and frontend (http://localhost:3000) simultaneously.

### Option 2: Run Backend Only
```bash
npm run server:dev
```
The server will run on http://localhost:5000 with automatic reload on changes (nodemon).

### Option 3: Run Frontend Only
```bash
npm start
```

---

## 📊 Available API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Claims
- `GET /api/claims` - Get all claims
- `GET /api/claims/:id` - Get claim by ID
- `POST /api/claims` - Create new claim
- `PUT /api/claims/:id` - Update claim
- `DELETE /api/claims/:id` - Delete claim

### Grocery
- `GET /api/grocery` - Get all items
- `GET /api/grocery/category/:category` - Get items by category
- `POST /api/grocery` - Create new item
- `PUT /api/grocery/:id/toggle` - Toggle completion
- `PUT /api/grocery/:id` - Update item
- `DELETE /api/grocery/:id` - Delete item

### Charts
- `GET /api/charts` - Get all saved datasets
- `GET /api/charts/:id` - Get dataset by ID
- `POST /api/charts` - Save new dataset
- `PUT /api/charts/:id` - Update dataset
- `DELETE /api/charts/:id` - Delete dataset

---

## 🧪 Testing the Connection

1. Start the backend: `npm run server:dev`
2. Test the health check endpoint in your browser:
   ```
   http://localhost:5000/api/health
   ```
3. You should see: `{"status":"✅ Server is running","timestamp":"..."}`

---

## 📝 Database Schema

The application automatically creates these tables on startup:

### users
```
id (INT PRIMARY KEY)
name (VARCHAR)
email (VARCHAR UNIQUE)
password (VARCHAR)
created_at (TIMESTAMP)
```

### claims
```
id (INT PRIMARY KEY)
claim_number (VARCHAR UNIQUE)
description (TEXT)
amount (DECIMAL)
status (VARCHAR)
submitted_date (TIMESTAMP)
user_id (INT FK)
```

### grocery_items
```
id (INT PRIMARY KEY)
name (VARCHAR)
category (VARCHAR)
is_completed (BOOLEAN)
user_id (INT FK)
created_at (TIMESTAMP)
```

### saved_datasets
```
id (INT PRIMARY KEY)
dataset_name (VARCHAR)
dataset_type (VARCHAR)
data (JSON)
user_id (INT FK)
created_at (TIMESTAMP)
```

---

## 🐛 Troubleshooting

### "Connection refused" error
- Make sure MySQL server is running
- Check if PORT is correct in `.env`
- On Windows: Check Services (search "Services" in Start Menu)

### "Access denied for user"
- Verify credentials in `.env` file
- Try resetting the password: `mysql -u root -p`

### Database tables not created
- Check backend console for errors
- Manually run the SQL commands in MySQL Workbench

### Port 5000 already in use
- Change PORT in `.env` to another number (e.g., 5001)
- Or kill the process using port 5000

---

## 📱 Using with Frontend

The React app will now store data in MySQL instead of just Redux state. All claims, grocery items, and user data will persist in the database!

---

## 🔐 Security Notes (Important for Production)

- ❌ DO NOT commit `.env` with real credentials to GitHub
- ✅ Use environment variables for database passwords
- ✅ Implement authentication/authorization for production
- ✅ Add input validation and sanitization
- ✅ Use connection pooling (already configured)

