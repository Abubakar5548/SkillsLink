import Head from 'next/head';
import { useState } from 'react';

export default function About() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <Head>
        <title>About Me – SkillLink</title>
      </Head>

      {/* ===== Page Wrapper ===== */}
      <div
        className={`min-vh-100 ${darkMode ? 'dark-mode' : ''}`}
        style={{
          background: darkMode
            ? 'linear-gradient(135deg, #0f172a, #020617)'
            : 'linear-gradient(135deg, #f8f9ff, #eef2ff)'
        }}
      >
        <div className="container py-5">

          {/* 🌙 Dark Mode Toggle */}
          <div className="text-end mb-3">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {/* ===== Header ===== */}
          <div className="text-center mb-5">
            {/* 👤 Profile Picture */}
            <img
              src="/me.jpg"
              alt="Abubakar Iliyasu"
              width="140"
              height="140"
              className="rounded-circle shadow mb-3"
            />

            <h2 className="fw-bold text-primary">About Me 👋</h2>
            <p className="text-muted">
              Developer of the SkillsLink Platform
            </p>
          </div>

          {/* ===== Main Card ===== */}
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">

                  <h5 className="fw-bold mb-3">👨‍💻 Abubakar Iliyasu</h5>

                  <p className="text-muted">
                    I am a Computer Science student of Bayero University Kano (BUK),
                    Faculty of Computing. I have a strong passion for software
                    development, modern web technologies, and building digital
                    solutions that positively impact students.
                  </p>

                  <p className="text-muted">
                    SkillsLink is a student-to-student skill exchange platform designed
                    to enable students to teach, learn, and collaborate within the
                    Faculty of Computing, promoting peer learning and innovation.
                  </p>

                  <hr />

                  {/* ===== Supervisor Appreciation ===== */}
                  <h6 className="fw-bold mt-3">🎓 Project Supervision</h6>
                  <p className="text-muted">
                    My sincere appreciation goes to my project supervisor,
                    <strong> Mlm Abubakar Sadeek Mustapha</strong>, for his
                    invaluable guidance, quality supervision, constructive
                    feedback, and continuous support throughout the development
                    of this project.
                  </p>

                  <hr />

                  {/* ===== Project Details ===== */}
                  <p className="mb-1">
                    <strong>Project Title:</strong> SkillsLink
                  </p>
                  <p className="mb-1">
                    <strong>Faculty:</strong> Faculty of Computing, Bayero University Kano
                  </p>
                  

                </div>
              </div>
            </div>
          </div>

          {/* ===== Footer ===== */}
          <footer className="text-center mt-5 text-muted small">
            &copy; {new Date().getFullYear()} SkillLink – Developed by Abubakar Iliyasu
          </footer>
        </div>
      </div>

      {/* ===== Styles ===== */}
      <style jsx>{`
        .dark-mode {
          color: #e5e7eb;
        }
        .dark-mode .card {
          background: #020617;
          color: #e5e7eb;
        }
        .dark-mode .text-muted {
          color: #94a3b8 !important;
        }
      `}</style>
    </>
  );
}