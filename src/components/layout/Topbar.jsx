import React from 'react';
import { Bell, Search, Plus, CalendarDays } from 'lucide-react';
import Button from '../ui/Button';

const Topbar = ({ activeTab, navItems, onNewPatient }) => {
  return (
    <header className="h-16 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#334155] flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-[#E5E7EB]">
          {navItems.find(i => i.id === activeTab)?.label}
        </h1>
        <div className="hidden md:flex h-6 w-[1px] bg-[#334155] mx-2"></div>
        <div className="hidden md:flex items-center gap-2 text-sm text-[#94A3B8] bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#334155]">
          <CalendarDays size={14} />
          <span>Hoje, 02 Jan 2026</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-2.5 text-[#64748B]" size={16} />
          <input 
            type="text" 
            placeholder="Buscar paciente..." 
            className="w-64 bg-[#111827] border border-[#334155] rounded-full pl-10 pr-4 py-2 text-sm text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
        </div>
        
        <button className="relative p-2 text-[#94A3B8] hover:text-[#E5E7EB] hover:bg-[#1E293B] rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-[#0F172A]"></span>
        </button>
        
        <Button onClick={onNewPatient} icon={Plus}>Novo Paciente</Button>
      </div>
    </header>
  );
};

export default Topbar;

