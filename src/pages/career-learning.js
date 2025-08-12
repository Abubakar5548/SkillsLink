import React, { useState, useEffect } from "react";
import Head from "next/head";

export default function CareerLearning() {
  const initialResources = [
    { id: 1, title: "LinkedIn Jobs – Tech", category: "Job Portal", url: "https://www.linkedin.com/jobs/", lastUpdated: "2025-08-01" },
    { id: 2, title: "Indeed – IT & Computer Jobs", category: "Job Portal", url: "https://www.indeed.com/q-IT-jobs.html", lastUpdated: "2025-07-28" },
    { id: 3, title: "Stack Overflow Jobs", category: "Job Portal", url: "https://stackoverflow.com/jobs", lastUpdated: "2025-08-03" },
    { id: 4, title: "Internshala – Tech Internships", category: "Internship", url: "https://internshala.com/", lastUpdated: "2025-07-30" },
    { id: 5, title: "Google Summer of Code", category: "Internship", url: "https://summerofcode.withgoogle.com/", lastUpdated: "2025-08-02" },
    { id: 6, title: "Microsoft Learn Student Ambassadors", category: "Internship", url: "https://studentambassadors.microsoft.com/", lastUpdated: "2025-08-05" },
    { id: 7, title: "freeCodeCamp", category: "Learning Resource", url: "https://www.freecodecamp.org/", lastUpdated: "2025-08-01" },
    { id: 8, title: "Python.org Tutorials", category: "Learning Resource", url: "https://docs.python.org/3/tutorial/", lastUpdated: "2025-07-27" },
    { id: 9, title: "W3Schools", category: "Learning Resource", url: "https://www.w3schools.com/", lastUpdated: "2025-08-04" },
    { id: 10, title: "Coursera – Computer Science", category: "Learning Resource", url: "https://www.coursera.org/browse/computer-science", lastUpdated: "2025-07-25" },
    { id: 11, title: "AWS Cloud Practitioner", category: "Certification", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/", lastUpdated: "2025-08-06" },
    { id: 12, title: "Google Cybersecurity Certificate", category: "Certification", url: "https://grow.google/certificates/cybersecurity/", lastUpdated: "2025-07-29" },
    { id: 13, title: "Data Analytics with IBM", category: "Certification", url: "https://www.coursera.org/professional-certificates/ibm-data-analyst", lastUpdated: "2025-08-05" },
  ];

  const [resources, setResources] = useState(initialResources);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("title");

  const categories = ["All", "Job Portal", "Internship", "Learning Resource", "Certification"];

  // Load favorites
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredResources = resources
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => (category === "All" ? true : item.category === category))
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "date") return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      return 0;
    });

  return (
    <>
      <Head>
        <title>Career & Learning Opportunities – SkillLink</title>
      </Head>

      <div className="container py-5">
        <h2 className="text-center mb-4 text-primary fw-bold">Career & Learning Opportunities</h2>

        {/* Search and Sort */}
        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <input
              type="text"
              placeholder="🔍 Search opportunities..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Sort: Alphabetical</option>
              <option value="date">Sort: Last Updated</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <ul className="nav nav-tabs mb-4 justify-content-center">
          {categories.map((cat) => (
            <li className="nav-item" key={cat}>
              <button
                className={`nav-link ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>

        {/* Resource Cards */}
        <div className="row g-4">
          {filteredResources.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="text-muted small">{item.category}</p>
                  <p className="small text-secondary">📅 Last Updated: {item.lastUpdated}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    Visit
                  </a>
                  <button
                    className={`btn btn-sm ms-2 ${
                      favorites.includes(item.id) ? "btn-warning" : "btn-outline-warning"
                    }`}
                    onClick={() => toggleFavorite(item.id)}
                  >
                    ⭐ {favorites.includes(item.id) ? "Favorited" : "Favorite"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <p className="text-center text-muted mt-4">No resources found.</p>
        )}
      </div>
    </>
  );
}