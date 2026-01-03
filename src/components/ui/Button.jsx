import React from 'react';

const Button = ({ variant = "primary", children, icon: Icon, onClick, className = "", disabled = false, type = "button" }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const variants = {
    primary: "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-lg shadow-blue-500/20",
    secondary: "bg-[#334155] hover:bg-[#475569] text-[#E5E7EB] border border-[#475569]",
    ghost: "bg-transparent hover:bg-[#334155]/50 text-[#94A3B8] hover:text-[#E5E7EB]",
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;

