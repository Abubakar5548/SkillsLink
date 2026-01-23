import Head from 'next/head';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

export default function Home() {
  const [headlines, setHeadlines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch Hacker News top stories
  useEffect(() => {
    async function fetchHeadlines() {
      try {
        const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const ids = await topStoriesRes.json();
        const topFive = ids.slice(0, 5);

        const storyPromises = topFive.map(async (id) => {
          const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return storyRes.json();
        });

        const stories = await Promise.all(storyPromises);
        const formatted = stories.map(story => ({
          title: story.title
        }));
        setHeadlines(formatted);
      } catch (error) {
        console.error("Failed to fetch Hacker News:", error);
      }
    }

    fetchHeadlines();
  }, []);

  // Rotate headlines every 5 seconds
  useEffect(() => {
    if (headlines.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % headlines.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [headlines]);

  return (
  <>
    <Head>
      <title>Skills Link – Home</title>
    </Head>

    {/* ===== Dark Mode Wrapper ===== */}
    <div className={`min-vh-100 ${darkMode ? 'dark-mode' : ''}`}>
      <div
        className="container-fluid py-5"
        style={{
          background: darkMode
            ? 'linear-gradient(135deg, #0f172a, #020617)'
            : 'linear-gradient(135deg, #f8f9ff, #eef2ff)'
        }}
      >
        <div className="container">

          {/* ===== Header ===== */}
          <div className="position-relative text-center mb-5">
            <img src="/buk-logo.jpg" alt="BUK Logo" width="90" />
            <h1 className="mt-3 fw-bold text-primary">Skills Link</h1>
            <p className="text-muted">
              A Student-to-Student Skill Exchange Platform <br />
              Exclusively for Bayero University Kano Faculty Of Computing
            </p>

            {/* 🌙 Dark Mode Toggle */}
            <button
              className="btn btn-sm btn-outline-secondary position-absolute end-0 top-0"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
              <Link href="/signup" className="btn btn-primary btn-lg px-4">
                Get Started
              </Link>
              <Link href="/login" className="btn btn-outline-primary btn-lg px-4">
                Login
              </Link>
            </div>
          </div>

          {/* ===== Feature Cards ===== */}
          <div className="row g-4 justify-content-center">

            {[
              { title: '📚 Teach', desc: 'Post a computing skill.' },
              { title: '📖 Learn', desc: 'Explore learnable skills.' },
              { title: '👤 My Teachings', desc: 'Manage what you taught.' },
              { title: '💻 Code Editor', desc: 'Write & run HTML/CSS/JS code.' },
              { title: '🌟 Career & Learning', desc: 'Jobs, internships & resources.' }
            ].map((item, index) => (
              <div key={index} className="col-6 col-md-2 slide-card">
                <div className="card shadow-sm border-0 h-100 text-center dashboard-card">
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="text-muted small">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Tech News */}
            <div className="col-12 col-md-4 slide-card">
              <div className="card shadow-sm border-0 h-100 text-center dashboard-card">
                <div className="card-body">
                  <h5 className="card-title">📰 Tech News & Insights</h5>
                  <p className="text-muted small">
                    Latest in AI, web dev, and more.
                  </p>

                  {headlines.length > 0 && (
                    <div className="breaking-box mt-3 p-2">
                      <span className="badge bg-danger me-2">BREAKING</span>
                      <strong>{headlines[currentIndex].title}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          <footer className="mt-5 text-center text-muted small">
            &copy; {new Date().getFullYear()} SkillLink – Empowering FoC Students
          </footer>
        </div>
      </div>
    </div>

    {/* ===== Styles ===== */}
    <style jsx>{`
      /* Falling animation */
      .slide-card {
        opacity: 0;
        animation: fallIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }

      .slide-card:nth-child(1) { animation-delay: 0.05s; }
      .slide-card:nth-child(2) { animation-delay: 0.12s; }
      .slide-card:nth-child(3) { animation-delay: 0.19s; }
      .slide-card:nth-child(4) { animation-delay: 0.26s; }
      .slide-card:nth-child(5) { animation-delay: 0.33s; }
      .slide-card:nth-child(6) { animation-delay: 0.40s; }

      @keyframes fallIn {
        from {
          opacity: 0;
          transform: translateY(-45px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Hover / touch lift */
      .dashboard-card {
        transition: transform 0.35s ease, box-shadow 0.35s ease;
      }

      .dashboard-card:hover,
      .dashboard-card:active {
        transform: translateY(-12px);
        box-shadow: 0 20px 45px rgba(0,0,0,0.18);
      }

      /* Breaking */
      .breaking-box {
        background: #fff;
        border-left: 4px solid #dc3545;
        border-radius: 6px;
      }

      /* Dark Mode */
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