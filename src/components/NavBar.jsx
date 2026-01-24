import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from '../assets/logo.svg'; // adjust extension if svg

function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Clients', path: '/clients' },
    { label: 'Add Client', path: '/clients/new' },
  ];

  return (
    <header className="border-b border-border bg-gradient-to-b from-[#0f0f10] to-[#18181b] backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center px-6">
        
        {/* LEFT: Logo + App name */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="FollowUp logo"
            className="h-7 w-7"
          />
          <span className="text-xl font-semibold tracking-tight">
            Follow Up
          </span>
        </div>

        {/* CENTER: Navigation */}
        <div className="flex flex-1 justify-center">
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  asChild
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="default"
                  className="px-5 text-base"
                >
                  <Link to={item.path}>{item.label}</Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Reserved for future (profile, mode toggle, etc.) */}
        <div className="w-[120px]" />
      </nav>
    </header>
  );
}

export default Navbar;
