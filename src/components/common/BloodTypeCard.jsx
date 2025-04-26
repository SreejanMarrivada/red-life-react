
import React from 'react';

const statusColors = {
  Available: 'bg-green-100 text-green-800',
  Low: 'bg-yellow-100 text-yellow-800',
  Critical: 'bg-red-100 text-red-800'
};

const BloodTypeCard = ({ type, quantity, status }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blood">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold text-blood-dark">{type}</div>
        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
          {status}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600">Available Units</div>
      <div className="text-2xl font-semibold mt-1">{quantity}</div>
    </div>
  );
};

export default BloodTypeCard;
