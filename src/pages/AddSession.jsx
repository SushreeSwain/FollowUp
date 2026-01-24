import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addSession } from '../storage/sessions';

function AddSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!date) {
      setError('Session date is required');
      return;
    }

    await addSession({
      clientId: Number(id),
      date,
      notes
    });

    navigate(`/clients/${id}`);
  }

  return (
    <div>
      <h1>Add Session</h1>

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

        <button type="submit">Save Session</button>
      </form>
    </div>
  );
}

export default AddSession;
