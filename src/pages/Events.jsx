import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import adminApi from "../api/adminApi";
import '../events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // track edit mode
  const [editId, setEditId] = useState(null); // track event being edited
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    link: "",
    image: null
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    adminApi.getEvents()
      .then(res => setEvents(res.data.events || []))
      .catch(console.error);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const openCreateModal = () => {
    setIsEdit(false);
    setEditId(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "",
      link: "",
      image: null
    });
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setIsEdit(true);
    setEditId(event.id);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
      category: event.category || "",
      link: event.link || "",
      image: null // image update optional
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
      alert("Title, Date, and Location are required!");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("time", formData.time);
    data.append("location", formData.location);
    data.append("category", formData.category);
    data.append("link", formData.link);
    if (formData.image) data.append("image", formData.image);

    try {
      if (isEdit && editId) {
        await adminApi.updateEvent(editId, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        alert("Event updated successfully!");
      } else {
        await adminApi.createEvent(data, { headers: { 'Content-Type': 'multipart/form-data' } });
        alert("Event created successfully!");
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to save event.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await adminApi.deleteEvent(id);
      alert("Event deleted successfully!");
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    }
  };

  const columns = ["id", "title", "date", "location", "actions"];

  const tableData = events.map(ev => ({
    ...ev,
    actions: (
      <>
        <button onClick={() => openEditModal(ev)} className="edit-btn">Edit</button>
        <button onClick={() => handleDelete(ev.id)} className="delete-btn">Delete</button>
      </>
    )
  }));

  return (
    <div className="events-page">
      <h2>Manage Events</h2>
      <button className="create-btn" onClick={openCreateModal}>
        Create Event
      </button>

      <Table columns={columns} data={tableData} />

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={isEdit ? "Edit Event" : "Create Event"}
      >
        <form onSubmit={handleSubmit} className="event-form">
          <label>
            Title:
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </label>
          <label>
            Description:
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>
          <label>
            Date:
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </label>
          <label>
            Time:
            <input type="time" name="time" value={formData.time} onChange={handleChange} />
          </label>
          <label>
            Location:
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </label>
          <label>
            Category:
            <input type="text" name="category" value={formData.category} onChange={handleChange} />
          </label>
          <label>
            Link:
            <input type="url" name="link" value={formData.link} onChange={handleChange} />
          </label>
          <label>
            Image:
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
          </label>
          <button type="submit" className="submit-btn">{isEdit ? "Update Event" : "Create Event"}</button>
        </form>
      </Modal>
    </div>
  );
};

export default Events;
