import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addGroceryItem, removeGroceryItem, toggleGroceryItem, clearGroceryList } from './store';
import './GroceryComponent.css';

export function GroceryComponent() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.grocery);

  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('produce');

  const groceryCategories = {
    produce: {
      name: '🥕 Produce',
      items: [
        'Apples', 'Bananas', 'Oranges', 'Grapes', 'Strawberries', 'Blueberries',
        'Lemons', 'Limes', 'Avocados', 'Tomatoes', 'Cucumbers', 'Lettuce',
        'Spinach', 'Broccoli', 'Carrots', 'Potatoes', 'Onions', 'Garlic',
        'Bell Peppers', 'Zucchini', 'Eggplant', 'Mushrooms', 'Celery'
      ]
    },
    dairy: {
      name: '🥛 Dairy',
      items: [
        'Milk', 'Cheese', 'Yogurt', 'Butter', 'Eggs', 'Cream Cheese',
        'Sour Cream', 'Cottage Cheese', 'Ice Cream', 'Whipped Cream'
      ]
    },
    meat: {
      name: '🥩 Meat & Poultry',
      items: [
        'Chicken Breast', 'Ground Beef', 'Pork Chops', 'Bacon', 'Sausage',
        'Turkey', 'Salmon', 'Tuna', 'Shrimp', 'Beef Steak', 'Ham', 'Hot Dogs'
      ]
    },
    bakery: {
      name: '🍞 Bakery',
      items: [
        'Bread', 'Bagels', 'Croissants', 'Muffins', 'Donuts', 'Cake',
        'Cookies', 'Pie', 'Brownies', 'Baguette', 'Pita Bread'
      ]
    },
    pantry: {
      name: '🥫 Pantry Staples',
      items: [
        'Rice', 'Pasta', 'Cereal', 'Oats', 'Flour', 'Sugar', 'Salt', 'Pepper',
        'Olive Oil', 'Vegetable Oil', 'Vinegar', 'Soy Sauce', 'Ketchup',
        'Mustard', 'Mayonnaise', 'Peanut Butter', 'Jam', 'Honey'
      ]
    },
    frozen: {
      name: '🧊 Frozen',
      items: [
        'Frozen Vegetables', 'Frozen Fruits', 'Frozen Pizza', 'Ice Cream',
        'Frozen Meals', 'Frozen Fish', 'Frozen Chicken', 'French Fries'
      ]
    },
    beverages: {
      name: '🥤 Beverages',
      items: [
        'Water', 'Soda', 'Juice', 'Coffee', 'Tea', 'Beer', 'Wine',
        'Sports Drinks', 'Energy Drinks', 'Milk Alternatives'
      ]
    },
    snacks: {
      name: '🍿 Snacks',
      items: [
        'Chips', 'Popcorn', 'Nuts', 'Pretzels', 'Crackers', 'Cookies',
        'Candy', 'Chocolate', 'Granola Bars', 'Protein Bars'
      ]
    },
    cleaning: {
      name: '🧹 Household',
      items: [
        'Dish Soap', 'Laundry Detergent', 'All-Purpose Cleaner', 'Paper Towels',
        'Toilet Paper', 'Trash Bags', 'Sponges', 'Bleach', 'Fabric Softener'
      ]
    }
  };

  const handleAddItem = (itemName) => {
    const newGroceryItem = {
      id: Date.now() + Math.random(),
      name: itemName,
      category: selectedCategory,
      completed: false,
      addedAt: new Date().toISOString(),
    };
    dispatch(addGroceryItem(newGroceryItem));
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      handleAddItem(newItem.trim());
      setNewItem('');
    }
  };

  const handleToggleItem = (id) => {
    dispatch(toggleGroceryItem(id));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeGroceryItem(id));
  };

  const getItemsByCategory = (category) => {
    return items.filter(item => item.category === category);
  };

  const getCompletedCount = () => {
    return items.filter(item => item.completed).length;
  };

  const getTotalCount = () => {
    return items.length;
  };

  return (
    <div className="grocery-container">
      <div className="grocery-header">
        <h1>🛒 Grocery Checklist</h1>
        <div className="grocery-stats">
          <span className="stats-text">
            {getCompletedCount()} / {getTotalCount()} items completed
          </span>
          <button onClick={() => dispatch(clearGroceryList())} className="clear-btn">
            Clear All
          </button>
        </div>
      </div>

      <div className="grocery-content">
        {/* Quick Add Section */}
        <div className="quick-add-section">
          <h2>Quick Add Items</h2>
          <div className="category-selector">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {Object.entries(groceryCategories).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="quick-items-grid">
            {groceryCategories[selectedCategory].items.map((item) => (
              <button
                key={item}
                onClick={() => handleAddItem(item)}
                className="quick-item-btn"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Item Form */}
        <div className="custom-item-section">
          <h2>Add Custom Item</h2>
          <form onSubmit={handleAddCustomItem} className="custom-item-form">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter custom item..."
              className="custom-item-input"
            />
            <button type="submit" className="add-custom-btn">
              Add Item
            </button>
          </form>
        </div>

        {/* Grocery List */}
        <div className="grocery-list-section">
          <h2>Your Grocery List</h2>
          {items.length === 0 ? (
            <p className="empty-list">No items in your grocery list yet. Add some items above!</p>
          ) : (
            <div className="grocery-list">
              {Object.entries(groceryCategories).map(([categoryKey, category]) => {
                const categoryItems = getItemsByCategory(categoryKey);
                if (categoryItems.length === 0) return null;

                return (
                  <div key={categoryKey} className="category-section">
                    <h3>{category.name}</h3>
                    <div className="category-items">
                      {categoryItems.map((item) => (
                        <div key={item.id} className={`grocery-item ${item.completed ? 'completed' : ''}`}>
                          <label className="item-checkbox">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => handleToggleItem(item.id)}
                            />
                            <span className="checkmark"></span>
                          </label>
                          <span className="item-name">{item.name}</span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="remove-item-btn"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroceryComponent;
