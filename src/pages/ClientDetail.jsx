import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, deleteClient } from '../storage/clients';
import { getSessionsByClientId } from '../storage/sessions';
import { formatDate } from '../utils/formatDate';

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

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [visibleCount, setVisibleCount] = useState(3); // 👈 pagination state

  useEffect(() => {
    async function loadData() {
      const clientData = await getClientById(Number(id));
      if (!clientData) {
        navigate('/clients');
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

  // reset pagination when filter changes
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
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {client.name}
          </CardTitle>
          <CardDescription>
            Client details and session history
          </CardDescription>
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

          {/* Filter Box */}
          <div
            className="rounded-lg bg-muted p-4 cursor-pointer hover:bg-muted/80"
            onClick={() =>
              document
                .getElementById('session-date-filter')
                ?.showPicker()
            }
          >
            <label className="block mb-2 text-sm font-medium text-muted-foreground">
              Filter by date
            </label>
            <input
              id="session-date-filter"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full cursor-pointer rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          {/* Sessions Box */}
          <div className="rounded-lg bg-muted p-4 space-y-3 hover:bg-muted/80">
            {visibleSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sessions yet.
              </p>
            ) : (
              <>
                <ul className="space-y-2">
                  {visibleSessions.map((session) => (
                    <li key={session.id}>
                      <button
                        onClick={() =>
                          navigate(
                            `/clients/${client.id}/sessions/${session.id}`
                          )
                        }
                        className="w-full rounded-md bg-background px-4 py-3 text-left transition-colors hover:bg-accent"
                      >
                        <div className="font-medium">
                          {formatDate(session.date)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {session.notes || '—'}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Show more / less */}
                {filteredSessions.length > 3 && (
                  <div className="pt-2 text-center">
                    {visibleCount < filteredSessions.length ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setVisibleCount((prev) => prev + 3)
                        }
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
              </>
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
