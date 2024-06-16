import React, { useEffect, useState } from 'react';
import './Header.css'; 

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  return (
    <header className="header">
        <img src="/logo.png" alt="Monforte Restaurant Logo" className="logo" />
        <h1 className="restaurant-name">Monforte Restaurant</h1>
        <div className="datetime">
          <div className="date">{formatDate(currentTime)}</div>
          <div className="time">{formatTime(currentTime)}</div>
      </div>
    </header>
  );
};

export default Header;

