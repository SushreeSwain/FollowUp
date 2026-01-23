import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <Link to="/">Home</Link> |{' '}
      <Link to="/clients">Clients</Link> |{' '}
      <Link to="/clients/new">Add Client</Link>
    </nav>
  );
}

export default NavBar;
