import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import { getClientById } from '../services/clientService';
import { getSessionById } from '../services/sessionService';
import { apiFetch } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

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

function SessionDetail() {
  const { clientId, sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [client, setClient] = useState(null);
  const [session, setSession] = useState(null);

  const [amount, setAmount] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // 🔥 Load data
  useEffect(() => {
    async function loadData() {
      try {
        const [clientData, sessionData] = await Promise.all([
          getClientById(clientId),
          getSessionById(sessionId),
        ]);

        if (String(sessionData.clientId) !== String(clientId)) {
          navigate('/not-found');
          return;
        }

        setClient(clientData);
        setSession(sessionData);
      } catch (err) {
        console.error(err);
        navigate('/not-found');
      }
    }

    loadData();
  }, [clientId, sessionId, navigate]);

  // ✅ CLEAN PREFILL LOGIC (FINAL)
  useEffect(() => {
    if (session && client) {
      setAmount(
        session.amount !== undefined && session.amount !== null
          ? session.amount
          : client.sessionPrice || 0
      );

      setIsPaid(session.isPaid || false);
    }
  }, [session, client]);

  // 🔥 Save payment
  const handlePaymentUpdate = async () => {
    try {
      setLoadingPayment(true);

      await apiFetch(`/sessions/${session._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          amount: Number(amount),
          isPaid,
        }),
      });

      toast({
        title: "Success",
        description: "Payment updated",
      });

    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingPayment(false);
    }
  };

  // 🔄 Loading skeleton
  if (!client || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-lg space-y-4 p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          <Skeleton className="h-4 w-40" />

          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[90%]" />
            <Skeleton className="h-3 w-[80%]" />
          </div>

          <div className="flex justify-between pt-4">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
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
                {formatDate(session.date)}
              </CardDescription>
            </div>
          </div>

          {session.title && (
            <p className="text-sm text-muted-foreground">
              {session.title}
            </p>
          )}
        </CardHeader>

        {/* 💰 PAYMENT SECTION */}
        <CardContent className="space-y-4 border-t border-white/10 pt-4">

          {/* Amount */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Amount (₹)</p>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            />

            {/* 💡 DEFAULT PRICE HINT */}
            <p className="text-xs text-muted-foreground">
              Default: ₹{client.sessionPrice || 0}
            </p>
          </div>

          {/* Payment Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Payment Status</p>
              <p className="text-xs text-muted-foreground">
                Mark session as paid/unpaid
              </p>
            </div>

            <Button
              variant={isPaid ? "default" : "secondary"}
              onClick={() => setIsPaid(prev => !prev)}
              className={isPaid ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isPaid ? "Paid" : "Unpaid"}
            </Button>
          </div>

          {/* Status Banner */}
          <div
            className={`rounded-md px-3 py-2 text-sm ${
              isPaid
                ? "bg-green-900/40 text-green-300 border border-green-500/20"
                : "bg-red-900/40 text-red-300 border border-red-500/20"
            }`}
          >
            {isPaid ? "Payment completed" : "Payment pending"}
          </div>

          {/* Save Button */}
          <Button
            onClick={handlePaymentUpdate}
            disabled={loadingPayment}
            className="w-full"
          >
            {loadingPayment ? "Saving..." : "Save Payment"}
          </Button>

        </CardContent>

        {/* NOTES */}
        <CardContent>
          <div className="whitespace-pre-wrap text-sm">
            {session.notes || 'No notes recorded.'}
          </div>
        </CardContent>

        {/* ACTIONS */}
        <CardFooter className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => navigate(`/clients/${clientId}`)}
          >
            Back to Client
          </Button>

          <Button
            onClick={() =>
              navigate(`/clients/${clientId}/sessions/${sessionId}/edit`)
            }
          >
            Edit Session
          </Button>
        </CardFooter>

      </Card>
    </div>
  );
}

export default SessionDetail;