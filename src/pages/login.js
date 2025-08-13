import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [regNumber, setRegNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ regNumber, email, password })
  });

  const data = await res.json();

  if (res.ok) {
    // ✅ Save user data in localStorage
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('regNumber', data.regNumber);
    localStorage.setItem('email', data.email);
    localStorage.setItem('name', data.name);

    // Redirect to dashboard
    router.push('/dashboard');
  } else {
    setError(data.message);
  }
};


  return (
    <>
      <Head>
        <title>Login – SkillLink</title>
      </Head>

      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="text-center mb-3">
            <img src="/buk-logo.jpg" alt="BUK" width="50" />
            <h4 className="mt-2">Login – BUK Students</h4>
          </div>

          <form onSubmit={handleLogin}>
            {error && <p className="text-danger">{error}</p>}

            <div className="mb-3">
              <label>Registration Number</label>
              <input
                type="text"
                className="form-control"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>

            <p className="text-center mt-3">
              Don`t have an account? <Link href="/signup">Signup</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}