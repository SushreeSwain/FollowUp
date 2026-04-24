import { useState } from 'react';

export default function Settings() {
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      alert('Type DELETE to confirm');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('https://followup-backend-90z3.onrender.com/api/users/me', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete account');
      }

      // logout after delete
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="border p-4 rounded-lg">
        <h2 className="text-lg font-medium text-red-400 mb-2">
          Delete Account
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          This action is permanent. All your clients and sessions will be deleted.
        </p>

        <input
          type="text"
          placeholder="Type DELETE to confirm"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="border p-2 w-full mb-3 rounded text-black"
        />

        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}