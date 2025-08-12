import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PostLearnableSkill() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [pdf, setPdf] = useState(null); // 🆕 For PDF upload
  const [postedBy, setPostedBy] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('regNumber');
    if (user) {
      setPostedBy(user);
    } else {
      setMessage('Please login first');
      router.push('/login');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !postedBy || !category) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('link', link);
    formData.append('postedBy', postedBy);
    formData.append('category', category);
    if (pdf) {
      formData.append('pdf', pdf);
    }

    try {
      const res = await fetch('/api/post-learnable-skill', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Skill posted successfully!');
        setTitle('');
        setDescription('');
        setLink('');
        setCategory('');
        setPdf(null);
      } else {
        setMessage(data.error || '❌ Failed to post skill');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-primary mb-4">🧑‍🏫 Post a Learnable Skill</h3>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Skill Title *</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Python Programming"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description *</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Optional Resource Link</label>
          <input
            type="url"
            className="form-control"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* ✅ PDF Upload */}
        <div className="mb-3">
          <label className="form-label">Optional PDF Upload</label>
          <input
            type="file"
            className="form-control"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category *</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Select Category --</option>
            <option value="Python">Python</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Networking">Networking</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          📤 Post Skill
        </button>
      </form>
    </div>
  );
}