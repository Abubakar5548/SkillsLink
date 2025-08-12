import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MyLearnableSkills() {
  const [skills, setSkills] = useState([]);
  const [regNumber, setRegNumber] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = {
      regNumber: localStorage.getItem('regNumber'),
      email: localStorage.getItem('email'),
    };

    if (!user.regNumber || !user.email) {
      alert('Please login first.');
      router.push('/login');
    } else {
      setRegNumber(user.regNumber);
      fetchSkills(user.regNumber);
    }
  }, []);

  const fetchSkills = async (reg) => {
    try {
      const res = await fetch(`/api/my-learnable-skills?regNumber=${reg}`);
      const data = await res.json();
      if (res.ok) setSkills(data.skills || []);
      else setMessage('❌ Failed to load skills.');
    } catch (err) {
      console.error('Error:', err);
      setMessage('❌ Server error.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const res = await fetch(`/api/delete-learnable-skill?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s._id !== id));
        setMessage('✅ Skill deleted successfully.');
      } else {
        setMessage('❌ Failed to delete skill.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('❌ Server error.');
    }
  };

  const isAdmin = regNumber === 'CST/21/COM/0000'; // Replace with actual admin regNumber

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary">👤 My Learnable Skills</h3>
        <Link href="/dashboard" className="btn btn-outline-secondary btn-sm">← Back to Dashboard</Link>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {skills.length === 0 ? (
        <p className="alert alert-warning">No skills posted yet.</p>
      ) : (
        <div className="row g-4">
          {skills.map((skill) => (
            <div key={skill._id} className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-success">{skill.title}</h5>
                  <p className="card-text">{skill.description}</p>
                  <p className="text-muted mb-1"><strong>Category:</strong> {skill.category}</p>

                  {skill.link && (
                    <a
                      href={skill.link}
                      className="btn btn-sm btn-outline-success mb-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📎 Open Resource
                    </a>
                  )}

                  {skill.pdf && (
                    <a
                      href={skill.pdf}
                      className="btn btn-sm btn-outline-secondary mb-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📄 Download PDF
                    </a>
                  )}

                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    Posted by: <strong>{skill.postedBy}</strong><br />
                    {new Date(skill.createdAt).toLocaleString()}
                  </p>

                  {(isAdmin || skill.postedBy === regNumber) && (
                    <div className="d-flex gap-2 mt-2">
                      <Link
                        href={`/edit-learnable-skill?id=${skill._id}`}
                        className="btn btn-sm btn-warning"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="btn btn-sm btn-danger"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}