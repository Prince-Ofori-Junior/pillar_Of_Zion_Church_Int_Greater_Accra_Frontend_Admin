import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import adminApi from "../api/adminApi";
import '../users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    adminApi.getUsers()
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, []);

  const columns = ["id", "name", "email", "role"];

  return (
    <div className="users-page">
      <h2>Manage Users</h2>
      <button
        className="add-btn"
        onClick={() => setShowModal(true)}
      >
        Add User
      </button>
      <Table columns={columns} data={users} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add User">
        <p>Form goes here</p>
      </Modal>
    </div>
  );
};

export default Users;
