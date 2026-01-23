import { useEffect, useState } from 'react';
import { getAllClients } from '../storage/clients';

function ClientList() {
  const [clients, setClients] = useState([]);

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
                        {client.name}
                    </li>
                ))}
             </ul>
            )}
        </div>
    );
}

export default ClientList;
