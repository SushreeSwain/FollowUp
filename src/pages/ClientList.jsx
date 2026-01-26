import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllClients } from '../storage/clients';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function ClientList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadClients() {
      const data = await getAllClients();
      setClients(data);
    }

    loadClients();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>

        <Button
          onClick={() => navigate('/clients/new')}
        >
          + Add Client
        </Button>
      </div>

      {/* Placeholder for next steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Client list will appear here
          </CardTitle>
        </CardHeader>
      </Card>

    </div>
  );
}

export default ClientList;
