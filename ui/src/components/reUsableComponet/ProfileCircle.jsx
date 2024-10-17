import React, { useState, useEffect } from 'react';

const ProfileCircle = ({ imageSrc, altText, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // If no imageSrc or invalid URL, immediately show error
    if (!imageSrc || !imageSrc.startsWith('http')) {
      setIsLoading(false);
      setIsError(true);
      return;
    }

    // Reset states when imageSrc changes
    setIsLoading(true);
    setIsError(false);

    // Create an Image object to check if the image can be loaded
    const img = new Image();
    img.src = imageSrc;

    // Immediately check if the image is already cached by the browser
    if (img.complete) {
      setIsLoading(false);
      setIsError(false);
    } else {
      img.onload = () => {
        setIsLoading(false); // Image loaded successfully
        setIsError(false);
      };
      img.onerror = () => {
        setIsLoading(false); // Image loading failed
        setIsError(true);
      };
    }

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc]);

  return (
    <div className="relative w-32 h-32">
      {/* Show spinner while loading */}
      {isLoading && !isError && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="spinner"></div> {/* Loading spinner */}
        </div>
      )}

      {/* Show error message if image fails to load */}
      {isError && !isLoading && (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">
          <p className="text-gray-500 ml-2">Image not available</p>
        </div>
      )}

      {/* Profile Image */}
      {!isLoading && !isError && (
        <img
          src={imageSrc}
          alt={altText}
          onClick={onClick}
          className="w-full h-full rounded-full object-cover border-4 border-white shadow-md cursor-pointer"
        />
      )}
    </div>
  );
};

export default ProfileCircle;
