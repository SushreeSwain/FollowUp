import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import { getClientById, deleteClient } from '../services/clientService';
import { getSessionsByClientId } from '../services/sessionService';
import { updateClient } from '../services/clientService';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

// 🔥 NEW IMPORT
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
}

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [sessions, setSessions] = useState([]);

  const [searchDate, setSearchDate] = useState('');
  const [calendarDate, setCalendarDate] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [updatingPriority, setUpdatingPriority] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const clientData = await getClientById(id);
        const sessionData = await getSessionsByClientId(id);

        setClient(clientData);
        setSessions(Array.isArray(sessionData) ? sessionData : []);
      } catch (err) {
        console.error("ERROR:", err);
        navigate('/clients');
      }
    }

    loadData();
  }, [id, navigate]);

  const clientId = client?._id || client?.id;

  const filteredSessions = searchDate
    ? sessions.filter((session) => session.date === searchDate)
    : sessions;

  useEffect(() => {
    setVisibleCount(3);
  }, [searchDate]);

  const visibleSessions = filteredSessions.slice(0, visibleCount);

  if (!client) {
    return <p>Loading client...</p>;
  }

  return (
    <div className="min-h-screen bg-muted p-6">
      <Card className="mx-auto max-w-3xl bg-card/90 border border-border shadow-sm">

        {/* HEADER */}
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold">
              {client.name}
              {client.highPriority && (
                <span className="ml-2 relative -top-[2px] left-[1px] text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-red-400 to-red-500 text-white font-medium shadow-sm">
                  High Priority
                </span>
              )}
            </CardTitle>

            <CardDescription>
              Client details and session history
            </CardDescription>

              {/*  PRIORITY BUTTON */}
              <div className="flex items-center gap-2 mt-2">
                <Button
                  size="sm"
                  className="h-8 px-3 text-sm rounded-md"
                  variant={client.highPriority ? "destructive" : "outline"}
                  disabled={updatingPriority}
                  onClick={async () => {
                    try {
                      setUpdatingPriority(true);

                      const updated = !client.highPriority;

                      await updateClient(clientId, {
                        highPriority: updated,
                      });

                      setClient(prev => ({
                        ...prev,
                        highPriority: updated,
                      }));

                    } catch (err) {
                      console.error("Priority update failed:", err);
                    } finally {
                      setUpdatingPriority(false);
                    }
                  }}
                >
                  {client.highPriority ? "High Priority" : "Mark High Priority"}
                </Button>
              </div>
            </div>

          <Avatar className="h-24 w-24">
            <AvatarImage src={client.avatar || ''} />
            <AvatarFallback className="text-xl font-medium">
              {getInitials(client.name)}
            </AvatarFallback>
          </Avatar>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="space-y-6">

          {/* Client Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Contact</p>
              <p className="text-base">
                {client.contactInfo || '—'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-base">
                {client.info || '—'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Sessions Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Sessions ({filteredSessions.length})
            </h2>

            <Button
              size="sm"
              onClick={() =>
                navigate(`/clients/${clientId}/sessions/new`)
              }
            >
              Add Session
            </Button>
          </div>

          {/* Calendar Filter */}
          <div className="rounded-lg bg-muted p-4">
            <label className="block mb-2 text-sm font-medium text-muted-foreground">
              Filter by date
            </label>

            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start">
                    {searchDate ? formatDate(searchDate) : 'Pick a date'}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={(date) => {
                      setCalendarDate(date);

                      if (date) {
                        const yyyy = date.getFullYear();
                        const mm = String(date.getMonth() + 1).padStart(2, '0');
                        const dd = String(date.getDate()).padStart(2, '0');
                        setSearchDate(`${yyyy}-${mm}-${dd}`);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>

              {searchDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchDate('');
                    setCalendarDate(null);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Sessions */}
          <div className="rounded-lg bg-muted p-4">
            {visibleSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sessions yet.
              </p>
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {visibleSessions.map((session) => {
                  const sessionId = session._id || session.id;

                  return (
                    <AccordionItem
                      key={sessionId}
                      value={String(sessionId)}
                      className="rounded-md border border-border bg-background px-3"
                    >
                      <AccordionTrigger className="py-3">
                        <div className="flex flex-col text-left">
                          <span className="font-medium">
                            {formatDate(session.date)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {session.title || 'Session'}
                          </span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="pb-4 text-sm">
                        <p>{session.notes || '—'}</p>

                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate(
                                `/clients/${clientId}/sessions/${sessionId}/edit`
                              )
                            }
                          >
                            Edit session
                          </Button>

                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              navigate(
                                `/clients/${clientId}/sessions/${sessionId}`
                              )
                            }
                          >
                            Open session
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}

            {filteredSessions.length > 3 && (
              <div className="pt-3 text-center">
                {visibleCount < filteredSessions.length ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleCount((prev) => prev + 3)}
                  >
                    Show more sessions
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleCount(3)}
                  >
                    Show fewer sessions
                  </Button>
                )}
              </div>
            )}
          </div>

        </CardContent>

        {/* FOOTER */}
        <CardFooter className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => navigate('/clients')}
          >
            Back to Clients
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                navigate(`/clients/${clientId}/edit`)
              }
            >
              Edit Client
            </Button>

            {/* 🔥 NEW DELETE DIALOG */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Delete Client
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete Client?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this client and all related sessions.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={async () => {
                      await deleteClient(clientId);
                      navigate('/clients', { replace: true });
                      window.location.reload();
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </div>
        </CardFooter>

      </Card>
    </div>
  );
}

export default ClientDetail;