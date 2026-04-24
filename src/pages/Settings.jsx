import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { apiFetch } from '@/services/api';
import { db } from '../storage/db';
import { updateEmail, updatePassword } from '@/services/userService';
import { useToast } from '../hooks/use-toast';
import { Eye, EyeOff } from "lucide-react";

export default function Settings() {
  const mode = localStorage.getItem('mode');

  if (mode !== 'online') {
    return <OfflineSettings />;
  }

  return <OnlineSettings />;
}

/* ================= ONLINE ================= */

function OnlineSettings() {
  const { toast } = useToast();

  const [confirmText, setConfirmText] = useState('');
  const [email, setEmail] = useState('');
  const [reminders, setReminders] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, []);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast({
        title: "Error",
        description: "Type DELETE to confirm",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiFetch('/users/me', { method: 'DELETE' });

      toast({
        title: "Success",
        description: "Account deleted successfully",
      });

      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Enter a valid email",
        variant: "destructive",
      });
      return;
    }

    if (email === user.email) {
        toast({
            title: "Alert",
            description: "New email must be different",
            variant: "destructive",
        });
        return;
    }

    try {
      const res = await updateEmail(email);

      localStorage.setItem('user', JSON.stringify(res.user));

      toast({
        title: "Success",
        description: "Email updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: "Error",
        description: "Fill all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Account Info */}
      <Card className="w-full max-w-lg bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={name} disabled />
          <Input
            placeholder="Update email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleUpdateEmail} disabled={!email}>
            Update Email
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="w-full max-w-lg bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Input
                type={showCurrent ? "text" : "password"}
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <button
                type="button"
                onClick={() => setShowCurrent(prev => !prev)}
                className="absolute right-3 top-2 text-muted-foreground"
            >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            </div>

            <div className="relative">
            <Input
                type={showNew ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
                type="button"
                onClick={() => setShowNew(prev => !prev)}
                className="absolute right-3 top-2 text-muted-foreground"
            >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="w-full max-w-lg bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle>Email Reminders</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Enable email reminders
          </span>
          <Switch checked={reminders} onCheckedChange={setReminders} />
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="w-full max-w-lg bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-red-500/40 shadow-lg">
        <CardHeader>
          <CardTitle className="text-red-500">Delete Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-400">
            This action is permanent. All your clients and sessions will be deleted.
          </p>

          <Input
            placeholder="Type DELETE to confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />

          <Button variant="destructive" onClick={handleDelete}>
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= OFFLINE ================= */

function OfflineSettings() {
  const { toast } = useToast();
  const [confirmText, setConfirmText] = useState('');

  const handleClearData = async () => {
    if (confirmText !== 'DELETE') {
      toast({
        title: "Error",
        description: "Type DELETE to confirm",
        variant: "destructive",
      });
      return;
    }

    try {
      await db.delete();

      toast({
        title: "Success",
        description: "Local data cleared",
      });

      window.location.href = '/';
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to clear local data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Settings (Offline Mode)</h1>

      <Card className="w-full max-w-lg bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-yellow-500/30 shadow-lg">
        <CardHeader>
          <CardTitle>Offline Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-400">
            You are currently using offline mode. Account settings are unavailable.
          </p>

          <Input
            placeholder="Type DELETE to clear local data"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />

          <Button variant="destructive" onClick={handleClearData}>
            Clear Local Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}