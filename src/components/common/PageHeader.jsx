
import React from 'react';

const PageHeader = ({ title, description, action }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-medical-dark">{title}</h1>
          {description && <p className="mt-1 text-gray-500">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
