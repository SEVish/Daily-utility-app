import React, { useState } from 'react';
import './App.css';
import { MyComponent } from './myfunction';
import NewsComponent from './NewsComponent';
import ClaimsComponent from './ClaimsComponent';
import GroceryComponent from './GroceryComponent';
import ChartsComponent from './ChartsComponent';

function App() {
  const [activePage, setActivePage] = useState('home');

  const renderActivePage = () => {
    switch (activePage) {
      case 'news':
        return <NewsComponent />;
      case 'claims':
        return <ClaimsComponent />;
      case 'grocery':
        return <GroceryComponent />;
      case 'charts':
        return <ChartsComponent />;
      default:
        return (
          <div className="home-page">
            <h2>Welcome to Daily Utility App</h2>
            <p>Choose a section to explore:</p>
            <div className="home-buttons">
              <button onClick={() => setActivePage('news')} className="nav-btn news-btn">
                📰 View News
              </button>
              <button onClick={() => setActivePage('claims')} className="nav-btn claims-btn">
                📋 Manage Claims
              </button>
              <button onClick={() => setActivePage('grocery')} className="nav-btn grocery-btn">
                🛒 Grocery List
              </button>
              <button onClick={() => setActivePage('charts')} className="nav-btn charts-btn">
                📊 View Charts
              </button>
            </div>
            <MyComponent comName="ui" />
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Daily Utility App</h1>
        <nav className="app-nav">
          <button
            onClick={() => setActivePage('home')}
            className={`nav-btn ${activePage === 'home' ? 'active' : ''}`}
          >
            🏠 Home
          </button>
          <button
            onClick={() => setActivePage('news')}
            className={`nav-btn ${activePage === 'news' ? 'active' : ''}`}
          >
            📰 News
          </button>
          <button
            onClick={() => setActivePage('claims')}
            className={`nav-btn ${activePage === 'claims' ? 'active' : ''}`}
          >
            📋 Claims
          </button>
          <button
            onClick={() => setActivePage('grocery')}
            className={`nav-btn ${activePage === 'grocery' ? 'active' : ''}`}
          >
            🛒 Grocery
          </button>
          <button
            onClick={() => setActivePage('charts')}
            className={`nav-btn ${activePage === 'charts' ? 'active' : ''}`}
          >
            📊 Charts
          </button>
        </nav>
      </header>

      <main className="app-main">
        {renderActivePage()}
      </main>
    </div>
  );
}

export default App;
