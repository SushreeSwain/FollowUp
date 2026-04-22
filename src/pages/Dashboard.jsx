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

function isInRange(date, range) {
  const now = new Date();
  const d = new Date(date);

  if (range === 'today') {
    return d.toDateString() === now.toDateString();
  }

  if (range === 'week') {
    const start = new Date();
    start.setDate(now.getDate() - 7);
    return d >= start && d <= now;
  }

  if (range === 'month') {
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }

  if (range === 'year') {
    return d.getFullYear() === now.getFullYear();
  }

  return true;
}

function Dashboard() {
  const [range, setRange] = useState('today');

  const [stats, setStats] = useState({
    clients: 0,

    // lifetime
    sessions: 0,
    upcoming: 0,
    completed: 0,

    // range
    rangeSessions: 0,
    rangeUpcoming: 0,
    rangeCompleted: 0,

    // today
    todayTotal: 0,
    todayRemaining: 0,
    todayCompleted: 0,
    inProgress: 0,

    // insights
    highPriority: 0,
    noSessionClients: 0,
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const mode = localStorage.getItem('mode');

  useEffect(() => {
    async function loadStats() {
      if (mode !== 'online') return;

      try {
        const clients = await getClients();

        let totalSessions = 0;
        let upcoming = 0;
        let completed = 0;

        let rangeSessions = 0;
        let rangeUpcoming = 0;
        let rangeCompleted = 0;

        let todayTotal = 0;
        let todayRemaining = 0;
        let todayCompleted = 0;
        let inProgress = 0;

        let highPriority = 0;
        let noSessionClients = 0;

        for (const client of clients) {
          const id = client._id || client.id;
          const sessions = await getSessionsByClientId(id);

          if (client.highPriority) highPriority++;
          if (sessions.length === 0) noSessionClients++;

          sessions.forEach(s => {
            const status = getSessionStatus(s.date);
            const sessionDate = new Date(s.date);
            const now = new Date();

            const isToday =
              sessionDate.toDateString() === now.toDateString();

            // ✅ TODAY STATS (always)
            if (isToday) {
              todayTotal++;

              if (status === 'upcoming') {
                todayRemaining++;
              } else if (status === 'in-progress') {
                inProgress++;
              } else {
                todayCompleted++;
              }
            }

            // ✅ LIFETIME STATS
            totalSessions++;

            if (status === 'upcoming' || status === 'in-progress') {
              upcoming++;
            } else {
              completed++;
            }

            // ✅ RANGE STATS
            if (isInRange(s.date, range)) {
              rangeSessions++;

              if (status === 'upcoming' || status === 'in-progress') {
                rangeUpcoming++;
              } else {
                rangeCompleted++;
              }
            }
          });
        }

        setStats({
          clients: clients.length,

          sessions: totalSessions,
          upcoming,
          completed,

          rangeSessions,
          rangeUpcoming,
          rangeCompleted,

          todayTotal,
          todayRemaining,
          todayCompleted,
          inProgress,

          highPriority,
          noSessionClients,
        });

      } catch (err) {
        console.error(err);
      }
    }

    loadStats();
  }, [range]);

  function getMessage() {
    if (stats.inProgress > 0) return "Session in progress 🔥";
    if (stats.todayRemaining > 0)
      return `You have ${stats.todayRemaining} session(s) left today`;
    if (stats.todayTotal === 0) return "No sessions today 🎉";
    return "All sessions completed 👏";
  }

  function Stat({ label, value, color }) {
    return (
      <div className="p-3 rounded-md bg-background/40 text-center">
        <p className={`text-xl font-semibold ${color || ''}`}>
          {value}
        </p>
        <p className="text-sm text-muted-foreground">
          {label}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-base text-muted-foreground">
            <p><span className="text-foreground font-medium">Name:</span> {user?.name || '—'}</p>
            <p><span className="text-foreground font-medium">Email:</span> {user?.email || '—'}</p>
          </div>

          {mode === 'online' && (
            <div className="p-3 rounded-md bg-background/40 text-center font-medium">
              {getMessage()}
            </div>
          )}
        </CardContent>
      </Card>

      {mode === 'online' && (
        <>
          {/* OVERVIEW (LIFETIME) */}
          <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat label="Clients" value={stats.clients} />
              <Stat label="Sessions" value={stats.sessions} />
              <Stat label="Upcoming" value={stats.upcoming} color="text-green-500" />
              <Stat label="Completed" value={stats.completed} color="text-gray-400" />
            </CardContent>
          </Card>

          {/* RANGE CARD */}
          <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {range === 'today' && 'Today'}
                  {range === 'week' && 'Last 7 Days'}
                  {range === 'month' && 'This Month'}
                  {range === 'year' && 'This Year'}
                  {range === 'lifetime' && 'Lifetime'}
                </CardTitle>

                <select
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  className="bg-background border border-white/10 rounded-md px-3 py-1 text-sm"
                >
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>
            </CardHeader>

            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Stat label="Total" value={stats.rangeSessions} />
              <Stat label="Upcoming" value={stats.rangeUpcoming} color="text-yellow-500" />
              <Stat label="Completed" value={stats.rangeCompleted} color="text-gray-300" />
            </CardContent>
          </Card>

          {/* INSIGHTS */}
          <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Insights</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
              <Stat label="High Priority Clients" value={stats.highPriority} color="text-red-400" />
              <Stat label="Clients with no sessions yet" value={stats.noSessionClients} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default Dashboard;