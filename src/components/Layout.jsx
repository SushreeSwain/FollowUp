import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { Button } from '@/components/ui/button';
import Footer from './Footer';

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import AppSidebar from './AppSidebar';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.pathname !== '/';

  return (
    <SidebarProvider>

      <AppSidebar />

      <SidebarInset>

        <NavBar />

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-6 pt-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          )}

          {/* SIDEBAR TOGGLE BUTTON */}
          <SidebarTrigger />
        </div>

        {/* MAIN */}
        <main className="min-h-screen bg-background px-6 pt-4 pb-8">
          {children}
        </main>

        <Footer />

      </SidebarInset>

    </SidebarProvider>
  );
}

export default Layout;