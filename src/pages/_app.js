import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';
import Link from 'next/link';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
   useEffect(() => {
   require('bootstrap/dist/js/bootstrap.bundle.min.js');
   }, []);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary" href="/">SkillsLink</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" href="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/signup">Sign Up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
