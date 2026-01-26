import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllClients } from '../storage/clients';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

function Home() {
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
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold">All your stats will appear here!</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your clients and recent activity
          </p>
        </div>

        {/* Overview Section */}
        <Card>
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Clients</p>
                        <p className="text-2xl font-semibold">
                            {clients.length}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>




        {/* Recent Clients Section (placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Recently added clients will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;
