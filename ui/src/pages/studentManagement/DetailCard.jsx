import React from 'react';

const DetailCard = ({ label, icon: Icon, detail }) => {
  return (
    <div className="bg-white flex flex-col items-start p-4">
      <h3 className="font-bold text-gray-700">{label}:</h3> {/* Label */}
      <div className="flex items-center mt-1"> {/* Flexbox for icon and detail */}
        <Icon className="text-red-500 mr-2" /> {/* Icon */}
        <p className="text-gray-600">{detail}</p>
      </div>
    </div>
  );
};

export default DetailCard;
