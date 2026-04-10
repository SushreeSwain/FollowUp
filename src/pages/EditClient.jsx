import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, updateClient } from '../services/clientService';

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

function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadClient() {
      try {
        const client = await getClientById(id);

        if (!client) {
          navigate('/not-found');
          return;
        }

        setName(client.name || '');
        setContactInfo(client.contactInfo || '');
        setInfo(client.info || '');
      } catch (err) {
        console.error(err);
        navigate('/not-found');
      }
    }

    loadClient();
  }, [id, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError('Client name is required');
      return;
    }

    try {
      await updateClient(id, {
        name: name.trim(),
        contactInfo: contactInfo.trim(),
        info: info.trim(),
      });

      navigate(`/clients/${id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to update client');
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">
            Edit Client
          </CardTitle>
          <CardDescription>
            Update client details.
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="contact">
                Contact
              </Label>
              <Input
                id="contact"
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
              onClick={() => navigate(`/clients/${id}`)}
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

export default EditClient;