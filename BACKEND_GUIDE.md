# Backend API Integration Guide

## 📦 Project Structure

```
daily-utility-app/
├── server/
│   ├── config/
│   │   └── db.js               # MySQL connection & schema
│   ├── routes/
│   │   ├── users.js            # User endpoints
│   │   ├── claims.js           # Claims endpoints
│   │   ├── grocery.js          # Grocery endpoints
│   │   └── charts.js           # Charts endpoints
│   └── server.js               # Express main server
├── src/
│   ├── services/
│   │   └── dbApi.js            # Database API client (NEW)
│   ├── store.js                # Redux store
│   ├── App.js
│   └── ...other components
├── .env                        # Environment variables
├── package.json
└── DATABASE_SETUP.md           # Setup instructions
```

## 🔌 API Integration Points

### 1. Database API Service (`src/services/dbApi.js`)
This file exports separate API objects for each entity:

```javascript
import { usersAPI, claimsAPI, groceryAPI, chartsAPI } from './services/dbApi';

// Usage examples:
await usersAPI.getAll();                    // Fetch all users
await claimsAPI.create({ description, amount });
await groceryAPI.toggle(itemId);            // Toggle grocery item
await chartsAPI.save(chartData);            // Save chart dataset
```

### 2. Redux Async Thunks
Redux thunks (in `src/store.js`) make calls to the database API:

```javascript
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    const response = await usersAPI.getAll();
    return response.data;
  }
);
```

### 3. React Components
Components dispatch Redux actions to fetch/update data:

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchClaims, addClaim } from './store';

function ClaimsComponent() {
  const dispatch = useDispatch();
  const claims = useSelector(state => state.claims.data);
  
  useEffect(() => {
    dispatch(fetchClaims());
  }, [dispatch]);
}
```

## 🔄 Data Flow

```
React Component
    ↓
    dispatch(Redux Action)
    ↓
    Redux Async Thunk
    ↓
    API Service Call (dbApi.js)
    ↓
    HTTP Request to Backend
    ↓
    Express Server (server.js)
    ↓
    MySQL Database
    ↓
    Response back through the chain
    ↓
    Redux Store Updated
    ↓
    Component Re-renders with New Data
```

## 🚀 Running the Full Stack

### Development Mode (Both servers with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm start
```

## 📡 Environment Variables

The app uses these variables (defined in `.env`):

```env
# Frontend
REACT_APP_API_URL=http://localhost:5000/api    # Backend API base URL
REACT_APP_NEWS_API_KEY=xxxxx                   # NewsAPI key

# Backend
DB_HOST=localhost                              # MySQL host
DB_USER=root                                   # MySQL username
DB_PASSWORD=xxxxx                              # MySQL password
DB_NAME=daily_utility_app                      # Database name
PORT=5000                                      # Backend port
```

## ✅ Verification Checklist

Before running the app:
- [ ] MySQL server is installed and running
- [ ] Database `daily_utility_app` is created
- [ ] `.env` file has correct database credentials
- [ ] All npm dependencies are installed
- [ ] Port 3000 (frontend) and 5000 (backend) are available

## 🔗 Component Integration Examples

### ClaimsComponent with Database
```javascript
// Before: Claims stored in Redux only
const [claims, setClaims] = useState([]);

// After: Claims stored in MySQL + Redux
import { submitClaim } from './store';

const handleSubmit = async (formData) => {
  dispatch(submitClaim(formData)); // Saves to DB
};
```

### GroceryComponent with Database
```javascript
// Before: Local grocery items in Redux
// After: Persisted in MySQL database

import { addGroceryItem, toggleGroceryItem } from './store';

const handleAddItem = (item) => {
  dispatch(addGroceryItem(item)); // Saves to DB
};
```

## 📊 Charts with Persistent Storage
```javascript
import { chartsAPI } from './services/dbApi';

// Save chart to database
const saveDataset = async (chartData) => {
  await chartsAPI.save({
    dataset_name: 'Sales Q1',
    dataset_type: 'bar',
    data: chartData
  });
};
```

