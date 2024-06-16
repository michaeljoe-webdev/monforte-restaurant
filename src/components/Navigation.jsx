import React, { useState, useEffect, useRef } from 'react';
import { themeAction, routesAction } from '../state/userActions';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const theme = useSelector(state => state.userData.theme)
  let selectedItem = useSelector(state => state.userData.route.toUpperCase())


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }else{
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (item) => {
    let itemRoute = item.toLowerCase() == 'dashboard' ? '' : item.toLowerCase()
    dispatch(routesAction( itemRoute ));
    selectedItem = item
    setIsOpen(false);
  };
  
  const toggleTheme = () => {
    dispatch(themeAction( theme === 'light' ? 'dark' : 'light' ));
  };

  return (
    <>
    <div className={`navigation ${theme}`}>
      <header className="header">
          <button ref={dropdownRef} className="hamburger" onClick={() => setIsOpen(!isOpen)}>
            &#9776;
          </button>
          {/* <h1 className="title">{selectedItem ? selectedItem : 'DASHBOARD'}</h1> */}
          <h1 className="title">{selectedItem ? selectedItem : 'INVENTORY'}</h1>
          <button className="theme" onClick={toggleTheme}>
          {theme === 'light' ? (
              <i className='fas fa-moon'></i>
            ) : (
              <i className='fas fa-sun'></i>
          )}
          </button>
      </header>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul className="sidebar-items">
          {/* <li onClick={() => handleItemClick('Dashboard')}><Link to="/" className="nav-link"><i className='fas fa-home'></i> Dashboard</Link></li> */}
          {/* <li onClick={() => handleItemClick('Order')}><Link to="/order" className="nav-link"><i className='fas fa-cart-plus'></i> Order</Link></li> */}
          <li onClick={() => handleItemClick('Inventory')}><Link to="/" className="nav-link"><i className='fas fa-archive '></i> Inventory</Link></li>
          {/* <li onClick={() => handleItemClick('Payment')}><Link to="/payment" className="nav-link"><i className='fas fa-credit-card'></i> Payment</Link></li> */}
          {/* <li onClick={() => handleItemClick('Settings')}><Link to="/settings" className="nav-link"><i className='fas fa-cog'></i> Settings</Link></li> */}
        </ul>
      </div>
    </div>
    </>

  );

};

export default Navigation;
