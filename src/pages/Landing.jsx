import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import logo from '../assets/logo.svg';

function Landing() {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mode = localStorage.getItem('mode');
    const token = localStorage.getItem('token');

    if (mode === 'online' && token) {
      navigate('/app');
    }
  }, [navigate]);

  // 🔥 mouse tracking (for glow)
  useEffect(() => {
    const handleMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  function goOnline() {
    localStorage.setItem('mode', 'online');
    navigate('/login');
  }

  function goOffline() {
    localStorage.setItem('mode', 'offline');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/app');
  }

  const cards = [
    {
      title: "Track client sessions",
      desc: "Manage sessions with structured notes and timelines",
    },
    {
      title: "Offline first support",
      desc: "Work without internet your data stays local",
    },
    {
      title: "Secure online access",
      desc: "Sync data securely with authentication",
    },
    {
      title: "Minimal and fast",
      desc: "Clean UI focused on productivity",
    },
    {
      title: "Email reminders",
      desc: "Reminders you can set so you can plan the day ahead",
    },
    {
      title: "Priority based mode",
      desc: "Tag clients as high priority whenever required",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white p-6 relative overflow-hidden">

      {/* 🔥 CURSOR GLOW */}
      <div
        className="pointer-events-none fixed w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full z-0"
        style={{
          top: mouse.y - 150,
          left: mouse.x - 150,
        }}
      />

      {/* 🔥 BACKGROUND GLOW ANIMATION */}
      <motion.div
        animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] bg-purple-500/10 blur-[150px] top-[-150px] left-[-150px]"
      />

      <motion.div
        animate={{ x: [0, -60, 60, 0], y: [0, 60, -60, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[150px] bottom-[-150px] right-[-150px]"
      />

      <div className="relative z-10 mx-auto max-w-5xl space-y-12">

        {/* 🔥 BRAND */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <img
            src={logo}
            className="h-12"
          />

          {/* 🔥 GRADIENT TEXT */}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-[0.25em] bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent animate-pulse">
            FOLLOW UP
          </h1>
        </motion.div>

        {/* 🔥 BUTTONS */}
        <div className="flex justify-center gap-4">
          {[{ text: "Online", fn: goOnline }, { text: "Offline", fn: goOffline }].map((btn, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={btn.fn}
                className="bg-white text-black hover:bg-gray-100 border border-white"
              >
                {btn.text}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* 🔥 HERO */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-400 text-lg"
        >
          Manage your clients and sessions seamlessly online or offline
        </motion.p>

        {/* 🔥 CARDS */}
        <div className="grid sm:grid-cols-2 gap-6">
          {cards.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                rotateX: 5,
                rotateY: -5,
                scale: 1.03,
              }}
              className="perspective-1000"
            >
              <Card className="h-full p-5 bg-gradient-to-b from-[#18181b] to-[#0f0f10] border border-white/10 backdrop-blur-md">
                <CardContent>
                  <h2 className="font-semibold text-lg">{item.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Landing;