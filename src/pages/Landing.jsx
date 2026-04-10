import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

function Landing() {
  const navigate = useNavigate();

  // 🔥 CONTROL ENTRY FLOW
  useEffect(() => {
    const mode = localStorage.getItem('mode');
    const token = localStorage.getItem('token');

    // ✅ ONLY auto-enter app if user is ONLINE + LOGGED IN
    if (mode === 'online' && token) {
      navigate('/app');
    }

    // ❌ DO NOT auto-redirect offline
    // let user stay on landing intentionally

  }, [navigate]);

  // 🌐 ONLINE BUTTON
  function goOnline() {
    localStorage.setItem('mode', 'online');
    navigate('/login');
  }

  // ⚡ OFFLINE BUTTON
  function goOffline() {
    localStorage.setItem('mode', 'offline');

    // clear any online state
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/app');
  }

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-5xl space-y-10">

        {/* 🔥 TOP BUTTONS */}
        <div className="flex justify-center gap-4">
          <Button onClick={goOnline}>
            Go Online
          </Button>
          <Button variant="secondary" onClick={goOffline}>
            Continue Offline
          </Button>
        </div>

        {/* 🔥 HERO */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            FollowUp
          </h1>
          <p className="text-muted-foreground">
            Manage your clients and sessions seamlessly — online or offline.
          </p>
        </div>

        {/* 🔥 INFO BLOCKS */}
        <div className="space-y-6">

          <Card className="p-4">
            <CardContent>
              <h2 className="font-semibold text-lg">
                Track client sessions
              </h2>
              <p className="text-sm text-muted-foreground">
                Easily manage all your sessions with structured notes and timelines.
              </p>
            </CardContent>
          </Card>

          <Card className="p-4 ml-auto w-[80%]">
            <CardContent>
              <h2 className="font-semibold text-lg">
                Offline-first support
              </h2>
              <p className="text-sm text-muted-foreground">
                Work without internet — your data stays safe locally.
              </p>
            </CardContent>
          </Card>

          <Card className="p-4 w-[80%]">
            <CardContent>
              <h2 className="font-semibold text-lg">
                Secure online access
              </h2>
              <p className="text-sm text-muted-foreground">
                Sync your data securely with authentication and cloud storage.
              </p>
            </CardContent>
          </Card>

          <Card className="p-4 ml-auto">
            <CardContent>
              <h2 className="font-semibold text-lg">
                Minimal and fast
              </h2>
              <p className="text-sm text-muted-foreground">
                Clean UI focused on productivity, not clutter.
              </p>
            </CardContent>
          </Card>

        </div>

        {/* 🔥 BOTTOM CTA */}
        <div className="flex justify-center gap-4 pt-6">
          <Button onClick={goOnline}>
            Start Online
          </Button>
          <Button variant="secondary" onClick={goOffline}>
            Use Offline Mode
          </Button>
        </div>

      </div>
    </div>
  );
}

export default Landing;