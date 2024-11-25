import React, { useState } from 'react';

const BlockModal = ({ isOpen, onClose, onConfirm, studentId }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-xl mb-4">Confirm Access Block</h2>
          <p className="mb-4">Are you sure you want to block/unblock this student?</p>
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => onConfirm(studentId)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default BlockModal;
