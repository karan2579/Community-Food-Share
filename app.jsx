import React, { useState } from 'react';
import './App.css';

function App() {
  const [foodItems, setFoodItems] = useState([]);
  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    location: '',
    contact: '',
    quantity: 1
  });
  const [errors, setErrors] = useState({
    contact: '',
    location: ''
  });

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when typing
    if (name === 'contact' || name === 'location') {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = Math.max(1, parseInt(e.target.value) || 1);
    setNewFood(prev => ({
      ...prev,
      quantity
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { contact: '', location: '' };

    if (newFood.contact && !validateEmail(newFood.contact)) {
      newErrors.contact = 'Please enter a valid Gmail address';
      valid = false;
    }

    if (!newFood.location.trim()) {
      newErrors.location = 'Location is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (newFood.name && newFood.location) {
      const existingItem = foodItems.find(
        item => item.name.toLowerCase() === newFood.name.toLowerCase() && 
               item.location.toLowerCase() === newFood.location.toLowerCase()
      );

      if (existingItem) {
        setFoodItems(foodItems.map(item => 
          item.id === existingItem.id 
            ? { ...item, quantity: item.quantity + newFood.quantity }
            : item
        ));
      } else {
        setFoodItems([...foodItems, { 
          ...newFood, 
          id: Date.now()
        }]);
      }

      setNewFood({
        name: '',
        description: '',
        location: '',
        contact: '',
        quantity: 1
      });
    }
  };

  const handleClaimFood = (id) => {
    setFoodItems(foodItems.map(item => 
      item.id === id && item.quantity > 0
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const getGoogleMapsLink = (location) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  return (
    <div className="app">
      <div className="background-overlay"></div>
      
      <header>
        <h1>Community Food Share</h1>
        <p>Share extra food with those in need</p>
      </header>

      <main>
        <section className="food-form">
          <h2>Share Your Extra Food</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Food Item:</label>
              <input
                type="text"
                name="name"
                value={newFood.name}
                onChange={handleInputChange}
                placeholder="e.g., Pizza, Sandwiches"
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={newFood.description}
                onChange={handleInputChange}
                placeholder="Quantity, dietary info, etc."
              />
            </div>
            <div className="form-group">
              <label>Quantity (portions):</label>
              <input
                type="number"
                min="1"
                value={newFood.quantity}
                onChange={handleQuantityChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={newFood.location}
                onChange={handleInputChange}
                placeholder="Where to pick up"
                required
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
            <div className="form-group">
              <label>Contact Info </label>
              <input
                type="email"
                name="contact"
                value={newFood.contact}
                onChange={handleInputChange}
                placeholder="yourname@gmail.com"
                required
              />
              {errors.contact && <span className="error-message">{errors.contact}</span>}
            </div>
            <button type="submit">Share Food</button>
          </form>
        </section>

        <section className="food-list">
          <h2>Available Food Items</h2>
          {foodItems.filter(item => item.quantity > 0).length === 0 ? (
            <p className="no-items">No food items available right now. Be the first to share!</p>
          ) : (
            <div className="items-container">
              {foodItems.filter(item => item.quantity > 0).map(item => (
                <div key={item.id} className="food-item">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p>
                    <strong>📍 Location:</strong> 
                    <a 
                      href={getGoogleMapsLink(item.location)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="map-link"
                    >
                      {item.location}
                    </a>
                  </p>
                  <p><strong>📞 Contact:</strong> {item.contact}</p>
                  <div className="quantity-section">
                    <span>Portions: {item.quantity}</span>
                    <button 
                      onClick={() => handleClaimFood(item.id)}
                      disabled={item.quantity <= 0}
                      className="claim-btn"
                    >
                      Claim
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Community Food Share - Fighting Hunger Together</p>
      </footer>
    </div>
  );
}

export default App;
