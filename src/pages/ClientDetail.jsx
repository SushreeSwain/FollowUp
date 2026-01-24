import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById , deleteClient} from '../storage/clients';

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);

  useEffect(() => {
    async function loadClient() {
      const data = await getClientById(Number(id));
      setClient(data);
    }

    loadClient();
  }, [id]);

  if (!client) {
    return <p>Loading client...</p>;
  }

  return (
    <div>
      <h1>{client.name}</h1>

      <p><strong>Contact:</strong> {client.contactInfo || '—'}</p>
      <p><strong>Info:</strong> {client.info || '—'}</p>

        
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
