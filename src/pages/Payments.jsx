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

  // 🔥 Helpers
  const now = new Date();

  const isSameWeek = (date) => {
    const d = new Date(date);
    const diff = now - d;
    return diff < 7 * 24 * 60 * 60 * 1000;
  };

  const isSameMonth = (date) => {
    const d = new Date(date);
    return d.getMonth() === now.getMonth() &&
           d.getFullYear() === now.getFullYear();
  };

  const isSameYear = (date) => {
    const d = new Date(date);
    return d.getFullYear() === now.getFullYear();
  };

  const paidSessions = sessions.filter(s => s.isPaid);

  const weeklyTotal = paidSessions
    .filter(s => isSameWeek(s.date))
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const monthlyTotal = paidSessions
    .filter(s => isSameMonth(s.date))
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const yearlyTotal = paidSessions
    .filter(s => isSameYear(s.date))
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const pendingSessions = sessions.filter(s => !s.isPaid);

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
          {paidSessions.slice(0, 10).map(s => (
            <div key={s._id} className="text-sm border-b border-white/10 pb-2">
              Client paid ₹{s.amount} on {new Date(s.date).toLocaleDateString()}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PENDING */}
      <Card className="bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-red-500/30">
        <CardHeader>
          <CardTitle>You haven't been paid yet</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {pendingSessions.map(s => (
            <div key={s._id} className="text-sm text-red-300 border-b border-white/10 pb-2">
              ₹{s.amount} pending from client (session on {new Date(s.date).toLocaleDateString()})
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}

export default Payments;