import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from './api';
import { usersAPI, claimsAPI, groceryAPI, chartsAPI } from './services/dbApi';

// ========== NEWSAPI THUNKS ==========
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async ({ country = 'us', category = 'general' }, { rejectWithValue }) => {
    try {
      const response = await apiService.getTopHeadlines(country, category);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchNews = createAsyncThunk(
  'news/searchNews',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await apiService.searchNews(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ========== DATABASE THUNKS ==========

// Users Thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addUser = createAsyncThunk(
  'users/add',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await usersAPI.create(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Claims Thunks
export const fetchClaims = createAsyncThunk(
  'claims/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await claimsAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addClaim = createAsyncThunk(
  'claims/add',
  async (claimData, { rejectWithValue }) => {
    try {
      const response = await claimsAPI.create(claimData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateClaim = createAsyncThunk(
  'claims/update',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await claimsAPI.update(id, data);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteClaim = createAsyncThunk(
  'claims/delete',
  async (id, { rejectWithValue }) => {
    try {
      await claimsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Grocery Thunks
export const fetchGroceryItems = createAsyncThunk(
  'grocery/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await groceryAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addGroceryItem = createAsyncThunk(
  'grocery/add',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await groceryAPI.create(itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleGroceryItem = createAsyncThunk(
  'grocery/toggle',
  async (id, { rejectWithValue }) => {
    try {
      const response = await groceryAPI.toggle(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeGroceryItem = createAsyncThunk(
  'grocery/remove',
  async (id, { rejectWithValue }) => {
    try {
      await groceryAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Charts Thunks
export const fetchCharts = createAsyncThunk(
  'charts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chartsAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveChart = createAsyncThunk(
  'charts/save',
  async (chartData, { rejectWithValue }) => {
    try {
      const response = await chartsAPI.save(chartData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ========== SLICES ==========

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    articles: [],
    totalResults: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearNews: (state) => {
      state.articles = [];
      state.totalResults = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles || [];
        state.totalResults = action.payload.totalResults || 0;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles || [];
        state.totalResults = action.payload.totalResults || 0;
      })
      .addCase(searchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUsers: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.data.push(action.payload);
      });
  },
});

const claimsSlice = createSlice({
  name: 'claims',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearClaims: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addClaim.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateClaim.fulfilled, (state, action) => {
        const claim = state.data.find(c => c.id === action.payload.id);
        if (claim) {
          Object.assign(claim, action.payload);
        }
      })
      .addCase(deleteClaim.fulfilled, (state, action) => {
        state.data = state.data.filter(c => c.id !== action.payload);
      });
  },
});

const grocerySlice = createSlice({
  name: 'grocery',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearGroceryList: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroceryItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroceryItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGroceryItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addGroceryItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(toggleGroceryItem.fulfilled, (state, action) => {
        const item = state.items.find(i => i.id === action.payload.id);
        if (item) {
          item.is_completed = action.payload.is_completed;
        }
      })
      .addCase(removeGroceryItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPosts: (state) => {
      state.data = [];
      state.error = null;
    },
  },
});

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

const userSlice = createSlice({
  name: 'currentUser',
  initialState: {
    name: '',
    email: '',
    isLoggedIn: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
    },
  },
});

// ========== STORE ==========
const store = configureStore({
  reducer: {
    news: newsSlice.reducer,
    users: usersSlice.reducer,
    claims: claimsSlice.reducer,
    grocery: grocerySlice.reducer,
    posts: postsSlice.reducer,
    counter: counterSlice.reducer,
    currentUser: userSlice.reducer,
  },
});

// Export actions
export const { clearNews } = newsSlice.actions;
export const { clearUsers } = usersSlice.actions;
export const { clearClaims } = claimsSlice.actions;
export const { clearGroceryList } = grocerySlice.actions;
export const { clearPosts } = postsSlice.actions;
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export const { setUser, logout } = userSlice.actions;

export default store;
