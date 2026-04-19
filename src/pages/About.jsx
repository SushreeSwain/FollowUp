import { useEffect, useState } from 'react';
import { getClients } from '../services/clientService';
import { getSessionsByClientId } from '../services/sessionService';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function getSessionStatus(date) {
  const now = new Date();
  const sessionTime = new Date(date);
  const endTime = new Date(sessionTime.getTime() + 3 * 60 * 60 * 1000);

  if (now < sessionTime) return 'upcoming';
  if (now >= sessionTime && now <= endTime) return 'in-progress';
  return 'over';
}

function About() {
  const [stats, setStats] = useState({
    clients: 0,
    sessions: 0,
    upcoming: 0,
    completed: 0,
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const mode = localStorage.getItem('mode');

  useEffect(() => {
    async function loadStats() {
      try {
        const clients = await getClients();

        let totalSessions = 0;
        let upcoming = 0;
        let completed = 0;

        for (const client of clients) {
          const id = client._id || client.id;
          const sessions = await getSessionsByClientId(id);

          totalSessions += sessions.length;

          sessions.forEach(s => {
            const status = getSessionStatus(s.date);

            if (status === 'upcoming' || status === 'in-progress') {
              upcoming++;
            } else {
              completed++;
            }
          });
        }

        setStats({
          clients: clients.length,
          sessions: totalSessions,
          upcoming,
          completed,
        });

      } catch (err) {
        console.error(err);
      }
    }

    if (mode === 'online') {
      loadStats();
    }
  }, []);

  return (
    <div className="min-h-screen p-6 space-y-6">

      {/* 1️⃣ DASHBOARD */}
      <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Your Dashboard</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">

          <div className="text-base text-muted-foreground">
            <p><span className="text-foreground font-medium">Name:</span> {user?.name || '—'}</p>
            <p><span className="text-foreground font-medium">Email:</span> {user?.email || '—'}</p>
          </div>

          {/* 🔥 ONLY ONLINE */}
          {mode === 'online' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">

              <div className="p-3 rounded-md bg-background/40 text-center">
                <p className="text-xl font-semibold">{stats.clients}</p>
                <p className="text-sm text-muted-foreground">Clients</p>
              </div>

              <div className="p-3 rounded-md bg-background/40 text-center">
                <p className="text-xl font-semibold">{stats.sessions}</p>
                <p className="text-sm text-muted-foreground">Sessions</p>
              </div>

              <div className="p-3 rounded-md bg-background/40 text-center">
                <p className="text-xl font-semibold text-green-500">{stats.upcoming}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>

              <div className="p-3 rounded-md bg-background/40 text-center">
                <p className="text-xl font-semibold text-gray-400">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>

            </div>
          )}

          {/* 🔥 OFFLINE MESSAGE */}
          {mode !== 'online' && (
            <p className="text-sm text-muted-foreground pt-2">
              Stats are available in online mode.
            </p>
          )}

        </CardContent>
      </Card>

      {/* 2️⃣ ONLINE vs OFFLINE */}
      <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Online vs Offline Mode</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 text-base">

          <div>
            <p className="font-medium mb-1">Online Mode</p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Cloud sync (MongoDB Atlas)</li>
              <li>Access across devices</li>
              <li>High Priority tagging</li>
              <li>Sessions dashboard & live tracking</li>
              <li>Future: email reminders, analytics</li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-1">Offline Mode</p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Data stored locally (IndexedDB)</li>
              <li>No internet required</li>
              <li>Lightweight and fast</li>
              <li>Limited features (no priority, no sync)</li>
            </ul>
          </div>

        </CardContent>
      </Card>

      {/* 3️⃣ STORY */}
      <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Why FollowUp?</CardTitle>
        </CardHeader>

        <CardContent className="text-base text-muted-foreground space-y-4">

          <p>
            FollowUp was built to solve a simple but real problem —
            keeping track of client interactions without losing context.
          </p>

          <p>
            Whether you're a tutor, therapist, or freelancer, remembering
            sessions, notes, and timelines can quickly become overwhelming.
          </p>

          <p>
            This project started as a learning journey, but evolved into a
            full system combining offline-first storage, real-time session
            tracking, and clean UI/UX.
          </p>

          <p>
            Built with patience, bugs, rewrites, and way too many debugging
            sessions, FollowUp is both a tool and a milestone.
          </p>

        </CardContent>
      </Card>

      {/* 4️⃣ CONTACT */}
      <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Contact Us</CardTitle>
        </CardHeader>

        <CardContent className="text-base text-muted-foreground space-y-4">

          <p>
            FollowUp was built to solve a simple but real problem,
            keeping track of client interactions without losing context.
            You can check out more of my work on{' '}
            <a
              href="https://github.com/SushreeSwain"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80"
            >
              GitHub
            </a>.
          </p>

          <p>
            Whether you're a tutor, therapist, or freelancer, remembering
            sessions, notes, and timelines can quickly become overwhelming.
            Feel free to connect with me on{' '}
            <a
              href="https://www.linkedin.com/in/sushree-swain/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80"
            >
              LinkedIn
            </a>.
          </p>

        </CardContent>
      </Card>

    </div>
  );
}

export default About;