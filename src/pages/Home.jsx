import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClients } from '../services/clientService';
import { getSessionsByClientId } from '../services/sessionService';
import { Skeleton } from '@/components/ui/skeleton';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
}

function getSessionStatus(date) {
  const now = new Date();
  const sessionTime = new Date(date);
  const endTime = new Date(sessionTime.getTime() + 3 * 60 * 60 * 1000);

  if (now < sessionTime) return 'upcoming';
  if (now >= sessionTime && now <= endTime) return 'in-progress';
  return 'over';
}

function Home() {
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [clientsMap, setClientsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const mode = localStorage.getItem('mode');

  useEffect(() => {
    async function loadData() {
      try {
        const clientsData = await getClients();
        setClients(clientsData);

        // 🚫 OFFLINE → skip sessions
        if (mode !== 'online') {
          setLoading(false);
          return;
        }

        const map = {};
        const allSessions = [];

        for (const client of clientsData) {
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
        console.error("API ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const highPrioritySessions = sessions
  .filter(s => {
    const client = clientsMap[s.clientId];
    if (!client?.highPriority) return false;

    const status = getSessionStatus(s.date);

    //REMOVE COMPLETED SESSIONS
    return status !== 'over';
  })
  .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* TITLE */}
        <div>
          <h1 className="text-2xl font-semibold">
            All your stats will appear here!
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of your clients and recent activity
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        ) : (
          <>
            {/* 🔥 ONLINE ONLY */}
            {mode === 'online' && (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  High Priority Sessions
                </h2>

                {highPrioritySessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No high priority sessions.
                  </p>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {highPrioritySessions.map((session) => {
                      const client = clientsMap[session.clientId];
                      const status = getSessionStatus(session.date);
                      const isActive = status === 'in-progress';

                      return (
                        <div
                          key={session._id || session.id}
                          onClick={() =>
                            navigate(`/clients/${session.clientId}/sessions/${session._id || session.id}`)
                          }
                          className={`min-w-[300px] p-5 rounded-xl border border-white/10 cursor-pointer transition
                            bg-gradient-to-b from-[#0f0f10] to-[#18181b]
                            ${isActive 
                            ? 'border-yellow-400 shadow-lg shadow-yellow-500/20' 
                            : 'hover:shadow-md hover:-translate-y-[2px]'}
                            `}
                        >
                          <div className="text-lg font-semibold">
                            {client?.name}
                          </div>

                          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-red-400 to-red-500 text-white">
                            High Priority
                          </span>

                          <div className="text-sm mt-3 text-muted-foreground">
                            {new Date(session.date).toLocaleString()}
                          </div>

                          <div
                            className={`mt-2 text-sm font-medium ${
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
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ORIGINAL UI (UNCHANGED) */}

            <Card 
              onClick={() => navigate('/clients')}
              className="cursor-pointer bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10 transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-[2px] active:scale-[0.99]"
            >
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Clients
                    </p>
                    <p className="text-2xl font-semibold">
                      {clients.length}
                    </p>
                  </div>

                  <div className="flex items-center">
                    {clients.slice(0, 5).map((client, index) => (
                      <Avatar
                        key={client._id}
                        className={`h-10 w-10 border border-background ${
                          index !== 0 ? '-ml-2' : ''
                        }`}
                      >
                        <AvatarFallback className="text-xs font-medium">
                          {getInitials(client.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}

                    {clients.length > 5 && (
                      <div className="-ml-2 h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground border border-background">
                        +{clients.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10 transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-[2px] active:scale-[0.99]">
              <CardHeader>
                <CardTitle>Recent Clients</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                {clients.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No clients yet.
                  </p>
                ) : (
                  clients.slice(0, 5).map((client) => (
                    <div
                      key={client._id}
                      onClick={() =>
                        navigate(`/clients/${client._id}`)
                      }
                      className="flex items-center gap-4 rounded-md bg-background px-4 py-3 cursor-pointer transition-all hover:bg-card/70 hover:shadow-sm hover:-translate-y-[3px]"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm font-medium">
                          {getInitials(client.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <p className="font-medium">
                          {client.name}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

          </>
        )}
      </div>
    </div>
  );
}

export default Home;