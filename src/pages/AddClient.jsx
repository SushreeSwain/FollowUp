import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addClient } from '../storage/clients';

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

function AddClient() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError('Client name is required');
      return;
    }

    await addClient({
      name: name.trim(),
      contactInfo: contactInfo.trim(),
      info: info.trim(),
    });

    navigate('/clients');
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">
            Add Client
          </CardTitle>
          <CardDescription>
            Create a new client profile.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="space-y-1">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Client name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="contact">
                Contact
              </Label>
              <Input
                id="contact"
                placeholder="Email, phone, or any identifier"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="info">
                Info
              </Label>
              <Textarea
                id="info"
                placeholder="Notes about the client"
                rows={4}
                value={info}
                onChange={(e) => setInfo(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/clients')}
            >
              Cancel
            </Button>

            <Button type="submit">
              Save Client
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default AddClient;
