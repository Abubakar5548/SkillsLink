import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminLearnableSkills() {
  const [skills, setSkills] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({});
  const router = useRouter();

  const adminReg = 'CST/21/COM/00707';

  useEffect(() => {
    const user = localStorage.getItem('regNumber');
    if (user !== adminReg) {
      alert('Access denied: Admins only');
      router.push('/login');
    } else {
      setRegNumber(user);
      fetchSkills();
      
    }
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/get-learnable-skills');
      const data = await res.json();
      if (res.ok) {
        setSkills(data.skills || []);
        calculateStats(data.skills || []);
      } else {
        setMessage('❌ Failed to load skills');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Server error');
    }
  };

  const calculateStats = (skillsList) => {
    const statsObj = {};
    for (let skill of skillsList) {
      const cat = skill.category || 'Uncategorized';
      statsObj[cat] = (statsObj[cat] || 0) + 1;
    }
    setStats(statsObj);
  };

  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      const res = await fetch(`/api/delete-learnable-skill?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const updated = skills.filter((s) => s._id !== id);
        setSkills(updated);
        calculateStats(updated);
        setMessage('✅ Skill deleted');
      } else {
        setMessage('❌ Failed to delete skill');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('❌ Server error');
    }
  };

  

  const filtered = skills.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.postedBy.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? s.category === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-danger">👑 Admin: Learnable Skills Management</h3>
        <div style={{ position: 'relative' }}>
          
          {showNotif && (
            <div className="card shadow position-absolute end-0 mt-2" style={{ zIndex: 10, width: '300px' }}>
              <div className="card-body">
                <h6 className="d-flex justify-content-between align-items-center">
                  🔔 Recent Views
                  <button onClick={handleMarkAsRead} className="btn btn-sm btn-link text-primary p-0">
                    Mark all as read
                  </button>
                </h6>
                <ul className="list-group small">
                  {notifications.slice(0, 5).map((log, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{log.viewedBy}</strong> viewed
                        <br />
                        <span className="text-muted">{log.skillTitle}</span>
                      </div>
                      <span className="badge bg-light text-muted small">{new Date(log.viewedAt).toLocaleString()}</span>
                    </li>
                  ))}
                  {notifications.length === 0 && (
                    <li className="list-group-item">No views yet</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <Link href="/dashboard" className="btn btn-sm btn-outline-primary mb-3">
        ← Back to Dashboard
      </Link>

      {message && <div className="alert alert-info">{message}</div>}

      {/* 📊 Stats */}
      <div className="mb-4">
        <h5 className="text-primary">📊 Skills by Category:</h5>
        {Object.keys(stats).length === 0 ? (
          <p>No skills yet.</p>
        ) : (
          <ul className="list-group">
            {Object.entries(stats).map(([cat, count]) => (
              <li key={cat} className="list-group-item d-flex justify-content-between">
                <span>{cat}</span>
                <span className="badge bg-secondary">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or reg number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Filter by Category</option>
            <option value="Python">Python</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Networking">Networking</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="alert alert-warning">No matching skills found.</p>
      ) : (
        <div className="row g-4">
          {filtered.map((skill) => (
            <div key={skill._id} className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-success">{skill.title}</h5>
                  <p>{skill.description}</p>
                  <p className="mb-1"><strong>By:</strong> {skill.postedBy}</p>
                  <p className="mb-2"><strong>Category:</strong> {skill.category}</p>

                  

                  {skill.link && (
                    <a href={skill.link} target="_blank" rel="noopener" className="btn btn-sm btn-outline-success mb-2">
                      📎 Resource Link
                    </a>
                  )}
                  {skill.pdf && (
                    <a href={skill.pdf} target="_blank" rel="noopener" className="btn btn-sm btn-outline-secondary mb-2">
                      📄 Download PDF
                    </a>
                  )}

                  <div className="d-flex gap-2 mt-2">
                    <Link href={`/edit-learnable-skill?id=${skill._id}`} className="btn btn-sm btn-warning">
                      ✏️ Edit
                    </Link>
                    <button onClick={() => handleDelete(skill._id)} className="btn btn-sm btn-danger">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}