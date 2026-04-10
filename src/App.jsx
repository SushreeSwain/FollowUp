import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import Home from './pages/Home';
import ClientList from './pages/ClientList';
import AddClient from './pages/AddClient';
import ClientDetail from './pages/ClientDetail';
import EditClient from './pages/EditClient';
import Sessions from './pages/Sessions';
import ExportClient from './pages/ExportClient';
import DeleteConfirmation from './pages/DeleteConfirmation';
import Layout from './components/Layout';
import AddSession from './pages/AddSession';
import SessionDetail from './pages/SessionDetail';
import EditSession from './pages/EditSession';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Layout>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route path="/" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />

        <Route path="/clients" element={
          <ProtectedRoute><ClientList /></ProtectedRoute>
        } />

        <Route path="/clients/new" element={
          <ProtectedRoute><AddClient /></ProtectedRoute>
        } />

        <Route path="/clients/:id" element={
          <ProtectedRoute><ClientDetail /></ProtectedRoute>
        } />

        <Route path="/clients/:id/edit" element={
          <ProtectedRoute><EditClient /></ProtectedRoute>
        } />

        <Route path="/clients/:id/sessions" element={
          <ProtectedRoute><Sessions /></ProtectedRoute>
        } />

        <Route path="/clients/:id/sessions/new" element={
          <ProtectedRoute><AddSession /></ProtectedRoute>
        } />

        <Route path="/clients/:clientId/sessions/:sessionId" element={
          <ProtectedRoute><SessionDetail /></ProtectedRoute>
        } />

        <Route path="/clients/:clientId/sessions/:sessionId/edit" element={
          <ProtectedRoute><EditSession /></ProtectedRoute>
        } />

        <Route path="/clients/:id/export" element={
          <ProtectedRoute><ExportClient /></ProtectedRoute>
        } />

        <Route path="/clients/:id/delete" element={
          <ProtectedRoute><DeleteConfirmation /></ProtectedRoute>
        } />

        {/* fallback */}
        <Route path="/not-found" element={<NotFound />} />
        <Route
          path="*"
          element={
            localStorage.getItem('token') ? (
              <NotFound />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

      </Routes>
    </Layout>
  );
}

export default App;