import { useEffect, useState } from 'react';
import { apiFetch } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function Payments() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await apiFetch('/sessions');
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const now = new Date();

  const isSameWeek = (date) => {
    const d = new Date(date);
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return d >= start && d <= end;
  };

  const isSameMonth = (date) => {
    const d = new Date(date);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const isSameYear = (date) => {
    const d = new Date(date);
    return d.getFullYear() === now.getFullYear();
  };

  const paidSessions = sessions
    .filter((s) => s.isPaid)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const weeklyTotal = paidSessions
    .filter((s) => isSameWeek(s.date))
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const monthlyTotal = paidSessions
    .filter((s) => isSameMonth(s.date))
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const yearlyTotal = paidSessions
    .filter((s) => isSameYear(s.date))
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const pendingSessions = sessions.filter((s) => !s.isPaid);

  const pendingAmount = pendingSessions.reduce(
    (sum, s) => sum + (s.amount || 0),
    0
  );

  return (
    <div className="p-6 space-y-6">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
          <CardHeader>
            <CardTitle>Weekly</CardTitle>
          </CardHeader>
          <CardContent>₹ {weeklyTotal}</CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
          <CardHeader>
            <CardTitle>Monthly</CardTitle>
          </CardHeader>
          <CardContent>₹ {monthlyTotal}</CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
          <CardHeader>
            <CardTitle>Yearly</CardTitle>
          </CardHeader>
          <CardContent>₹ {yearlyTotal}</CardContent>
        </Card>

      </div>

      {/* RECENT PAYMENTS */}
      <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {paidSessions.slice(0, 10).map((s) => (
            <div
              key={s._id}
              className="flex items-center justify-between p-3 rounded-md bg-black/30 border border-white/10"
            >
              <div>
                <p className="text-sm font-medium">
                  {s.clientId?.name || 'Client'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.date).toLocaleDateString()}
                </p>
              </div>

              <div className="text-green-400 font-semibold">
                ₹{s.amount}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PENDING */}
      <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-red-500/30">
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>

          <p className="text-xs text-muted-foreground">
            {pendingSessions.length} unpaid sessions
          </p>

          {/* 🔥 IMPORTANT NOTE */}
          <p className="text-[11px] text-yellow-400 mt-1">
            * Pending total may be inaccurate if session amounts are not added
          </p>
        </CardHeader>

        <CardContent className="space-y-3">

          {/* Pending Total */}
          <div className="text-lg font-semibold text-red-400">
            ₹ {pendingAmount}
          </div>

          {/* List */}
          {pendingSessions.map((s) => (
            <div
              key={s._id}
              className="text-sm text-red-300 border-b border-white/10 pb-2"
            >
              ₹{s.amount || 0} pending from{' '}
              {s.clientId?.name || 'Client'} (session on{' '}
              {new Date(s.date).toLocaleDateString()})
            </div>
          ))}

        </CardContent>
      </Card>

    </div>
  );
}

export default Payments;