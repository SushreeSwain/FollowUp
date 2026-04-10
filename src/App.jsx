import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
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
    <Routes>

      {/* 🌍 PUBLIC (NO NAVBAR) */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔒 APP (WITH NAVBAR) */}
      <Route path="/app" element={
        <ProtectedRoute>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/clients" element={
        <ProtectedRoute>
          <Layout>
            <ClientList />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/clients/new" element={
        <ProtectedRoute>
          <Layout>
            <AddClient />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/clients/:id" element={
        <ProtectedRoute>
          <Layout>
            <ClientDetail />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/clients/:id/edit" element={
        <ProtectedRoute>
          <Layout>
            <EditClient />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/clients/:id/sessions" element={
        <ProtectedRoute>
          <Layout>
            <Sessions />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/clients/:id/sessions/new" element={
        <ProtectedRoute>
          <Layout>
            <AddSession />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/clients/:clientId/sessions/:sessionId" element={
        <ProtectedRoute>
          <Layout>
            <SessionDetail />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/clients/:clientId/sessions/:sessionId/edit" element={
        <ProtectedRoute>
          <Layout>
            <EditSession />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/clients/:id/export" element={
        <ProtectedRoute>
          <Layout>
            <ExportClient />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/clients/:id/delete" element={
        <ProtectedRoute>
          <Layout>
            <DeleteConfirmation />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;