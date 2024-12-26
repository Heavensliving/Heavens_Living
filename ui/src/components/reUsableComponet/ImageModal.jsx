import React from 'react';
import { FaTimes } from 'react-icons/fa';

// Reusable ImageModal component
const ImageModal = ({ isOpen, onClose, imageSrc, altText }) => {
  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="ml-60 fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-white p-4 rounded-lg shadow-lg">
        {/* Close button */}
        <button className="absolute top-2 right-2 text-red-600 hover:text-red-700" onClick={onClose}>
          <FaTimes size={24} />
        </button>
        
        {/* Image inside the modal */}
        <img src={imageSrc} alt={altText} style={{ maxHeight: 'calc(90vh - 40px)' }} className="w-full h-auto max-w-lg rounded-lg" />
      </div>
    </div>
  );
};

export default ImageModal;
