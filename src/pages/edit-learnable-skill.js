import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function EditLearnableSkill() {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/edit-learnable-skill?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.skill) {
            const s = data.skill;
            setTitle(s.title);
            setDescription(s.description);
            setLink(s.link || '');
            setCategory(s.category || '');
          }
        });
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/edit-learnable-skill?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, link, category }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('✅ Skill updated successfully!');
      setTimeout(() => router.push('/my-learnable-skills'), 1500);
    } else {
      setMessage(`❌ ${data.error || 'Update failed'}`);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Learnable Skill | SkillLink</title>
      </Head>

      <div className="container mt-5" style={{ maxWidth: '600px' }}>
        <h3 className="text-primary mb-4">✏️ Edit Learnable Skill</h3>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">Title *</label>
            <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Description *</label>
            <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Resource Link (optional)</label>
            <input className="form-control" value={link} onChange={(e) => setLink(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select a category</option>
              <option value="Python">Python</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Networking">Networking</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Design">Design</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <button className="btn btn-primary w-100" type="submit">Update Skill</button>
        </form>
      </div>
    </>
  );
}