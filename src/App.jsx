import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import InventoryPage from './pages/Inventory';
// import OrderPage from './pages/OrderPage';
// import PaymentPage from './pages/PaymentPage';
// import SettingsPage from './pages/SettingsPage';

function App() {
  const theme = useSelector(state => state.userData.theme);

  return (
    <>
      <Header/>
      <Navigation/>
      <main className={`container ${theme}`}>
        <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/" element={<InventoryPage />} />
          {/* <Route path="/order" element={<OrderPage />} /> */}
          {/* <Route path="/payment" element={<PaymentPage />} /> */}
          {/* <Route path="/settings" element={<SettingsPage />} /> */}
          {/* <Route path="/*" element={<NotFound />} />
          {isLoggedIn ? (
              <Route path="/dashboard" element={<Dashboard />} />
            ) : (
              <Route path="/login" element={<LoginPage />} />
          )}
          {isLoggedIn ? (
              <> </>
            ) : (
              <Route path="/register" element={<RegisterPage />} /> 
          )} */}
        </Routes>
      </main>
    </>
  );
}

export default App;
