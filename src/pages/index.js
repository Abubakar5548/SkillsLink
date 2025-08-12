import Head from 'next/head';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [headlines, setHeadlines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

      <div className="container py-5">
        <div className="text-center mb-5">
          <img src="/buk-logo.jpg" alt="BUK Logo" width="90" />
          <h1 className="mt-3 text-primary fw-bold">Skills Link</h1>
          <p className="text-muted">A Student-to-Student Skill Exchange Platform <br /> Exclusively for Bayero University Kano</p>

          <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
            <a href="/signup" className="btn btn-primary btn-lg px-4">Get Started</a>
            <a href="/login" className="btn btn-outline-primary btn-lg px-4">Login</a>
          </div>
        </div>

        <div className="row g-3 justify-content-center">
          {/* Teach a Skill */}
          <div className="col-6 col-md-2">
            <div className="card shadow-sm border-0 h-100 text-center bg-light">
              <div className="card-body">
                <h5 className="card-title">📚 Teach</h5>
                <p className="text-muted small">Post a computing skill.</p>
              </div>
            </div>
          </div>

          {/* Learn a Skill */}
          <div className="col-6 col-md-2">
            <div className="card shadow-sm border-0 h-100 text-center bg-light">
              <div className="card-body">
                <h5 className="card-title">📖 Learn</h5>
                <p className="text-muted small">Explore learnable skills.</p>
              </div>
            </div>
          </div>

          {/* My Teachings */}
          <div className="col-6 col-md-2">
            <div className="card shadow-sm border-0 h-100 text-center">
              <div className="card-body">
                <h5 className="card-title">👤 My Teachings</h5>
                <p className="text-muted small">Manage what you taught.</p>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="col-6 col-md-2">
            <div className="card shadow-sm border-0 h-100 text-center bg-light">
              <div className="card-body">
                <h5 className="card-title">💻 Code Editor</h5>
                <p className="text-muted small">Write & run HTML/CSS/JS code.</p>
              </div>
            </div>
          </div>

          {/* Career & Learning */}
          <div className="col-6 col-md-2">
            <div className="card shadow-sm border-0 h-100 text-center bg-light">
              <div className="card-body">
                <h5 className="card-title">🌟 Career & Learning</h5>
                <p className="text-muted small">Jobs, internships & resources.</p>
              </div>
            </div>
          </div>

          {/* Tech News */}
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 h-100 text-center bg-light">
              <div className="card-body">
                <h5 className="card-title">📰 Tech News & Insights</h5>
                <p className="text-muted small">Latest in AI, web dev, and more.</p>

                {/* Breaking News Banner */}
                {headlines.length > 0 && (
                  <div
                    className="d-block mt-3 p-2"
                    style={{
                      background: '#fff5f5',
                      borderRadius: '4px',
                      border: '1px solid #f5c2c2'
                    }}
                  >
                    <span className="badge bg-danger me-2">BREAKING</span>
                    <strong style={{ color: '#b71c1c' }}>
                      {headlines[currentIndex].title}
                    </strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-5 text-center text-muted" style={{ fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} SkillLink – Empowering BUK Students
        </footer>
      </div>
    </>
  );
}