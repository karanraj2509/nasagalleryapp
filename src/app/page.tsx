"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./globals.css";

const NASA_API_KEY = "4O9HBCWRE9YgYIuitbLjoSRgI1VyGbkm7TjXKV1G";
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&count=10`;

interface NasaImage {
  url: string;
  title: string;
  media_type: string;
  date: string;
}

export default function Home() {
  const [images, setImages] = useState<NasaImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showLoadMore, setShowLoadMore] = useState(false);

  const router = useRouter();

  // Fetch NASA images
  const fetchImages = async (append = false) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch images. Try again.");
      const data = await response.json();
      setImages((prevImages) => (append ? [...prevImages, ...data] : data));
      setShowLoadMore(true);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("🚨 Failed to load images. Please refresh or try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load favorites from local storage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);
    fetchImages();
  }, []);

  // Toggle favorites
  const toggleFavorite = (url: string) => {
    let updatedFavorites = [...favorites];
    if (favorites.includes(url)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== url);
    } else {
      updatedFavorites.push(url);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Apply search filter
  const filteredImages = images.filter(
    (img) =>
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.date.includes(searchQuery)
  );

  // Apply media filter
  const displayedImages = filteredImages.filter(
    (img) =>
      filter === "all" ||
      (filter === "image" && img.media_type === "image") ||
      (filter === "video" && img.media_type === "video")
  );

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">🚀 NASA Astronomy Gallery</div>

      {/* Search & Filter */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by title or date (YYYY-MM-DD)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <select className="filter-dropdown" onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Show All</option>
          <option value="image">Only Images</option>
          <option value="video">Only Videos</option>
        </select>
      </div>

      {/* Show Error Message if API Fails */}
      {error && <p className="error-message">{error}</p>}

      {/* Show Loading Animation */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading images...</p>
        </div>
      )}

      {/* Image Gallery */}
      <div className="gallery">
        {displayedImages.map((image, index) => (
          <div className="image-card" key={index}>
            {image.media_type === "image" ? (
              <Image
                src={image.url}
                alt={image.title}
                width={300}
                height={200}
                className="image-hover"
                priority={index < 3}
                loading={index < 3 ? "eager" : "lazy"}
              />
            ) : (
              <iframe width="300" height="200" src={image.url} title={image.title} allowFullScreen></iframe>
            )}
            <p>{image.title}</p>
            <p>{image.date}</p>

            {/* Buttons - View Details & Favorite */}
            <div className="button-container">
              <button onClick={() => router.push(`/details?date=${image.date}`)} className="details-button">
                🔍 View Details
              </button>

              <button className="favorite-button" onClick={() => toggleFavorite(image.url)}>
                {favorites.includes(image.url) ? "❤️ Remove" : "🤍 Favorite"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {showLoadMore && !loading && (
        <div className="load-more">
          <button onClick={() => fetchImages(true)}>Load More</button>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        © 2025 NASA Gallery | Developed by <span className="highlight-name">KARAN</span>   
        <br />
        📧 Contact: <a href="mailto:karanrajvka@gmail.com" className="footer-link">karanrajvka@gmail.com</a>  
        <br />
        📞 Phone: <a href="tel:+916383404597" className="footer-link">+91 63834 04597</a>
      </div>
    </div>
  );
}
