import Head from 'next/head';
import dbConnect from '../lib/dbConnect';
import LearnableSkill from '../models/LearnableSkill';
import { useState } from 'react';
import Link from 'next/link';

export default function LearnableSkills({ skills }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

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
                    <p className="card-text">{skill.description.slice(0, 100)}...</p>
                    <p className="text-muted mb-1"><strong>By:</strong> {skill.postedBy}</p>
                    <p className="text-muted mb-1"><strong>Category:</strong> {skill.category}</p>

                    {skill.link && (
                      <a
                        href={skill.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-success mb-2"
                        onClick={() => handleView(skill)}   // ✅ track link click
                      >
                        📎 Resource Link
                      </a>
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