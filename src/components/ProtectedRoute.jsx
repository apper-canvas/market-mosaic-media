import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const currentPath = window.location.pathname + window.location.search;

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate(`/login?redirect=${currentPath}`);
    }
  }, [isAuthenticated, navigate, currentPath]);

  // Show children only if authenticated
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;