// src/components/Table.js
import React from "react";
import "../table.css";

const Table = ({ columns = [], data = [] }) => {
  if (!Array.isArray(data)) {
    return (
      <div className="table-container">
        <p className="empty-text">No data available</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-cell">
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col}>
                    {React.isValidElement(row[col])
                      ? row[col]
                      : row[col] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
