import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from '../assets/logo.svg';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let user = null;

  try {
    const storedUser = localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error('User parse failed:', err);
    user = null;
  }

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Clients', path: '/clients' },
    { label: 'Add Client', path: '/clients/new' },
  ];

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <header className="border-b border-border bg-gradient-to-b from-[#0f0f10] to-[#18181b] backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center px-6">
        
        {/* LEFT: Logo + App name */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="FollowUp logo" className="h-7 w-7" />
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
                  className="px-5 text-base transition-all hover:scale-[1.03]"
                >
                  <Link to={item.path}>{item.label}</Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Auth */}
        <div className="flex items-center gap-3 min-w-[180px] justify-end">
          
          {/* Greeting */}
          {token && user?.name && (
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hi, {user.name}
            </span>
          )}

          {/* Login / Logout */}
          {token ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="transition-all hover:scale-[1.03]"
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="transition-all hover:scale-[1.03]"
            >
              Login
            </Button>
          )}
        </div>

      </nav>
    </header>
  );
}

export default Navbar;