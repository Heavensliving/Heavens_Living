/* eslint-disable react/prop-types */


const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900">Confirm Deletion</h2>
            <p className="mt-2 text-gray-600">Are you sure you want to delete this carousel?</p>
          </div>
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;