import React from 'react';
import { FaTimes } from 'react-icons/fa';

// Reusable ImageModal component
const ImageModal = ({ isOpen, onClose, imageSrc, altText }) => {
  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-white p-4 rounded-lg shadow-lg">
        {/* Close button */}
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-900" onClick={onClose}>
          <FaTimes size={24} />
        </button>
        
        {/* Image inside the modal */}
        <img src={imageSrc} alt={altText} className="w-full h-auto max-w-lg rounded-lg" />
      </div>
    </div>
  );
};

export default ImageModal;
