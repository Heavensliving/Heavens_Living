import React from 'react';

const LinkExpired = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-gray-800 px-4">
      <div className="bg-gray-10 p-6 w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold text-gray-700">Page Not Available</h1>
        <p className="text-sm text-gray-600 mt-4">
        This link is expired or unavailable. Please request a new one.
        </p>
      </div>
    </div>
  );
};

export default LinkExpired;
