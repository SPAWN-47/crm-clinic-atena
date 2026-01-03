import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Card from './Card';

const StatCard = ({ title, value, trend, icon: Icon, trendUp, colorTheme = 'blue' }) => {
  // Cores temáticas sutis
  const colorMap = {
    blue: {
      icon: 'text-[#3B82F6]',
      bg: 'bg-[#3B82F6]/8'
    },
    purple: {
      icon: 'text-[#8B5CF6]',
      bg: 'bg-[#8B5CF6]/8'
    },
    green: {
      icon: 'text-[#22C55E]',
      bg: 'bg-[#22C55E]/8'
    },
    red: {
      icon: 'text-[#EF4444]',
      bg: 'bg-[#EF4444]/8'
    }
  };

  const colors = colorMap[colorTheme] || colorMap.blue;

  return (
    <Card className="p-4 md:p-6 flex flex-col justify-between cursor-default transition-all duration-200 hover:border-[#334155] hover:shadow-lg">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <p className="text-[#64748B] text-[10px] md:text-xs font-medium uppercase tracking-wider">{title}</p>
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon size={16} className={`md:w-[18px] md:h-[18px] ${colors.icon}`} />
        </div>
      </div>
      <div>
        <h3 className="text-[#E5E7EB] text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowUpRight size={12} className="rotate-90" />}
            {trend} <span className="text-[#64748B] font-normal ml-1">vs mês anterior</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;

