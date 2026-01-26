import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllClients } from '../storage/clients';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardHeader,
  CardTitle,
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

function ClientList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(10);
  const visibleClients = clients.slice(0, visibleCount);


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

    <div className="flex justify-center">
        {clients.slice(0, 5).map((client, index) => (
            <Avatar
                key={client.id}
                className={`h-12 w-12 border border-background ${
                    index !== 0 ? '-ml-2' : ''
                }`}
            >
                <AvatarFallback className="text-xs font-medium">
                    {getInitials(client.name)}
                </AvatarFallback>
            </Avatar>
        ))}
    
        {clients.length > 5 && (
            <div className="-ml-2 h-12 w-12 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground border border-background">
                +{clients.length - 5}
            </div>
        )}
    </div>
       

    <div className="space-y-2">
        {visibleClients.map((client) => (
            <div
                key={client.id}
                className="
                    flex items-center gap-4
                    rounded-md
                    border border-border
                    bg-card
                    p-3
                    cursor-pointer
                    transition-all duration-200 ease-out
                    hover:bg-accent/60
                    hover:-translate-y-[2px]
                    active:scale-[0.99]
                    "
                >
                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {client.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                    </div>

                    {/* Name */}
                    <span className="font-medium">
                        {client.name}
                    </span>
            </div>
            ))}
        </div>


    {clients.length > 10 && (
  <div className="pt-4 text-center">
    {visibleCount < clients.length ? (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setVisibleCount((prev) => prev + 10)}
      >
        Show more clients
      </Button>
    ) : (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setVisibleCount(10)}
      >
        Show fewer clients
      </Button>
    )}
  </div>
)}


    </div>
  );
}

export default ClientList;
