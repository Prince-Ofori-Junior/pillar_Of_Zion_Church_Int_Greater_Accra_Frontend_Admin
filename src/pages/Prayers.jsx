import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import adminApi from "../api/adminApi";

const Prayers = () => {
  const [prayers, setPrayers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    adminApi.getPrayers().then((res) => setPrayers(res.data)).catch(console.error);
  }, []);

  const columns = ["id", "requester", "prayer", "status"];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Prayers</h2>
      <button
        className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded"
        onClick={() => setShowModal(true)}
      >
        Approve Prayer
      </button>
      <Table columns={columns} data={prayers} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Approve Prayer">
        <p>Approval form goes here</p>
      </Modal>
    </div>
  );
};

export default Prayers;
