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

      {/* SIDEBAR */}
      <AppSidebar />

      <SidebarInset>

        {/* NAVBAR */}
        <NavBar />

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-6 pt-4">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-2">

            {/* 🔥 SIDEBAR BUTTON HERE */}
            <SidebarTrigger className="md:hidden scale-110" />

            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            )}

          </div>

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