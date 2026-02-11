import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, deleteClient } from '../storage/clients';
import { getSessionsByClientId } from '../storage/sessions';
import { formatDate } from '../utils/formatDate';

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

  useEffect(() => {
    async function loadData() {
      const numericId = Number(id);

      if (!id || isNaN(numericId)) {
      navigate('/not-found');
      return;
    }

    const clientData = await getClientById(numericId);

    if (!clientData) {
        navigate('/not-found');
        return;
    }

      const sessionData = await getSessionsByClientId(Number(id));
      setClient(clientData);
      setSessions(sessionData);
    }

    loadData();
  }, [id, navigate]);

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
                </CardTitle>
                <CardDescription>
                    Client details and session history
                </CardDescription>
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
                navigate(`/clients/${client.id}/sessions/new`)
              }
            >
              Add Session
            </Button>
          </div>

          {/* Calendar Filter */}
          <div className="rounded-lg bg-muted p-4 hover:bg-muted/80 transition-colors">
            <label className="block mb-2 text-sm font-medium text-muted-foreground">
              Filter by date
            </label>

            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start text-left font-normal"
                  >
                    {searchDate ? formatDate(searchDate) : 'Pick a date'}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
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
                    initialFocus
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

          {/* Sessions Box */}
          <div className="rounded-lg bg-muted p-4 hover:bg-muted/80">
            {visibleSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sessions yet.
              </p>
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {visibleSessions.map((session) => (
                  <AccordionItem
                    key={session.id}
                    value={String(session.id)}
                    className="rounded-md border border-border bg-background px-3"
                  >
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="flex flex-col text-left">
                        <span className="font-medium">
                          {formatDate(session.date)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {session.title || 'Session'}
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pb-4 text-sm text-muted-foreground">
                      <p className="whitespace-pre-wrap">
                        {session.notes || '—'}
                      </p>

                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/clients/${client.id}/sessions/${session.id}/edit`
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
                              `/clients/${client.id}/sessions/${session.id}`
                            )
                          }
                        >
                          Open session
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
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
                navigate(`/clients/${client.id}/edit`)
              }
            >
              Edit Client
            </Button>

            <Button
              variant="destructive"
              onClick={async () => {
                const confirmDelete = window.confirm(
                  'Are you sure you want to delete this client?'
                );
                if (!confirmDelete) return;

                await deleteClient(client.id);
                navigate('/clients');
              }}
            >
              Delete Client
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ClientDetail;
