import React, { useState, useEffect } from 'react';

// Reusable IdProof component
const IdProof = ({ title, imageSrc, altText, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Reset states when imageSrc changes
    setIsLoading(true);
    setIsError(false);

    // If imageSrc is invalid, stop loading and set error
    if (!imageSrc || !imageSrc.startsWith('http')) {
      setIsLoading(false);
      setIsError(true);
      return;
    }

    // Create an Image object to check if the image loads successfully
    const img = new Image();
    img.src = imageSrc;

    // If the image loads successfully, stop loading and no error
    img.onload = () => {
      setIsLoading(false);
      setIsError(false);
    };

    // If the image fails to load, stop loading and set error
    img.onerror = () => {
      setIsLoading(false);
      setIsError(true);
    };

    // Clean up the image object when component unmounts or imageSrc changes
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc]);

  // Function to handle card click only when the image has loaded successfully
  const handleCardClick = () => {
    if (!isError && !isLoading) {
      onClick();
    }
  };

  return (
    <div 
      className={`bg-gray-100 p-4 rounded-lg shadow-md w-1/2 ${!isError && !isLoading ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      <h5 className="font-medium text-gray-600 mb-2">{title}</h5>
      <div className="relative">
        {/* Show spinner while loading */}
        {isLoading && !isError && (
          <div className="flex items-center justify-center">
            <div className="spinner"></div> {/* Loading spinner */}
          </div>
        )}

        {/* Show error message if image failed to load */}
        {isError && (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">Image not available</p>
          </div>
        )}

        {/* Actual image, shown only if not loading and no error */}
        {!isLoading && !isError && (
          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-auto rounded-lg shadow-sm"
          />
        )}
      </div>
    </div>
  );
};

export default IdProof;
