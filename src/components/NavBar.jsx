import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from '../assets/logo.svg';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  let token = localStorage.getItem('token');
  let mode = localStorage.getItem('mode');

  // 🔥 FIX INVALID STATE
  if (mode === 'offline' && token) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    token = null;
  }

  let user = null;

  try {
    const storedUser = localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error('User parse failed:', err);
    user = null;
  }

  //  HIDE NAVBAR ON LANDING
  if (location.pathname === '/') {
    return null;
  }

  //  NAV ITEMS (SESSIONS ONLY ONLINE)
  const navItems = [
    { label: 'Home', path: '/app' },
    { label: 'Clients', path: '/clients' },
    { label: 'Add Client', path: '/clients/new' },

    ...(mode === 'online'
      ? [{ label: 'Sessions', path: '/sessions' }]
      : []),

    { label: 'About', path: '/about' },
  ];

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('mode');

    navigate('/');
  }

  return (
    <header className="border-b border-border bg-gradient-to-b from-[#0f0f10] to-[#18181b] backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center px-6">

        {/* 🔥 LEFT (LOGO) */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            if (mode === 'offline') {
              navigate('/');
            } else {
              navigate('/app');
            }
          }}
        >
          <img src={logo} alt="FollowUp logo" className="h-7 w-7" />
          <span className="text-xl font-semibold tracking-tight">
            Follow Up
          </span>
        </div>

        {/*  CENTER NAV */}
        <div className="flex flex-1 justify-center">
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive =
                item.path === '/clients'
                  ? location.pathname.startsWith('/clients') &&
                    !location.pathname.startsWith('/clients/new')
                  : item.path === '/clients/new'
                  ? location.pathname === '/clients/new'
                  : location.pathname === item.path;

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

        {/* 🔥 RIGHT */}
        <div className="flex items-center gap-3 min-w-[180px] justify-end">

          {/* 👋 Greeting */}
          {mode === 'online' && token && user?.name && (
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hi, {user.name}
            </span>
          )}

          {/* 🔐 AUTH */}
          {mode === 'online' ? (
            token ? (
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
            )
          ) : (
            <span className="text-xs text-muted-foreground">
              Offline Mode
            </span>
          )}

        </div>

      </nav>
    </header>
  );
}

export default Navbar;