import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getClients } from '../services/clientService';
import { getSessionsByClientId } from '../services/sessionService';
import { formatDate } from '../utils/formatDate';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function getSessionStatus(date) {
  const now = new Date();
  const sessionTime = new Date(date);
  const endTime = new Date(sessionTime.getTime() + 3 * 60 * 60 * 1000);

  if (now < sessionTime) return 'upcoming';
  if (now >= sessionTime && now <= endTime) return 'in-progress';
  return 'over';
}

function Sessions() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [clientsMap, setClientsMap] = useState({});
  const [loading, setLoading] = useState(true); 
  const [tick, setTick] = useState(0);
  const mode = localStorage.getItem('mode');

  // BLOCK OFFLINE
  if (mode !== 'online') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Sessions only available in online mode</p>
      </div>
    );
  }

  // LIVE UPDATE
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // FETCH DATA
  useEffect(() => {
    async function loadData() {
      try {
        const clients = await getClients();

        const map = {};
        const allSessions = [];

        for (const client of clients) {
          const id = client._id || client.id;
          map[id] = client;

          const clientSessions = await getSessionsByClientId(id);

          clientSessions.forEach(s => {
            allSessions.push({
              ...s,
              clientId: id,
            });
          });
        }

        setClientsMap(map);
        setSessions(allSessions);
      } catch (err) {
        console.error("Sessions load error:", err);
      } finally {
        setLoading(false); // IMPORTANT
      }
    }

    loadData();
  }, []);

  // SORT
  const sortedSessions = sessions
    .filter(s => s.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // SKELETON UI
  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-3xl space-y-4">

          <Skeleton className="h-6 w-40 mb-4" />

          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6"> {/*  REMOVED bg-muted */}
      <div className="mx-auto max-w-3xl space-y-3">

        <h1 className="text-2xl font-semibold mb-4">
          Sessions
        </h1>

        {sortedSessions.length === 0 ? (
          <p className="text-muted-foreground">
            No sessions yet.
          </p>
        ) : (
          sortedSessions.map((session) => {
            const client = clientsMap[session.clientId];
            const status = getSessionStatus(session.date);

            return (
              <Card
                key={session._id || session.id}
                className="p-4 flex items-center justify-between cursor-pointer 
                bg-gradient-to-b from-[#0f0f10] to-[#18181b] 
                border border-white/10 
                transition-all duration-200 ease-out 
                hover:shadow-lg hover:-translate-y-[2px] active:scale-[0.99] backdrop-blur"
                onClick={() =>
                  navigate(`/clients/${session.clientId}/sessions/${session._id || session.id}`)
                }
              >
                {/* LEFT */}
                <div className="font-medium">
                  {client?.name || 'Unknown'}

                  {client?.highPriority && (
                    <span className="ml-2 relative -top-[1px] text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-red-400 to-red-500 text-white">
                      High Priority
                    </span>
                  )}
                </div>

                {/* CENTER */}
                <div className="text-sm text-muted-foreground">
                  {formatDate(session.date)}
                </div>

                {/* RIGHT */}
                <div
                  className={`text-sm font-medium ${
                    status === 'upcoming'
                      ? 'text-green-600'
                      : status === 'in-progress'
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                  }`}
                >
                  {status === 'upcoming' && 'Upcoming'}
                  {status === 'in-progress' && 'In Progress'}
                  {status === 'over' && 'Session Over'}
                </div>
              </Card>
            );
          })
        )}

      </div>
    </div>
  );
}

export default Sessions;