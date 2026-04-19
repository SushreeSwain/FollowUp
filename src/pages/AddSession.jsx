import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addSession } from '../services/sessionService';
import { getClientById } from '../services/clientService';
//import { addSession } from '../services/api';
import { formatDate } from '../utils/formatDate';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClient() {
      try {
        const data = await getClientById(id);
        setClient(data);
      } catch (err) {
        console.error(err);
        navigate('/not-found');
      }
    }

    loadClient();
  }, [id, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!date || !time) {
      setError('Session date and time are required');
      return;
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const dateTime = new Date(
      `${yyyy}-${mm}-${dd}T${time}`
    );

    await addSession({
      clientId: id,
      date: dateTime.toISOString(),
      title: title.trim(),
      notes: notes.trim(),
    });

    navigate(`/clients/${id}`);
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-6">
        <Card className="w-full max-w-lg space-y-6 p-6">

          {/* HEADER */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          {/* CLIENT INFO */}
          <Skeleton className="h-4 w-full" />

          {/* DATE */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* TIME */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>

          {/* TITLE */}
          <Skeleton className="h-10 w-full" />

          {/* NOTES */}
          <Skeleton className="h-24 w-full" />

          {/* BUTTONS */}
          <div className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-28" />
          </div>

        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10 shadow-lg">
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

            <div className="space-y-1">
              <Label>Time</Label>

              <div className="flex gap-2 items-center mt-1">
                {/* HOURS (1–12) */}
                <select
                  className="border rounded-md px-2 py-1 bg-background"
                  value={(time && ((+time.split(':')[0] % 12) || 12).toString().padStart(2, '0')) || ''}
                  onChange={(e) => {
                    const minutes = time.split(':')[1] || '00';
                    const ampm = time.includes('PM') ? 'PM' : 'AM';

                    let hour = parseInt(e.target.value);

                    if (ampm === 'PM' && hour !== 12) hour += 12;
                    if (ampm === 'AM' && hour === 12) hour = 0;

                    setTime(`${String(hour).padStart(2, '0')}:${minutes}`);
                  }}
                >
                  <option value="">HH</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const val = String(i + 1).padStart(2, '0');
                    return <option key={val}>{val}</option>;
                  })}
                </select>

                {/* MINUTES */}
                <select
                  className="border rounded-md px-2 py-1 bg-background"
                  value={time.split(':')[1] || ''}
                  onChange={(e) => {
                    const hours = time.split(':')[0] || '00';
                    setTime(`${hours}:${e.target.value}`);
                  }}
                >
                  <option value="">MM</option>
                  {Array.from({ length: 60 }, (_, i) => {
                    const val = String(i).padStart(2, '0');
                    return <option key={val}>{val}</option>;
                  })}
                </select>

                {/* AM / PM */}
                <select
                  className="border rounded-md px-2 py-1 bg-background"
                  value={time && parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                  onChange={(e) => {
                    let hour = parseInt(time.split(':')[0] || '0');

                    if (e.target.value === 'PM' && hour < 12) hour += 12;
                    if (e.target.value === 'AM' && hour >= 12) hour -= 12;

                    const minutes = time.split(':')[1] || '00';
                    setTime(`${String(hour).padStart(2, '0')}:${minutes}`);
                  }}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
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

            <Button type="submit" disabled={!date || !time}>
              Save session
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default AddSession;
