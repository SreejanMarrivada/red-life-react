
import React from 'react';

const DashboardCard = ({ title, children, className = '' }) => {
  return (
    <div className={`dashboard-card ${className}`}>
      {title && <h3 className="text-lg font-semibold text-medical-dark mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default DashboardCard;
