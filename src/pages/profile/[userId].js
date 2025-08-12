import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function StudentProfile() {
  const router = useRouter();
  const { userId } = router.query;

  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const res = await fetch(`/api/get-skills?userId=${userId}`);
      const data = await res.json();

      if (res.ok) {
        setUser(data.user || null);      // Full user info (name, regNumber)
        setSkills(Array.isArray(data.skills) ? data.skills : []);  // Skills posted by user
      }
    };

    fetchProfile();
  }, [userId]);

  // 🔵 Handle Send Message Button Click
  const handleMessageClick = () => {
    if (!user?.regNumber) return;
    router.push(`/messages?to=${user.regNumber}`);
  };

  if (!user) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-primary mb-3">👤 {user.name || 'Student Profile'}</h2>
      <p><strong>📛 Reg Number:</strong> {user.regNumber}</p>
      <p><strong>📧 Email:</strong> {user.email}</p>

      {/* ✅ Add Send Message Button here */}
      <button className="btn btn-outline-primary mt-2 mb-4" onClick={handleMessageClick}>
        💬 Send Message
      </button>

      <hr />

      <h4 className="mt-4">🛠 Posted Skills</h4>
      {skills.length === 0 ? (
        <p>This student hasn't posted any skills yet.</p>
      ) : (
        <div className="row mt-3">
          {skills.map((skill) => (
            <div key={skill._id} className="col-md-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{skill.title}</h5>
                  <p>{skill.description}</p>
                  {skill.price && <p><strong>💰 {skill.price}</strong></p>}
                  <small className="text-muted">🕒 {new Date(skill.createdAt).toLocaleString()}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}