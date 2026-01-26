import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllClients } from '../storage/clients';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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



        <Card
        onClick={() => navigate('/clients')}
        className="
            cursor-pointer
            transition-all duration-200 ease-out
            hover:bg-card/60
            hover:shadow-md
            hover:-translate-y-[2px]
            active:scale-[0.99]
            "
        >
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>

            <CardContent>
                <div 
                className="flex items-center justify-between">
                    {/* Left: Stats */}
                    <div>
                        <p className="text-sm text-muted-foreground">Total Clients</p>
                        <p className="text-2xl font-semibold">
                            {clients.length}
                        </p>
                    </div>

                    {/* Right: Avatar strip */}
                    <div className="flex items-center">
                        {clients.slice(0, 5).map((client, index) => (
                            <Avatar
                                key={client.id}
                                className={`h-10 w-10 border border-background ${
                                    index !== 0 ? '-ml-2' : ''
                                }`}
                            >
                                <AvatarFallback className="text-xs font-medium">
                                    {getInitials(client.name)}
                                </AvatarFallback>
                            </Avatar>
                        ))}

                        {clients.length > 5 && (
                            <div className="-ml-2 h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground border border-background">
                                +{clients.length - 5}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>



        {/* Recent Clients Section (placeholder) */}
        <Card
        className="
            cursor-pointer
            transition-all duration-200 ease-out
            hover:bg-card/60
            hover:shadow-md
            hover:-translate-y-[2px]
            active:scale-[0.99]
            "
        >
        <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
            {clients.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                     No clients yet.
                </p>
            ) : (
                clients.slice(0, 5).map((client) => (
                    <div
                        key={client.id}
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="
                            flex items-center gap-4
                            rounded-md
                            bg-background
                            px-4 py-3
                            cursor-pointer
                            transition-all
                            hover:bg-card/70
                            hover:shadow-sm
                            hover:-translate-y-[3px]
                        "
                    >
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-sm font-medium">
                                {getInitials(client.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <p className="font-medium">
                                {client.name}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;
