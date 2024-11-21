import React, { useEffect } from 'react';
import image from '../../assets/h-whiteAsset 2.png'; // Update the path if necessary

const ResetSuccess = () => {
  useEffect(() => {
    const checkmarkIcon = document.getElementById('checkmark-icon');
    if (checkmarkIcon) {
      checkmarkIcon.classList.add('animate-bounce');
    }
  }, []);

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen p-6"
      style={{
        background: 'linear-gradient(to bottom, #0a1f44, #1769e8, #1c2834)', // Matching gradient
      }}
    >
      {/* App Logo */}
      <img
        src={image}
        alt="App Logo"
        className="w-20 h-20 mr-5 mb-8 animate__animated animate__fadeIn"
      />

      {/* Success Icon */}
      <svg
        id="checkmark-icon"
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20 text-white mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      </svg>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-white mb-4 text-center">
        Password Reset Successful! 🎉
      </h1>

      {/* Message */}
      <p className="text-lg text-gray-300 mb-6 text-center max-w-md">
        Your password has been reset successfully. You can now log in with your new password.
      </p>
    </div>
  );
};

export default ResetSuccess;
