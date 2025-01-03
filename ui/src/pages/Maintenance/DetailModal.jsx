import React from 'react';

const DetailModal = ({ isOpen, onClose, record }) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 md:ml-60 lg:ml-60 xl:ml-60 sm:ml-16  bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-1/2 mx-auto">
        <h2 className="text-lg font-bold mb-2">Issue Details</h2>
        <p><strong>Issuer Name:</strong> {record.Name}</p>
        <p><strong>Issue:</strong> {record.issue}</p>
        <p><strong>Description:</strong> {record.description}</p>
        <p><strong>Room no.:</strong> {record.roomNo}</p>
        <p><strong>Date and Time:</strong> {new Date(record.createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> {record.Status}</p>
        <p><strong>Assigned To</strong> {record.AssignedTo}</p>      


        {/* Conditionally render "Resolved By" and "Remark" only if status is not "pending" */}
        {record.Status !== 'pending' && (
          <>
            <p><strong>Resolved By:</strong> {record.AssignedTo}</p>
            <p><strong>Remark:</strong> {record.Remarks}</p>
          </>
        )}

        {/* Add any other relevant details you want to display */}
        <button onClick={onClose} className="mt-4 p-2 bg-blue-500 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default DetailModal;
