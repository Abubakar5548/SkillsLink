import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      router.push('/reset-password?email=' + email);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Forgot Password</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100">
          Continue
        </button>
      </form>
    </div>
  );
}