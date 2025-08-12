import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function MySkills() {
  const [skills, setSkills] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSkills = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
        return;
      }
      const res = await fetch(`/api/my-skills?userId=${userId}`);
      const data = await res.json();
      setSkills(data.skills);
    };

    fetchSkills();
  }, []);

  const handleDelete = async (skillId) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      await fetch('/api/delete-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId }),
      });
      setSkills(skills.filter(skill => skill._id !== skillId));
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Skills</h2>
      {skills.length === 0 ? (
        <p>No skills posted yet.</p>
      ) : (
        <div className="row">
          {skills.map((skill) => (
            <div key={skill._id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{skill.title}</h5>
                  <p className="card-text">{skill.description}</p>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(skill._id)}>Delete</button>
                    {/* You can add Edit modal/button later */}
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