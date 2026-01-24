import { useEffect, useState } from 'react';
import { getAllClients } from '../storage/clients';
import { useNavigate } from 'react-router-dom';


function ClientList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    async function loadClients() {
      const data = await getAllClients();
      setClients(data);
    }

    loadClients();
  }, []);

  return (
    <div>
        <h1>Clients</h1>

        {clients.length === 0 ? (
             <p>No clients yet.</p>
        ) : (
            <ul>
                {clients.map((client) => (
                     <li key={client.id}>
                        <button onClick={() => navigate(`/clients/${client.id}`)}>
                            {client.name}
                        </button>
                     </li>

                ))}
             </ul>
            )}
        </div>
    );
}

export default ClientList;
