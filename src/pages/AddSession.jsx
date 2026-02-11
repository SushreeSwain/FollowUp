import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById } from '../storage/clients';
import { addSession } from '../storage/sessions';
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

function AddSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);

  const [date, setDate] = useState(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadClient() {

       const numericId = Number(id);

        if (!id || isNaN(numericId)) {
            navigate('/not-found');
            return;
        }
 
      const data = await getClientById(Number(id));
      if (!data) {
        navigate('/clients');
        return;
      }
      setClient(data);
    }

    loadClient();
  }, [id, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!date) {
      setError('Session date is required');
      return;
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    await addSession({
      clientId: Number(id),
      date: `${yyyy}-${mm}-${dd}`,
      title: title.trim(),
      notes: notes.trim(),
    });

    navigate(`/clients/${id}`);
  }

  if (!client) {
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
                {client.contactInfo || 'No contact info'}
              </CardDescription>
            </div>
          </div>

          {client.info && (
            <p className="text-sm text-muted-foreground">
              {client.info}
            </p>
          )}
        </CardHeader>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

            {/* Date */}
            <div className="space-y-1">
              <Label>Session date</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {date ? formatDate(date) : 'Pick a date'}
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

            {/* Title */}
            <div className="space-y-1">
              <Label>
                Session title{' '}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                placeholder="e.g. About family"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <Label>Notes</Label>
              <Textarea
                rows={4}
                placeholder="Session notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>

          {/* ACTIONS */}
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/clients/${id}`)}
            >
              Cancel
            </Button>

            <Button type="submit">
              Save session
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default AddSession;
