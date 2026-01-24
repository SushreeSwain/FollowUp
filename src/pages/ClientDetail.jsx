import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById , deleteClient} from '../storage/clients';
import { getSessionsByClientId } from '../storage/sessions';
import { formatDate } from '../utils/formatDate';


function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [searchDate, setSearchDate] = useState('');



  useEffect(() => {
  async function loadData() {
    const clientData = await getClientById(Number(id));
    if (!clientData) {
      navigate('/clients');
      return;
    }

    const sessionData = await getSessionsByClientId(Number(id));

    setClient(clientData);
    setSessions(sessionData);
  }

  loadData();
}, [id, navigate]);

    const filteredSessions = searchDate
        ? sessions.filter((session) => session.date === searchDate)
        : sessions;

  if (!client) {
    return <p>Loading client...</p>;
  }

  return (
    <div>
      <h1>{client.name}</h1>

      <p><strong>Contact:</strong> {client.contactInfo || '—'}</p>
      <p><strong>Info:</strong> {client.info || '—'}</p>

        <h2>Sessions</h2>
        <h3>Total Recorded Sessions: {sessions.length}</h3>

        <button onClick={() => navigate(`/clients/${client.id}/sessions/new`)}>
            Add Session
        </button>

        <div>
            <label>Filter by date</label><br />
                <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                />
            </div>


        {filteredSessions.length === 0 ? (
             <p>No sessions yet.</p>
        ) : (
            <ul>
                {filteredSessions.map((session) => (
                    <li key={session.id}>
                        <button
                            onClick={() =>
                                navigate(`/clients/${client.id}/sessions/${session.id}`)
                            }
                        >
                            <strong>{formatDate(session.date)}</strong>
                        </button>
                        <div>{session.notes || '—'}</div>
                    </li>

                ))}
            </ul>
        )}


        
        <button onClick={() => navigate(`/clients/${client.id}/edit`)}>
            Edit Client
        </button>

        <button
            onClick={async () => {
                const confirmDelete = window.confirm(
                    'Are you sure you want to delete this client? This action cannot be undone.'
                );

                if (!confirmDelete) return;

                await deleteClient(client.id);
                navigate('/clients');
            }}
        >
            Delete Client
        </button>


      <button onClick={() => navigate('/clients')}>
            Back to Clients
      </button>
    </div>
  );
}

export default ClientDetail;
