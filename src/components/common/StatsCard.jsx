
import React from 'react';

const StatsCard = ({ title, value, icon, color = 'bg-medical-light' }) => {
  return (
    <div className="stats-card">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className={`p-2 rounded-full ${color}`}>{icon}</span>
      </div>
      <div className="text-2xl font-bold text-medical-dark">{value}</div>
    </div>
  );
};

export default StatsCard;
