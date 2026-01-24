import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, updateClient } from '../storage/clients';

function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadClient() {
      const client = await getClientById(Number(id));
      if (!client) {
        navigate('/clients');
        return;
      }

      setName(client.name);
      setContactInfo(client.contactInfo);
      setInfo(client.info);
    }

    loadClient();
  }, [id, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError('Client name is required');
      return;
    }

    await updateClient(Number(id), {
      name,
      contactInfo,
      info
    });

    navigate(`/clients/${id}`);
  }

  return (
    <div>
      <h1>Edit Client</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label><br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Contact Info</label><br />
          <input
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
          />
        </div>

        <div>
          <label>Info</label><br />
          <textarea
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditClient;
