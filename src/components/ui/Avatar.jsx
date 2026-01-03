import React from 'react';

const Avatar = ({ src, alt, fallback }) => (
  <div className="w-9 h-9 rounded-full bg-[#334155] border border-[#475569] flex items-center justify-center overflow-hidden">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <span className="text-xs font-bold text-[#E5E7EB]">{fallback}</span>
    )}
  </div>
);

export default Avatar;

