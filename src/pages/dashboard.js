import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [regNumber, setRegNumber] = useState('');
  const [email, setEmail] = useState('');
  const adminReg = 'CST/21/COM/00707';
  const [darkMode, setDarkMode] = useState(false);

  // Tech News State
  const [headlines, setHeadlines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auth check
  useEffect(() => {
    const storedReg = localStorage.getItem('regNumber');
    const storedEmail = localStorage.getItem('email');

    if (!storedReg || !storedEmail) {
      alert('Please login first.');
      router.push('/login');
    } else {
      setRegNumber(storedReg);
      setEmail(storedEmail);
    }
  }, []);

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
          title: story.title,
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`
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
      <title>Skills Link – Dashboard</title>
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

          {/* ===== Header Section ===== */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="text-center w-100">
              <img src="/buk-logo.jpg" alt="BUK Logo" width="80" className="mb-3" />
              <h2 className="fw-bold">Welcome to SkillsLink 👋</h2>
              <p className="text-muted mb-1">
                Registration Number: <strong>{regNumber}</strong>
              </p>
            </div>

            {/* 🌙 Dark Mode Toggle */}
            <button
              className="btn btn-sm btn-outline-secondary position-absolute end-0 me-3"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* ===== Quick Actions ===== */}
          <h5 className="fw-semibold mb-3">Quick Actions</h5>

          <div className="row g-4">

            {/* Cards */}
            {[
              {
                icon: '📚',
                title: 'Teach a Skill',
                desc: 'Upload PDF or learning links.',
                link: '/post-learnable-skill',
                btn: 'Teach',
                color: 'success'
              },
              {
                icon: '📖',
                title: 'Learn Skills',
                desc: 'Browse shared materials.',
                link: '/learnable-skills',
                btn: 'Explore',
                color: 'outline-success'
              },
              {
                icon: '👤',
                title: 'My Teachings',
                desc: 'Manage your uploads.',
                link: '/my-learnable-skills',
                btn: 'View',
                color: 'outline-secondary'
              },
              {
                icon: '💻',
                title: 'Code Editor',
                desc: 'Practice HTML, CSS & JS.',
                link: '/code-editor',
                btn: 'Open Editor',
                color: 'outline-primary'
              }
            ].map((item, index) => (
              <div key={index} className="col-6 col-md-3 slide-card">
                <div className="card h-100 border-0 shadow-sm dashboard-card">
                  <div className="card-body text-center">
                    <div className="icon-circle mb-3">{item.icon}</div>
                    <h6 className="fw-bold">{item.title}</h6>
                    <p className="text-muted small">{item.desc}</p>
                    <Link href={item.link} className={`btn btn-${item.color} btn-sm w-100`}>
                      {item.btn}
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Career */}
            <div className="col-12 col-md-6 slide-card">
              <div className="card h-100 border-0 shadow-sm dashboard-card">
                <div className="card-body">
                  <h6 className="fw-bold">🌟 Career & Learning Opportunities</h6>
                  <p className="text-muted small">
                    Jobs, internships, scholarships and learning resources.
                  </p>
                  <Link href="/career-learning" className="btn btn-info btn-sm">
                    Explore Opportunities
                  </Link>
                </div>
              </div>
            </div>

            {/* Tech News */}
            <div className="col-12 col-md-6 slide-card">
              <div className="card h-100 border-0 shadow-sm dashboard-card">
                <div className="card-body">
                  <h6 className="fw-bold">📰 Tech News & Insights</h6>
                  <p className="text-muted small">
                    Latest updates in technology and software development.
                  </p>
                  <Link href="/tech-news" className="btn btn-danger btn-sm">
                      View News
                    </Link>

                  {headlines.length > 0 && (
                    <a
                      href={headlines[currentIndex].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-block mt-3 p-3 text-decoration-none breaking-box"
                    >
                      <span className="badge bg-danger mb-2">Breaking</span>
                      <div className="fw-semibold">
                        {headlines[currentIndex].title}
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Admin */}
            {regNumber === adminReg && (
              <div className="col-12 col-md-4 mx-auto slide-card">
                <div className="card border-0 shadow-sm bg-warning-subtle dashboard-card">
                  <div className="card-body text-center">
                    <div className="icon-circle mb-3">👑</div>
                    <h6 className="fw-bold text-danger">Admin Panel</h6>
                    <p className="text-muted small">
                      Manage all skills and learning resources.
                    </p>
                    <Link href="/admin-learnable-skills" className="btn btn-danger btn-sm">
                      Go to Admin
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="text-center mt-5 text-muted small">
            &copy; {new Date().getFullYear()} SkillLink – Empowering BUK Computing Students (FoC)
          </footer>
        </div>
      </div>
    </div>

    {/* ===== Styles ===== */}
    <style jsx>{`
      .dashboard-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .dashboard-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 35px rgba(0,0,0,0.15);
      }

      .slide-card .dashboard-card {
  opacity: 0;
  animation: fallSlide 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  will-change: transform, opacity;
}

/* ===== Staggered falling ===== */
.slide-card:nth-child(1) .dashboard-card { animation-delay: 0.05s; }
.slide-card:nth-child(2) .dashboard-card { animation-delay: 0.12s; }
.slide-card:nth-child(3) .dashboard-card { animation-delay: 0.19s; }
.slide-card:nth-child(4) .dashboard-card { animation-delay: 0.26s; }
.slide-card:nth-child(5) .dashboard-card { animation-delay: 0.33s; }
.slide-card:nth-child(6) .dashboard-card { animation-delay: 0.40s; }
.slide-card:nth-child(7) .dashboard-card { animation-delay: 0.47s; }
.slide-card:nth-child(8) .dashboard-card { animation-delay: 0.54s; }

/* ===== Hover & Touch lift (desktop + mobile) ===== */
.dashboard-card {
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.dashboard-card:hover,
.dashboard-card:active {
  transform: translateY(-10px);
  box-shadow: 0 18px 40px rgba(0,0,0,0.18);
}

/* ===== Falling animation ===== */
@keyframes fallSlide {
  from {
    opacity: 0;
    transform: translateY(-45px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
      .icon-circle {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #22c55e);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        margin: 0 auto;
      }

      .breaking-box {
        background: #fff;
        border-left: 4px solid #dc3545;
        border-radius: 6px;
      }

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