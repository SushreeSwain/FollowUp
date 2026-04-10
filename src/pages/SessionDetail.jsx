import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import { getClientById } from '../services/clientService';
import { getSessionById } from '../services/sessionService'; // ✅ FIXED IMPORT

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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

function SessionDetail() {
  const { clientId, sessionId } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [clientData, sessionData] = await Promise.all([
          getClientById(clientId),   // ✅ NO Number()
          getSessionById(sessionId), // ✅ FIXED
        ]);

        // ✅ SAFE CHECK (works for both online/offline)
        if (String(sessionData.clientId) !== String(clientId)) {
          navigate('/not-found');
          return;
        }

        setClient(clientData);
        setSession(sessionData);
      } catch (err) {
        console.error(err);
        navigate('/not-found');
      }
    }

    loadData();
  }, [clientId, sessionId, navigate]);

  if (!client || !session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">

        {/* HEADER */}
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-sm font-medium">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>

            <div>
              <CardTitle className="text-xl">
                {client.name}
              </CardTitle>
              <CardDescription>
                {formatDate(session.date)}
              </CardDescription>
            </div>
          </div>

          {session.title && (
            <p className="text-sm text-muted-foreground">
              {session.title}
            </p>
          )}
        </CardHeader>

        {/* CONTENT */}
        <CardContent>
          <div className="whitespace-pre-wrap text-sm">
            {session.notes || 'No notes recorded.'}
          </div>
        </CardContent>

        {/* ACTIONS */}
        <CardFooter className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => navigate(`/clients/${clientId}`)}
          >
            Back to Client
          </Button>

          <Button
            onClick={() =>
              navigate(
                `/clients/${clientId}/sessions/${sessionId}/edit`
              )
            }
          >
            Edit Session
          </Button>
        </CardFooter>

      </Card>
    </div>
  );
}

export default SessionDetail;