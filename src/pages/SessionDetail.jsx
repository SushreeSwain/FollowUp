import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById, deleteSession } from '../storage/sessions';
import { formatDate } from '../utils/formatDate';


function SessionDetail() {
  const { clientId, sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function loadSession() {
      const data = await getSessionById(Number(sessionId));
      if (!data) {
        navigate(`/clients/${clientId}`);
        return;
      }
      setSession(data);
    }

    loadSession();
  }, [sessionId, clientId, navigate]);

  if (!session) {
    return <p>Loading session...</p>;
  }

  return (
    <div>
      <h1>Session on {formatDate(session.date)}</h1>

      <p>{session.notes || '—'}</p>

      <button
        onClick={() =>
          navigate(
            `/clients/${clientId}/sessions/${sessionId}/edit`
          )
        }
      >
        Edit Session
      </button>

      <button
        onClick={async () => {
          const ok = window.confirm(
            'Delete this session? This cannot be undone.'
          );
          if (!ok) return;

          await deleteSession(session.id);
          navigate(`/clients/${clientId}`);
        }}
      >
        Delete Session
      </button>

      <button onClick={() => navigate(`/clients/${clientId}`)}>
        Back to Client
      </button>
    </div>
  );
}

export default SessionDetail;
