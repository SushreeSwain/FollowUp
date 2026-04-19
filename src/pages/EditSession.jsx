import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById } from '../services/clientService';
import { getSessionById, updateSession } from '../services/sessionService';
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

function EditSession() {
  const { clientId, sessionId } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [date, setDate] = useState(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [clientData, sessionData] = await Promise.all([
          getClientById(clientId),
          getSessionById(sessionId),
        ]);

        if (sessionData.clientId.toString() !== clientId) {
          navigate('/not-found');
          return;
        }

        const dateObj = new Date(sessionData.date);

        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');

        setTime(`${hours}:${minutes}`);
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

    if (!date || !time) {
      setError('Date and time are required');
      return;
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const dateTime = new Date(`${yyyy}-${mm}-${dd}T${time}`);

    try {
      await updateSession(sessionId, {
        date: dateTime.toISOString(),
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
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-lg space-y-4 p-6">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          {/* Date */}
          <Skeleton className="h-10 w-full" />

          {/* Time */}
          <Skeleton className="h-10 w-full" />

          {/* Title */}
          <Skeleton className="h-10 w-full" />

          {/* Notes */}
          <Skeleton className="h-24 w-full" />

          {/* Buttons */}
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

            {/* DATE */}
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

            {/* TIME (12HR PICKER) */}
            <div className="space-y-1">
              <Label>Time</Label>

              <div className="flex gap-2 items-center">
                {/* HOURS */}
                <select
                  className="border rounded-md px-2 py-1 bg-background"
                  value={(time && ((+time.split(':')[0] % 12) || 12).toString().padStart(2, '0')) || ''}
                  onChange={(e) => {
                    const minutes = time.split(':')[1] || '00';
                    const isPM = parseInt(time.split(':')[0] || '0') >= 12;

                    let hour = parseInt(e.target.value);
                    if (isPM && hour !== 12) hour += 12;
                    if (!isPM && hour === 12) hour = 0;

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

                {/* AM PM */}
                <select
                  className="border rounded-md px-2 py-1 bg-background"
                  value={parseInt(time.split(':')[0] || '0') >= 12 ? 'PM' : 'AM'}
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

            {/* TITLE */}
            <div className="space-y-1">
              <Label>Session title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* NOTES */}
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

            <Button type="submit" disabled={!date || !time}>
              Save changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default EditSession;