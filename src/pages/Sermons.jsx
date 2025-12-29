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
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    youtubeLiveUrl: "",
  });

  useEffect(() => {
    fetchSermons();
  }, []);

  // =====================
  // FETCH SERMONS
  // =====================
  const fetchSermons = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getSermons();
      setSermons(Array.isArray(res.data.sermons) ? res.data.sermons : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load sermons.");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // FORM HANDLER
  // =====================
  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // =====================
  // EDIT SERMON
  // =====================
  const handleEdit = (sermon) => {
    setEditingId(sermon.id);
    setFormData({
      title: sermon.title || "",
      description: sermon.description || "",
      file: null,
      youtubeLiveUrl: sermon.social_streams?.[0] || "",
    });
    setShowModal(true);
  };

  // =====================
  // DELETE SERMON
  // =====================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sermon?")) return;

    try {
      await adminApi.deleteSermon(id);
      fetchSermons();
    } catch (err) {
      alert("Failed to delete sermon.");
    }
  };

  // =====================
  // SUBMIT (UPLOAD / UPDATE)
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert("Title is required");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);

      if (formData.file) {
        data.append("file", formData.file);
      }

      if (formData.youtubeLiveUrl) {
        data.append(
          "socialStreams",
          JSON.stringify([formData.youtubeLiveUrl])
        );
      }

      if (editingId) {
        await adminApi.updateSermon(editingId, data);
      } else {
        await adminApi.uploadSermon(data);
      }

      resetForm();
      fetchSermons();
    } catch (err) {
      console.error(err);
      alert("Failed to save sermon.");
    }
  };

  // =====================
  // RESET FORM
  // =====================
  const resetForm = () => {
    setEditingId(null);
    setShowModal(false);
    setFormData({
      title: "",
      description: "",
      file: null,
      youtubeLiveUrl: "",
    });
  };

  return (
    <div className="sermons-page">
      <div className="page-header">
        <h2>Manage Sermons</h2>
        <button className="upload-btn" onClick={() => setShowModal(true)}>
          Upload Sermon
        </button>
      </div>

      {loading && <p>Loading sermons...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <Table
          columns={["id", "title", "date", "actions"]}
          data={sermons.map((s) => ({
            ...s,
            actions: (
              <>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(s)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(s.id)}
                >
                  Delete
                </button>
              </>
            ),
          }))}
        />
      )}

      {/* ===================== */}
      {/* MODAL */}
      {/* ===================== */}
      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={editingId ? "Edit Sermon" : "Upload Sermon"}
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

          <label>
            YouTube Live URL (optional)
            <input
              type="url"
              name="youtubeLiveUrl"
              value={formData.youtubeLiveUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/live/XXXX"
            />
          </label>

          <div className="modal-actions">
            <button type="submit" className="submit-btn">
              {editingId ? "Update" : "Upload"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
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
