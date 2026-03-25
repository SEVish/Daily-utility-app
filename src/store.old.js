import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from './api';

// Async thunk for fetching top headlines
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

// Async thunk for searching news
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

const claimsSlice = createSlice({
  name: 'claims',
  initialState: {
    claims: [],
    loading: false,
    error: null,
  },
  reducers: {
    submitClaim: (state, action) => {
      state.claims.push(action.payload);
    },
    clearClaims: (state) => {
      state.claims = [];
    },
    updateClaimStatus: (state, action) => {
      const { id, status } = action.payload;
      const claim = state.claims.find(c => c.id === id);
      if (claim) {
        claim.status = status;
      }
    },
    deleteClaim: (state, action) => {
      state.claims = state.claims.filter(c => c.id !== action.payload);
    },
  },
});

const grocerySlice = createSlice({
  name: 'grocery',
  initialState: {
    items: [],
  },
  reducers: {
    addGroceryItem: (state, action) => {
      // Check if item already exists
      const existingItem = state.items.find(item => item.name.toLowerCase() === action.payload.name.toLowerCase());
      if (!existingItem) {
        state.items.push(action.payload);
      }
    },
    removeGroceryItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleGroceryItem: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.completed = !item.completed;
      }
    },
    clearGroceryList: (state) => {
      state.items = [];
    },
  },
});

// Async thunk for fetching posts
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getPosts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
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
  name: 'user',
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
    clearUser: (state) => {
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export const { setUser, clearUser } = userSlice.actions;
export const { clearPosts } = postsSlice.actions;
export const { clearNews } = newsSlice.actions;
export const { submitClaim, clearClaims, updateClaimStatus, deleteClaim } = claimsSlice.actions;
export const { addGroceryItem, removeGroceryItem, toggleGroceryItem, clearGroceryList } = grocerySlice.actions;

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    user: userSlice.reducer,
    posts: postsSlice.reducer,
    news: newsSlice.reducer,
    claims: claimsSlice.reducer,
    grocery: grocerySlice.reducer,
  },
});
