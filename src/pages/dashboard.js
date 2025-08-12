import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [regNumber, setRegNumber] = useState('');
  const [email, setEmail] = useState('');
  const adminReg = 'CST/21/COM/00707';

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
        <title>SkillLink – Dashboard</title>
      </Head>

      <div className="container py-5">
        <div className="text-center mb-5">
          <img src="/buk-logo.jpg" alt="BUK Logo" width="70" />
          <h2 className="mt-3 text-primary fw-bold">Welcome 👋</h2>
          <p className="text-muted">Reg Number: <strong>{regNumber}</strong></p>
          <p className="text-muted">Email: <strong>{email}</strong></p>
        </div>

        <div className="row g-3 justify-content-center">
          {/* 📚 Teach a Skill */}
          <div className="col-6 col-md-2">
            <div className="card shadow-sm border-0 h-100 text-center bg-light">
              <div className="card-body">
                <h5 className="card-title">📚 Teach</h5>
                <p className="text-muted small">Post a computing skill.</p>
                <Link href="/post-learnable-skill" className="btn btn-success btn-sm">Teach</Link>
              </div>
            </div>
          </div>

          {/* 📖 Learn a Skill */}
          <div className="col-6 col-md-2">
            <div className="card shadow-sm border-0 h-100 text-center bg-light">
              <div className="card-body">
                <h5 className="card-title">📖 Learn</h5>
                <p className="text-muted small">Explore learnable skills.</p>
                <Link href="/learnable-skills" className="btn btn-outline-success btn-sm">View</Link>
              </div>
            </div>
          </div>

          {/* 👤 My Teachings */}
          <div className="col-6 col-md-2">
            <div className="card shadow-sm border-0 h-100 text-center">
              <div className="card-body">
                <h5 className="card-title">👤 My Teachings</h5>
                <p className="text-muted small">Manage what you taught.</p>
                <Link href="/my-learnable-skills" className="btn btn-outline-success btn-sm">Mine</Link>
              </div>
            </div>
          </div>

          {/* 💻 Code Editor */}
          <div className="col-6 col-md-2">
            <div className="card shadow-sm border-0 h-100 text-center bg-light">
              <div className="card-body">
                <h5 className="card-title">💻 Code Editor</h5>
                <p className="text-muted small">Write & run HTML/CSS/JS code.</p>
                <Link href="/code-editor" className="btn btn-outline-primary btn-sm">Try Now</Link>
              </div>
            </div>
          </div>

          {/* 🌟 Career & Learning Opportunities */}
          <div className="col-6 col-md-2">
            <div className="card shadow-sm border-0 h-100 text-center bg-light">
              <div className="card-body">
                <h5 className="card-title">🌟 Career & Learning</h5>
                <p className="text-muted small">Jobs, internships & resources.</p>
                <Link href="/career-learning" className="btn btn-info btn-sm">Explore</Link>
              </div>
            </div>
          </div>

          {/* 📰 Tech News & Insights */}
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 h-100 text-center bg-light">
              <div className="card-body">
                <h5 className="card-title">📰 Tech News & Insights</h5>
                <p className="text-muted small">Latest in AI, web dev, and more.</p>
                <Link href="/tech-news" className="btn btn-outline-info btn-sm">Explore</Link>

                {/* Breaking News Banner */}
                {headlines.length > 0 && (
                  <a
                    href={headlines[currentIndex].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-block mt-3 p-2 text-decoration-none"
                    style={{
                      background: '#fff5f5',
                      borderRadius: '4px',
                      border: '1px solid #f5c2c2'
                    }}
                  >
                    <span className="badge bg-danger me-2">BREAKING</span>
                    <strong style={{ color: '#b71c1c' }}>{headlines[currentIndex].title}</strong>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 👑 Admin Page */}
          {regNumber === adminReg && (
            <div className="col-6 col-md-2">
              <div className="card shadow-sm border-0 h-100 text-center bg-warning-subtle">
                <div className="card-body">
                  <h5 className="card-title text-danger">👑 Admin</h5>
                  <p className="text-muted small">View and manage all posted skills.</p>
                  <Link href="/admin-learnable-skills" className="btn btn-danger btn-sm">Admin Page</Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-5 text-center text-muted" style={{ fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} SkillLink – Empowering BUK Students
        </footer>
      </div>
    </>
  );
}