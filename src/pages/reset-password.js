import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPassword() {
  const router = useRouter();
  const { email } = router.query;
  const [password, setPassword] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      router.push('/login');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Reset Password</h3>
      <form onSubmit={handleReset}>
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-success w-100">
          Reset Password
        </button>
      </form>
    </div>
  );
}