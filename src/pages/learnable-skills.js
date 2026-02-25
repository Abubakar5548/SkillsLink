import Head from 'next/head';
import dbConnect from '../lib/dbConnect';
import LearnableSkill from '../models/LearnableSkill';
import { useState } from 'react';
import Link from 'next/link';

export default function LearnableSkills({ skills }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const getYouTubeThumbnail = (url) => {
  if (!url) return null;

  let videoId = null;

  // Format 1: youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/v=([^&]+)/);
  if (watchMatch && watchMatch[1]) {
    videoId = watchMatch[1];
  }

  // Format 2: youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (!videoId && shortMatch && shortMatch[1]) {
    videoId = shortMatch[1];
  }

  // Format 3: youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/embed\/([^?]+)/);
  if (!videoId && embedMatch && embedMatch[1]) {
    videoId = embedMatch[1];
  }

  if (!videoId) return null;

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};
  
  const getYouTubeVideoId = (url) => {
  if (!url) return null;

  const match =
    url.match(/v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/) ||
    url.match(/embed\/([^?]+)/);

  return match ? match[1] : null;
};

  // 🔔 Track resource view/download
  const handleView = async (skill) => {
    const viewedBy = localStorage.getItem('regNumber') || 'anonymous';
    await fetch('/api/log-learnable-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skillId: skill._id,
        skillTitle: skill.title,
        viewedBy,
      }),
    });
  };

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.title.toLowerCase().includes(search.toLowerCase()) ||
      skill.postedBy.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? skill.category === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Head>
        <title>Learnable Skills | SkillLink</title>
      </Head>

      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-primary">📖 Learn a Computing Skill</h3>
          <Link href="/dashboard" className="btn btn-outline-secondary btn-sm">← Back to Dashboard</Link>
        </div>

        <p className="text-muted">Explore computing skills shared by other students in the Faculty of Computer.</p>

        {/* 🔍 Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title or poster..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Filter by Category</option>
              <option value="Python">Python</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Networking">Networking</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        {/* 💡 Skill Cards */}
        {filteredSkills.length === 0 ? (
          <p className="alert alert-info">No skills match your filter. Try a different keyword or category.</p>
        ) : (
          <div className="row g-4">
            {filteredSkills.map((skill) => (
              <div key={skill._id} className="col-md-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title text-success">{skill.title}</h5>
                    <p className="card-text description">{skill.description}</p>
                    <p className="text-muted mb-1"><strong>By:</strong> {skill.postedBy}</p>
                    <span className="category-badge mb-2 d-inline-block">
  {skill.category}
</span>

                    {skill.link && (
  <>
    {getYouTubeVideoId(skill.link) ? (
      <div
        className="youtube-card mb-3"
        onClick={() => {
          setActiveVideo(getYouTubeVideoId(skill.link));
          handleView(skill);
        }}
        style={{ cursor: "pointer" }}
      >
        <img
          src={`https://img.youtube.com/vi/${getYouTubeVideoId(skill.link)}/hqdefault.jpg`}
          className="img-fluid rounded"
          alt="YouTube Thumbnail"
        />

        {/* ▶ Play Button */}
        <div className="play-overlay">▶</div>

        {/* ⏱ Duration Badge (manual for now) */}
        <span className="duration-badge">Video</span>
      </div>
    ) : (
      <a
        href={skill.link}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-outline-success mb-2"
        onClick={() => handleView(skill)}
      >
        📎 Resource Link
      </a>
    )}
  </>
)}

                    {skill.pdf && (
                      <a
                        href={skill.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-secondary mb-2"
                        onClick={() => handleView(skill)}   // ✅ track PDF download
                      >
                        📄 Download PDF
                      </a>
                    )}

                    <small className="text-muted">
                      Posted on {new Date(skill.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {activeVideo && (
  <div className="video-modal" onClick={() => setActiveVideo(null)}>
    <div className="video-container" onClick={(e) => e.stopPropagation()}>
      <iframe
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${activeVideo}`}
        title="YouTube video"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <button
        className="btn btn-danger mt-2"
        onClick={() => setActiveVideo(null)}
      >
        Close
      </button>
    </div>
  </div>
)}
<style jsx>{`

/* =====================
   COMPACT CLEAN CARD
===================== */

.skill-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  background: #fff;
}

.skill-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.card-body {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* TITLE */
.card-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 6px;
}

/* DESCRIPTION (2 lines only) */
.description {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 10px;

  display: -webkit-box;
  -webkit-line-clamp: 2; /* limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* CATEGORY BADGE */
.category-badge {
  background: #eef2ff;
  color: #3f51b5;
  padding: 4px 10px;
  font-size: 11px;
  border-radius: 20px;
  font-weight: 500;
  margin-bottom: 8px;
}

/* YOUTUBE */
.youtube-card {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  height: 160px; /* fixed height */
}

.youtube-card img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* prevents stretching */
  transition: transform 0.3s ease;
}

.youtube-card:hover img {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.duration-badge {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 3px 6px;
  font-size: 10px;
  border-radius: 4px;
}

/* META TEXT */
.meta-text {
  font-size: 0.8rem;
  color: #777;
  margin-top: 6px;
}

/* MODAL */
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.video-container {
  background: white;
  padding: 20px;
  border-radius: 15px;
  max-width: 750px;
  width: 95%;
}

`}</style>
    </>
  );
}

// ✅ Server-side fetch
export async function getServerSideProps() {
  await dbConnect();
  const skills = await LearnableSkill.find().sort({ createdAt: -1 }).lean();

  const formattedSkills = skills.map((s) => ({
    ...s,
    _id: s._id.toString(),
    createdAt: s.createdAt?.toISOString() || null,
    updatedAt: s.updatedAt?.toISOString() || null,
  }));

  return { props: { skills: formattedSkills } };
}