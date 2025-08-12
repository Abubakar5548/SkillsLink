import React, { useState, useEffect } from "react";
import Head from "next/head";

export default function TechNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  const categories = [
    "All",
    "AI",
    "Web Development",
    "Cybersecurity",
    "Cloud",
    "Programming",
  ];

  // Load favorites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("newsFavorites")) || [];
    setFavorites(saved);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("newsFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Fetch top stories from Hacker News
  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const topStoriesRes = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        );
        const topStoryIds = await topStoriesRes.json();

        // Limit to first 50 for performance
        const selectedIds = topStoryIds.slice(0, 50);

        const storyPromises = selectedIds.map(async (id) => {
          const res = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
          );
          return res.json();
        });

        const stories = await Promise.all(storyPromises);
        setNews(stories.filter((s) => s && s.title && s.url));
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  // Filter news by search and category
  const filteredNews = news
    .filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) => {
      if (category === "All") return true;
      const keywords = {
        AI: ["AI", "artificial intelligence", "machine learning"],
        "Web Development": ["JavaScript", "React", "HTML", "CSS", "frontend", "backend", "web"],
        Cybersecurity: ["security", "cyber", "breach", "hack", "vulnerability"],
        Cloud: ["AWS", "Azure", "cloud", "serverless", "GCP"],
        Programming: ["Python", "Java", "coding", "programming", "developer"],
      };
      return keywords[category].some((kw) =>
        item.title.toLowerCase().includes(kw.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "date") return b.time - a.time;
      return 0;
    });

  return (
    <>
      <Head>
        <title>Tech News & Insights – SkillLink</title>
      </Head>

      <div className="container py-5">
        <h2 className="text-center mb-4 text-primary fw-bold">
          Tech News & Insights
        </h2>

        {/* Search & Sort */}
        <div className="row mb-4">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              placeholder="🔍 Search news..."
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
              <option value="date">Sort: Latest</option>
              <option value="title">Sort: Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <ul
          className="nav nav-tabs mb-4 sticky-top bg-white py-2"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
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

        {/* Loading State */}
        {loading && <p className="text-center">⏳ Loading latest tech news...</p>}

        {/* News Cards */}
        <div className="row g-4">
          {filteredNews.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="small text-secondary">
                    🕒 {new Date(item.time * 1000).toLocaleString()}
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Read More
                  </a>
                  <button
                    className={`btn btn-sm ms-2 ${
                      favorites.includes(item.id)
                        ? "btn-warning"
                        : "btn-outline-warning"
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
      </div>
    </>
  );
}