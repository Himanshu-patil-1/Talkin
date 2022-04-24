import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import './styles/App.scss';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Auth, Home } from './Pages';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { removeUser, setUser } from './features/userSlice';

const ProtectedRoutes = ({ children, isAllowed, redirectTo }) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} />;
  }
  return children ? children : <Outlet />;
};

function App() {
  const authenticated = useSelector((state) => state.user.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const checkAuth = () => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        dispatch(removeUser());
        setLoading(false);
      }
      dispatch(
        setUser({
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          id: user.uid,
        })
      );
      setLoading(false);
    });

    return unsubscribe;
  };
  React.useEffect(() => {
    const unsubscribe = checkAuth();
    return () => {
      unsubscribe();
    };
  }, []);

  return loading ? (
    <h1>Loading....</h1>
  ) : (
    <div className="App">
      <Navbar />
      <div className="main-container">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes isAllowed={!authenticated} redirectTo="/home">
                <Auth />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoutes isAllowed={authenticated} redirectTo="/">
                <Home />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
