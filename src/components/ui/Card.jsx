import React from 'react';

const Card = ({ children, className = "" }) => (
  <div className={`bg-[#1E293B] border border-[#334155] rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

export default Card;

