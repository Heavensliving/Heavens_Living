import React, { useEffect } from 'react';
import image from '../../assets/h-whiteAsset 2.png';

const EmailVerificationSuccess = () => {
  useEffect(() => {
    const checkmarkIcon = document.getElementById('checkmark-icon');
    if (checkmarkIcon) {
      checkmarkIcon.classList.add('animate-bounce');
    }
  }, []);

  const getStoreLink = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      return 'https://play.google.com/store/apps/details?id=com.yourapp'; // Replace with your Play Store URL
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'https://apps.apple.com/us/app/your-app-name/id1234567890'; // Replace with your App Store URL
    }
    return 'https://play.google.com/store/apps/details?id=com.yourapp';
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen p-6"
      style={{
        background: '#98264A',
      }}
    >
      {/* Logo */}
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
        Email Verified! 🎉
      </h1>

      {/* Message */}
      <p className="text-lg text-gray-300 mb-6 text-center max-w-md">
      Your email has been successfully verified. You can now download the app and get started.
      </p>

      {/* Store Link */}
      <a
        href={getStoreLink()}
        className="w-full max-w-sm text-center py-3 px-6 bg-rose-950 hover:bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg transform transition-transform duration-300 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download the App
      </a>
    </div>
  );
};

export default EmailVerificationSuccess;
