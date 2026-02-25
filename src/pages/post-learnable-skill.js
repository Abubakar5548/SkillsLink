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
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");

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
  <div className="container mt-5 mb-5">
    <div className="row justify-content-center">
      <div className="col-lg-8">

        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4 p-md-5">

            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="fw-bold text-primary">🧑‍🏫 Teach a Skill</h3>
              <p className="text-muted">
                Share your knowledge with fellow Faculty of Computing students
              </p>
            </div>

            {message && (
              <div className="alert alert-info text-center">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">

              {/* Skill Title */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Skill Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Python Programming for Beginners"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What students will learn, prerequisites, outcomes..."
                  required
                />
              </div>

              {/* Skill Level */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Skill Level <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-lg"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                >
                  <option value="">-- Select Level --</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Estimated Duration */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Estimated Duration <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 3 weeks, 10 hours"
                  required
                />
              </div>

              {/* Resource Link */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Resource Link <span className="text-muted">(Optional)</span>
                </label>
                <input
                  type="url"
                  className="form-control"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://youtube.com / github.com"
                />
              </div>

              {/* PDF Upload */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Upload PDF <span className="text-muted">(Optional)</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="application/pdf"
                  onChange={(e) => setPdf(e.target.files[0])}
                />
                <small className="text-muted">
                  Lecture notes, slides, or exercises (PDF only)
                </small>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-lg"
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

              {/* Submit */}
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-success btn-lg rounded-pill"
                >
                  🚀 Publish Skill
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>
    </div>
  </div>
);
}