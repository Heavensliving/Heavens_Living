// MetricCard.js
import React from 'react';

const MetricCard = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow flex items-center`}>
      <div className={`${color} p-3 rounded-full`}>
        {icon}
      </div>
      <div className="text-left ml-4">
        <h3 className="font-bold">{title}</h3>
        <p className="text-2xl">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;
