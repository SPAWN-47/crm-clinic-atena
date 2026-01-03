import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Card from './Card';

const StatCard = ({ title, value, trend, icon: Icon, trendUp }) => (
  <Card className="p-5 flex items-start justify-between hover:border-[#3B82F6]/50 transition-colors cursor-default">
    <div>
      <p className="text-[#94A3B8] text-sm font-medium mb-1">{title}</p>
      <h3 className="text-[#E5E7EB] text-2xl font-bold tracking-tight">{value}</h3>
      <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowUpRight size={14} className="rotate-90" />}
        {trend} <span className="text-[#64748B] font-normal ml-1">vs mês anterior</span>
      </div>
    </div>
    <div className="p-3 bg-[#334155]/30 rounded-lg text-[#3B82F6]">
      <Icon size={24} />
    </div>
  </Card>
);

export default StatCard;

