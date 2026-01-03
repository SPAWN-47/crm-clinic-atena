import React from 'react';

const Badge = ({ type, children }) => {
  const styles = {
    success: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
    warning: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    info: "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20",
    error: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
    neutral: "bg-[#64748B]/10 text-[#94A3B8] border-[#64748B]/20",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[type] || styles.neutral}`}>
      {children}
    </span>
  );
};

export default Badge;

