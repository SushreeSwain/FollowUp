import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addSession } from '../storage/sessions';


function AddSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');


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

    await addSession({
        clientId: Number(id),
        date,
        title: finalTitle,
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

        <button type="submit">Save Session</button>
      </form>
    </div>
  );
}

export default AddSession;
