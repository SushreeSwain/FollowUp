import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const mode = localStorage.getItem('mode');

  // NO MODE SELECTED → go landing
  if (!mode) {
    return <Navigate to="/" replace />;
  }

  // ⚡ OFFLINE → allow
  if (mode === 'offline') {
    return children;
  }

  // 🌐 ONLINE → require login
  if (mode === 'online' && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;