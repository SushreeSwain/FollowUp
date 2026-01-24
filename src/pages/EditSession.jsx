import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById, updateSession } from '../storage/sessions';

function EditSession() {
  const { clientId, sessionId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
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
    }

    loadSession();
  }, [sessionId, clientId, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!date) {
      setError('Session date is required');
      return;
    }

    await updateSession(Number(sessionId), {
      date,
      notes
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
