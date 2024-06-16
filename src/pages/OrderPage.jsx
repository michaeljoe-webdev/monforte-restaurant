import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

import './OrderPage.css'; // Ensure you have the CSS file

const OrderPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [theme, setTheme] = useState('light'); // Theme state
  const db = getDatabase();



  useEffect(() => {
    const menuRef = ref(db, 'restaurantMenu/categories');
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMenuItems(items);
        console.log('menuItems',items)

      }
    }, (error) => {
      console.error("Error fetching data: ", error);
    });
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setTotal(total + product.price);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.className = theme; // Apply theme to body
  }, [theme]);

  return (
    <div className={`order-page ${theme}`}>
      <div className="left-column">
        <h2>Products</h2>
        <div className="product-grid">
          {/* {menuItems.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.category}</h3>
              <p>Name: {product.name}</p>
              <p>Size: {product.options.join(', ')}</p>
              <p>Stock: {product.stock}</p>
              <p>Price: ${product.price.toFixed(2)}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))} */}
        </div>
      </div>
      <div className="right-column">
        <h2>Cart</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} ({item.options.join(', ')}) - ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
        <div className="total-section">
          <h3>Total: ${total.toFixed(2)}</h3>
          <button className="payment-button">Proceed to Payment</button>
        </div>
      </div>
      <button className="theme-toggle" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

export default OrderPage;
