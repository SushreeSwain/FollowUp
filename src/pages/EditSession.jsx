import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById } from '../services/clientService';
import { getSessionById, updateSession } from '../services/sessionService';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
}

function EditSession() {
  const { clientId, sessionId } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [date, setDate] = useState(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [clientData, sessionData] = await Promise.all([
          getClientById(clientId),
          getSessionById(sessionId),
        ]);

        // safety check
        if (sessionData.clientId.toString() !== clientId) {
          navigate('/not-found');
          return;
        }

        setClient(clientData);
        setDate(new Date(sessionData.date));
        setTitle(sessionData.title || '');
        setNotes(sessionData.notes || '');
      } catch (err) {
        console.error(err);
        navigate('/not-found');
      }
    }

    loadData();
  }, [clientId, sessionId, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!date) {
      setError('Session date is required');
      return;
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    try {
      await updateSession(sessionId, {
        date: `${yyyy}-${mm}-${dd}`,
        title: title.trim(),
        notes: notes.trim(),
      });

      navigate(`/clients/${clientId}`);
    } catch (err) {
      console.error(err);
      setError('Failed to update session');
    }
  }

  if (!client || !date) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
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
                Editing session
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="space-y-1">
              <Label>Session date</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {formatDate(date)}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <Label>Session title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Notes</Label>
              <Textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/clients/${clientId}`)}
            >
              Cancel
            </Button>

            <Button type="submit">
              Save changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default EditSession;