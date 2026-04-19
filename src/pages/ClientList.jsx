import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClients } from '../services/clientService';
import { getSessionsByClientId } from '../services/sessionService';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
}

//  NEW FUNCTION (days → months upgrade)
function getDaysAgo(date) {
  if (!date) return null;

  const today = new Date();
  const sessionDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  sessionDate.setHours(0, 0, 0, 0);

  const diffTime = today - sessionDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  //future days
  if(diffDays<0){
    const futureDays = Math.abs(diffDays);

    if(futureDays === 1) return 'Tomorrow';
    if(futureDays < 30) return `In ${futureDays} days`;

    const months = Math.floor(futureDays/30);
    return months === 1 ? 'In 1 month' : `In ${months} months`;
  }

  //Past dates
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';

  //  MONTH LOGIC
  if (diffDays >= 30) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  return `${diffDays} days ago`;
}

function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(10);
  const [search, setSearch] = useState('');
  const [lastSessions, setLastSessions] = useState({});
  const mode = localStorage.getItem('mode');

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients();
        const clientList = Array.isArray(data) ? data : [];

        const sortedClients = [...clientList].sort((a, b) => {
          // Priority first
          if (a.highPriority && !b.highPriority) return -1;
          if (!a.highPriority && b.highPriority) return 1;

          //  Then by createdAt (newest first)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setClients(sortedClients);

        // COMPUTE LAST SESSIONS
        const sessionMap = {};

        for (const client of clientList) {
          const id = client._id || client.id;

          try {
            const sessions = await getSessionsByClientId(id);

            if (sessions.length > 0) {
              const latest = sessions
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

              sessionMap[id] = latest.date;
            }
          } catch (err) {
            console.error('Session fetch error:', err);
          }
        }

        setLastSessions(sessionMap);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, []);

  // FILTER
  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(search.toLowerCase())
  );

  const visibleClients = filteredClients.slice(0, visibleCount);

  return (
    <div className="space-y-6">

      {/* Header + Search */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Clients</h1>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[220px]"
          />

          <Button onClick={() => navigate('/clients/new')}>
            + Add Client
          </Button>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-md border border-border bg-card p-3"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      ) : filteredClients.length === 0 ? (

        <Card className="mx-auto max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-lg">
              No clients found
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Try a different search or add a new client.
            </p>
          </CardHeader>
        </Card>

      ) : (
        <>
          {/* Avatar lineup */}
          <div className="flex justify-center">
            {clients.slice(0, 5).map((client, index) => {
              const id = client._id || client.id;

              return (
                <Avatar
                  key={id}
                  className={`h-12 w-12 border border-background ${
                    index !== 0 ? '-ml-2' : ''
                  }`}
                >
                  <AvatarFallback className="text-xs font-medium">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
              );
            })}
          </div>

          {/* Client list */}
          <Accordion type="single" collapsible className="space-y-2">
            {visibleClients.map((client) => {
              const id = client._id || client.id;

              return (
                <AccordionItem
                  key={id}
                  value={String(id)}
                  className="rounded-xl overflow-hidden cursor-pointer bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10 transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-[2px] active:scale-[0.99]"
                >
                  <AccordionTrigger className="flex items-center justify-between p-3 hover:bg-accent/60">

                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {getInitials(client.name)}
                      </div>

                      <div className="flex flex-col text-left">

                        {/* NAME + TAG */}
                        <div className="flex items-center">
                          <span className="font-medium">{client.name}</span>

                          {mode === 'online' && client.highPriority && (
                            <span
                              className="ml-4 relative -top-[1px] left-[1px] text-xs px-2 py-0.5 rounded-full 
                              bg-gradient-to-r from-red-400 to-red-500 
                              text-white font-medium shadow-sm"
                            >
                              High Priority
                            </span>
                          )}
                        </div>

                        {/* KEEP YOUR EXISTING TEXT BELOW */}
                        <span className="text-sm text-muted-foreground">
                          {client.sessions?.length || 0} sessions
                        </span>

                      </div>
                    </div>

                    {/* UPDATED LAST SESSION */}
                    <span className="text-xs text-muted-foreground">
                      {lastSessions[id]
                        ? ` ${getDaysAgo(lastSessions[id])}`
                        : 'No sessions yet'}
                    </span>

                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4 pt-2">
                    <div
                      onClick={() => navigate(`/clients/${id}`)}
                      className="p-3 rounded-md cursor-pointer hover:bg-accent/60"
                    >
                      <div className="text-sm text-muted-foreground space-y-2">
                        <div>
                          <span className="font-medium text-foreground">
                            Contact:
                          </span>{' '}
                          {client.contactInfo || '—'}
                        </div>

                        <div>
                          <span className="font-medium text-foreground">
                            Info:
                          </span>{' '}
                          {client.info || '—'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/clients/${id}/sessions/new`);
                        }}
                      >
                        Schedule session
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Pagination */}
          {filteredClients.length > 10 && (
            <div className="pt-4 text-center">
              {visibleCount < filteredClients.length ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                >
                  Show more clients
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleCount(10)}
                >
                  Show fewer clients
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ClientList;