import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionButton = ({ icon: Icon, label, bgColor, textColor, hoverColor, borderColor, navigateTo }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(navigateTo)}
      className={`${bgColor} ${borderColor} ${textColor} p-2 rounded-full flex items-center justify-center space-x-2 hover:${hoverColor} w-40`}
    >
      <Icon size={16} />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
};

export default ActionButton;
