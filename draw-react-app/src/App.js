import React, { useState, useEffect } from 'react';
import Home from './Home/Home';
import ProtectedRoute from './ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);
  const [userDetails, setUserDetails] = useState({ username: '' });

  useEffect(() => {
    let isUserInfoSet = false;
    
    // Mock the authentication flow
    const mockUserInfo = { username: 'testuser', name: 'Test User' };
    localStorage.setItem('userDetails', JSON.stringify(mockUserInfo));
    isUserInfoSet = true;

    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserDetails(userDetails);
      setLoggedIn(true);
      isUserInfoSet = true;
    }
    setLoading(false); // Set loading to false after authentication check is complete
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute isLoggedIn={loggedIn} />}>
          <Route path="/" element={<Home />} />
          <Route path="/grand-prize" element={<Home skipSecondaryWinners />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
