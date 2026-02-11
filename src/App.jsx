import { Routes, Route } from 'react-router-dom';

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



function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/new" element={<AddClient />} />
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="/clients/:id/edit" element={<EditClient />} />
        <Route path="/clients/:id/sessions" element={<Sessions />} />
        <Route path="/clients/:id/sessions/new" element={<AddSession />} />
        <Route path="/clients/:clientId/sessions/:sessionId" element={<SessionDetail />} />
        <Route path="/clients/:clientId/sessions/:sessionId/edit" element={<EditSession />} />
        <Route path="/clients/:id/export" element={<ExportClient />} />
        <Route path="/clients/:id/delete" element={<DeleteConfirmation />} />
        <Route path="/not-found" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}



export default App;
