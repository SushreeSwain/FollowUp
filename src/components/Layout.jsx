import NavBar from './NavBar';

function Layout({ children }) {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-background">
        {children}
      </main>
    </>
  );
}


export default Layout;
