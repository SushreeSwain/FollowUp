import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { apiFetch } from '@/services/api';
import { db } from '../storage/db'; 
import { updateEmail } from '@/services/userService';
import { updatePassword } from '@/services/userService';

export default function Settings() {
  const mode = localStorage.getItem('mode');

  if (mode !== 'online') {
    return <OfflineSettings />;
  }

  return <OnlineSettings />;
}

/* ================= ONLINE ================= */

function OnlineSettings() {
  const [confirmText, setConfirmText] = useState('');
  const [email, setEmail] = useState('');
  const [reminders, setReminders] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
      }
    }, []);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      alert('Type DELETE to confirm');
      return;
    }

    try {
      await apiFetch('/users/me', {
        method: 'DELETE',
      });

      alert('Account deleted successfully');
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateEmail = async () => {
    if (!email) {
        alert('Enter email');
        return;
    }

    try {
        const res = await updateEmail(email);

        // 🔥 IMPORTANT: update localStorage
        localStorage.setItem('user', JSON.stringify(res.user));

        alert('Email updated successfully');
      } catch (err) {
        alert(err.message);
      }
    };

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword) {
            alert('Fill all fields');
            return;
        }

        try {
            await updatePassword(currentPassword, newPassword);

            alert('Password updated successfully');

            // optional: clear inputs
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            alert(err.message);
        }
    };

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* 🧾 Account Info */}
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
          <Button variant="outline" onClick={handleUpdateEmail} disabled={!email}>
            Update Email
          </Button>
        </CardContent>
      </Card>

      {/* 🔐 Security */}
      <Card className="w-full max-w-lg bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button variant="outline" onClick={handleUpdatePassword} disabled={!currentPassword || !newPassword}>
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* ⚙️ Preferences */}
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

      {/* 🧨 Danger Zone */}
      <Card className="w-full max-w-lg bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-red-500/40 shadow-lg">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
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
  const [confirmText, setConfirmText] = useState('');

  const handleClearData = async () => {
    if (confirmText !== 'DELETE') {
      alert('Type DELETE to confirm');
      return;
    }

    try {
      console.log("REAL DB:", db); // should now be Dexie instance

      await db.delete();

      alert('Local data cleared');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert('Failed to clear local data');
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