import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById, updateSession } from '../storage/sessions';

function EditSession() {
  const { clientId, sessionId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSession() {
      const session = await getSessionById(Number(sessionId));
      if (!session) {
        navigate(`/clients/${clientId}`);
        return;
      }

      setDate(session.date);
      setNotes(session.notes || '');
      setTitle(session.title || '');
    }

    loadSession();
  }, [sessionId, clientId, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!date) {
      setError('Session date is required');
      return;
    }

    const finalTitle =
      title.trim() ||
      notes
        .trim()
        .split(' ')
        .slice(0, 5)
        .join(' ') ||
      'Session';

    await updateSession(Number(sessionId), {
      date,
      title: finalTitle,
      notes,
      updatedAt: new Date().toISOString(),
    });

    navigate(`/clients/${clientId}/sessions/${sessionId}`);
  }

  return (
    <div>
      <h1>Edit Session</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Date</label><br />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">
            Session title <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. About mom"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label>Notes</label><br />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditSession;
