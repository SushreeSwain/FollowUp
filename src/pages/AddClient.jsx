import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addClient } from '../storage/clients';

function AddClient() {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError('Client name is required');
      return;
    }

    await addClient({ name, contactInfo, info });
    navigate('/clients');
  }

  return (
    <div>
      <h1>Add Client</h1>

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
          <label>Contact Info (Phone,Email or any prefered contact method)</label><br />
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

        <button type="submit">Save Client</button>
      </form>
    </div>
  );
}

export default AddClient;
