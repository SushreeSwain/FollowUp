import { useEffect, useState } from 'react';
import { getAllClients } from '../storage/clients';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadClients() {
      const data = await getAllClients();
      setClients(data);
    }

    loadClients();
  }, []);

  const recentClients = clients.slice(0, 5);

  return (
    <div>
      <h1>Home</h1>

      <p><strong>Total Clients:</strong> {clients.length}</p>

      <h2>Recently Added</h2>

      {recentClients.length === 0 ? (
        <p>No clients yet.</p>
      ) : (
        <ul>
          {recentClients.map((client) => (
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

export default Home;