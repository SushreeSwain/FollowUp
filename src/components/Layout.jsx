import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { Button } from '@/components/ui/button';
import Footer from './Footer';


function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.pathname !== '/';

  return (
    <>
      <NavBar />

      {showBackButton && (
        <div className="px-6 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
      )}

      <main className="min-h-screen bg-background px-6 pt-4 pb-8">
        {children}
      </main>
      <Footer/>
    </>
  );
}

export default Layout;
