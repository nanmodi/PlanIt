import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import HomePage from './components/HomePage';
import ChatbotPage from './components/ChatBotPage';
import HotelList from './components/HotelList';
import Flight from './components/Flight';
import Events from './components/Events';
import Hotel from './components/Hotel';
import ImageLocation from './components/ImageLocation';
import Iternary from './components/Iternary';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
console.log(isAuthenticated)
  const handleLogin = (token, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', name);
    setIsAuthenticated(true);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserName('');
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} userName={userName} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/chat" element={<ProtectedRoute element={<ChatbotPage />} />} />
        <Route path="/hotel" element={<ProtectedRoute element={<HotelList />} />} />
        <Route path="/flight" element={<ProtectedRoute element={<Flight />} />} />
        <Route path="/events" element={<ProtectedRoute element={<Events />} />} />
        <Route path="/hotels" element={<ProtectedRoute element={<Hotel />} />} />
        <Route path="/image" element={<ProtectedRoute element={<ImageLocation />} />} />
        <Route path="/iternary" element={<ProtectedRoute element={<Iternary />} />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/home"} />} />
      </Routes>
    </>
  );
}

export default App;