import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from '../assets/logo.svg';
import { Home, Users, UserPlus, Calendar } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  let token = localStorage.getItem('token');
  let mode = localStorage.getItem('mode');

  // FIX INVALID STATE
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

  if (location.pathname === '/') return null;

  const navItems = [
    { label: 'Home', path: '/app', icon: Home },
    { label: 'Clients', path: '/clients', icon: Users },
    { label: 'Add Client', path: '/clients/new', icon: UserPlus },
    ...(mode === 'online'
      ? [{ label: 'Sessions', path: '/sessions', icon: Calendar }]
      : []),
  ];

  return (
    <header className="border-b border-border bg-gradient-to-b from-[#0f0f10] to-[#18181b] backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">

        {/* LEFT */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => navigate(mode === 'offline' ? '/' : '/app')}
        >
          <img src={logo} alt="FollowUp logo" className="h-7 w-auto object-contain drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]" />
          <span className="hidden sm:inline text-xl font-semibold tracking-tight">
            Follow Up
          </span>
        </div>

        {/* CENTER */}
        <div className="flex flex-1 justify-center">
          <div className="flex items-center gap-1 sm:gap-2">

            {navItems.map((item) => {
              const Icon = item.icon; // ✅ FIXED POSITION

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
                  variant="ghost"
                  className={`group px-2 sm:px-5 text-base flex items-center gap-1 sm:gap-2 transition-all duration-200
                    ${isActive ? 'bg-white/10 shadow-sm' : 'hover:bg-white/5'}
                  `}
                >
                  <Link to={item.path}>

                    {/* ICON (mobile) */}
                    <Icon
                      className={`sm:hidden h-5 w-5 transition-all duration-200
                        ${isActive ? 'text-white scale-110' : 'text-muted-foreground group-hover:text-white'}
                      `}
                    />

                    {/* TEXT (desktop) */}
                    <span
                      className={`hidden sm:inline transition-all duration-200
                        ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-white'}
                      `}
                    >
                      {item.label}
                    </span>

                  </Link>
                </Button>
              );
            })}

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3 justify-end">

          {mode === 'online' && token && user?.name && (
            <span className="hidden sm:block text-base font-semibold text-foreground">
              Hi, {user.name}
            </span>
          )}

        </div>

      </nav>
    </header>
  );
}

export default Navbar;