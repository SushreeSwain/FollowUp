import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById , deleteClient} from '../storage/clients';
import { getSessionsByClientId } from '../storage/sessions';


function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [sessions, setSessions] = useState([]);


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


  if (!client) {
    return <p>Loading client...</p>;
  }

  return (
    <div>
      <h1>{client.name}</h1>

      <p><strong>Contact:</strong> {client.contactInfo || '—'}</p>
      <p><strong>Info:</strong> {client.info || '—'}</p>

        <h2>Sessions</h2>

{sessions.length === 0 ? (
  <p>No sessions yet.</p>
) : (
  <ul>
    {sessions.map((session) => (
      <li key={session.id}>
        <strong>{session.date}</strong>
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
