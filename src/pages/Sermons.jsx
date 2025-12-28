import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import adminApi from "../api/adminApi";
import "../sermons.css";

const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ✅ ADDED youtubeLiveUrl
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    youtubeLiveUrl: ""
  });

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminApi.getSermons();
      setSermons(Array.isArray(res.data.sermons) ? res.data.sermons : []);
    } catch (err) {
      console.error("Fetch sermons error:", err);
      setError("Failed to load sermons.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, file: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ FILE IS NO LONGER REQUIRED (Live-only sermon allowed)
    if (!formData.title) return alert("Title is required");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);

      if (formData.file) {
        data.append("file", formData.file);
      }

      // ✅ SEND YOUTUBE LIVE URL TO BACKEND
      if (formData.youtubeLiveUrl) {
        data.append(
          "socialStreams",
          JSON.stringify([formData.youtubeLiveUrl])
        );
      }

      await adminApi.uploadSermon(data);
      setShowModal(false);

      setFormData({
        title: "",
        description: "",
        file: null,
        youtubeLiveUrl: ""
      });

      fetchSermons();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload sermon.");
    }
  };

  return (
    <div className="sermons-page">
      <div className="page-header">
        <h2>Manage Sermons</h2>
        <button
          className="upload-btn"
          onClick={() => setShowModal(true)}
        >
          Upload Sermon
        </button>
      </div>

      {loading && <p>Loading sermons...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <Table columns={["id", "title", "date"]} data={sermons} />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Upload Sermon"
      >
        <form onSubmit={handleSubmit} className="upload-form">
          <label>
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <label>
            Audio / Video File (optional)
            <input
              type="file"
              name="file"
              accept="audio/*,video/*"
              onChange={handleChange}
            />
          </label>

          {/* 🔴 YOUTUBE LIVE INPUT */}
          <label>
            YouTube Live URL (optional)
            <input
              type="url"
              name="youtubeLiveUrl"
              placeholder="https://www.youtube.com/live/XXXX"
              value={formData.youtubeLiveUrl}
              onChange={handleChange}
            />
          </label>

          <div className="modal-actions">
            <button type="submit" className="submit-btn">
              Upload
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Sermons;
  