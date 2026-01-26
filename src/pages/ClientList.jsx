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

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

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

        <Button onClick={() => navigate('/clients/new')}>
          + Add Client
        </Button>
      </div>

      {/* Avatar lineup */}
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

      {/* Client list with accordion */}
      <Accordion type="single" collapsible className="space-y-2">
        {visibleClients.map((client) => (
          <AccordionItem
            key={client.id}
            value={String(client.id)}
            className="rounded-md border border-border bg-card"
          >
            {/* Collapsed row */}
            <AccordionTrigger
              className="
                justify-start
                flex items-center gap-4
                p-3
                cursor-pointer
                transition-all duration-200 ease-out
                hover:bg-accent/60
                hover:no-underline
                hover:-translate-y-[2px]
                active:scale-[0.99]
              "
            >
            <div className="flex flex-1 items-center gap-4">
                {/* Avatar */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {getInitials(client.name)}
                </div>

                {/* Name */}
                <span className="font-medium">
                    {client.name}
                </span>
            </div>
            </AccordionTrigger>

            {/* Expanded content */}
            <AccordionContent
              className="px-4 pb-4 pt-2 cursor-pointer"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">
                    Contact:
                  </span>{' '}
                  {client.contactInfo || '—'}
                </div>

                <div>
                  <span className="font-medium text-foreground">
                    Info:
                  </span>{' '}
                  {client.info || '—'}
                </div>
              </div>

              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/clients/${client.id}/sessions/new`);
                  }}
                >
                  Schedule session
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Pagination */}
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
