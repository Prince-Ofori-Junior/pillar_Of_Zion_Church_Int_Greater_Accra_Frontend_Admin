import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import adminApi from "../api/adminApi";
import '../donations.css';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    adminApi.getDonations()
      .then((res) => setDonations(res.data))
      .catch(console.error);
  }, []);

  const columns = ["id", "donor", "amount", "status", "date"];

  return (
    <div className="donations-page">
      <h2>Manage Donations</h2>
      <button
        className="verify-btn"
        onClick={() => setShowModal(true)}
      >
        Verify Donation
      </button>
      <Table columns={columns} data={donations} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Verify Donation">
        <p>Verification form goes here</p>
      </Modal>
    </div>
  );
};

export default Donations;
