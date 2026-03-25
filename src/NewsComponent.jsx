import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews, searchNews, clearNews } from './store';
import { isNewsApiKeyConfigured } from './api';
import './NewsComponent.css';

export function NewsComponent() {
  const dispatch = useDispatch();
  const { articles, loading, error } = useSelector((state) => state.news);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = [
    'general',
    'business',
    'entertainment',
    'health',
    'science',
    'sports',
    'technology',
  ];

  useEffect(() => {
    // Fetch top headlines on component mount
    dispatch(fetchNews({ category: selectedCategory }));
  }, [dispatch, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchNews({ query: searchQuery }));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchNews({ category: selectedCategory }));
  };

  if (!isNewsApiKeyConfigured) {
    return (
      <div className="news-container">
        <h2>NewsAPI key is missing</h2>
        <p>
          Set <code>REACT_APP_NEWS_API_KEY</code> in your <code>.env</code> file and
          restart the app.
        </p>
      </div>
    );
  }

  if (loading) return <p className="loading">Loading news...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="news-container">
      <h1>📰 News Headlines</h1>

      <div className="controls">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn">
            Search
          </button>
        </form>

        <div className="categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <button onClick={handleRefresh} className="btn refresh-btn">
          Refresh
        </button>
      </div>

      <div className="articles-list">
        {articles.length === 0 ? (
          <p className="no-articles">No articles found</p>
        ) : (
          articles.map((article, index) => (
            <article key={index} className="article-card">
              {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} />
              )}
              <div className="article-content">
                <h3>{article.title}</h3>
                <p className="description">{article.description}</p>
                <p className="source">Source: {article.source.name}</p>
                <small className="date">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </small>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more"
                >
                  Read Full Article →
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default NewsComponent;
