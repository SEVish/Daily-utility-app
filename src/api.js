import axios from 'axios';

// JSONPlaceholder client
const jsonPlaceholderClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

// NewsAPI client
// Get your free API key from: https://newsapi.org/
export const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY || 'YOUR_API_KEY_HERE';
export const isNewsApiKeyConfigured = !!(NEWS_API_KEY && NEWS_API_KEY !== 'YOUR_API_KEY_HERE');

if (!isNewsApiKeyConfigured) {
  console.warn(
    '[NewsAPI] REACT_APP_NEWS_API_KEY is not configured. Set it in .env to fetch real news data.'
  );
}

const newsClient = axios.create({
  baseURL: 'https://newsapi.org/v2',
  timeout: 10000,
  params: {
    apiKey: NEWS_API_KEY,
  },
});

// API methods
export const apiService = {
  // JSONPlaceholder endpoints
  getPosts: () => jsonPlaceholderClient.get('/posts'),
  getPost: (id) => jsonPlaceholderClient.get(`/posts/${id}`),
  getUsers: () => jsonPlaceholderClient.get('/users'),
  getComments: () => jsonPlaceholderClient.get('/comments'),
  
  // NewsAPI endpoints
  getTopHeadlines: (country = 'us', category = 'general') => 
    newsClient.get('/top-headlines', {
      params: {
        country,
        category,
      },
    }),
  
  searchNews: (query, sortBy = 'publishedAt') =>
    newsClient.get('/everything', {
      params: {
        q: query,
        sortBy,
        pageSize: 20,
      },
    }),
  
  getNewsByCategory: (category = 'general', country = 'us') =>
    newsClient.get('/top-headlines', {
      params: {
        category,
        country,
      },
    }),
};

export default jsonPlaceholderClient;
