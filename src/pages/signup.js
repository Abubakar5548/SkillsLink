import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Signup() {
  const [form, setForm] = useState({
    regNumber: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate Reg Number format
    const regPattern = /^CST\/\d{2}\/(SWE|COM|CBS|IFT)\/\d{5}$/i;
    if (!regPattern.test(form.regNumber)) {
      alert("❌ Invalid Registration Number.");
      return;
    }

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <>
      <Head>
        <title>Sign Up – SkillLink</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" />
      </Head>
      <div
        style={{
          background: 'linear-gradient(to right, #c6e6ff, #e1f0ff)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <div className="card shadow-lg border-0 p-4" style={{ maxWidth: '450px', width: '100%', borderRadius: '1rem' }}>
          <div className="text-center">
            <img src="/buk-logo.jpg" alt="BUK Logo" width="70" className="mb-3" />
            <h4 className="text-primary fw-bold">SkillsLink</h4>
            <p className="text-muted mb-4" style={{ fontSize: '14px' }}>Create your account using your registration number</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Registration Number</label>
              <input
                type="text"
                name="regNumber"
                className="form-control"
                placeholder="CST/21/COM/00707"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label>BUK Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="yourname@buk.edu.ng"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-4">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                required
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-semibold" style={{ borderRadius: '30px' }}>
              Create Account
            </button>
            <p className="text-center mt-3" style={{ fontSize: '14px' }}>
              Already registered?{' '}
              <Link href="/login" className="text-decoration-none text-primary fw-semibold">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}