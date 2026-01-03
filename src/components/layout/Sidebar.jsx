import React from 'react';
import { LayoutDashboard, Users, Calendar as CalendarIcon, Settings, Filter, PieChart } from 'lucide-react';
import Avatar from '../ui/Avatar';

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'funnel', label: 'Funil de Vendas', icon: Filter },
    { id: 'calendar', label: 'Agenda', icon: CalendarIcon },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'financial', label: 'Financeiro', icon: PieChart },
  ];

  const handleItemClick = (itemId) => {
    setActiveTab(itemId);
    if (onClose) onClose(); // Fecha sidebar mobile ao clicar
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed md:relative
        inset-y-0 left-0 z-50
        w-64 md:w-20 lg:w-64
        bg-[#111827] border-r border-[#334155]
        flex flex-col justify-between flex-shrink-0
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
      <div>
        <div className="h-16 flex items-center justify-center md:justify-center lg:justify-start lg:px-6 px-6 border-b border-[#334155]">
          <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
            C
          </div>
          <span className="block md:hidden lg:block ml-3 font-bold text-lg tracking-tight">Clinica<span className="text-[#3B82F6]">Pro</span></span>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-900/20' 
                    : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#E5E7EB]'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-[#3B82F6] transition-colors'} />
                <span className="block md:hidden lg:block font-medium text-sm">{item.label}</span>
                {isActive && <div className="hidden md:hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#334155]">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#E5E7EB] transition-all">
          <Settings size={20} />
          <span className="block md:hidden lg:block font-medium text-sm">Configurações</span>
        </button>
        <div className="mt-4 flex items-center gap-3 px-3 py-2 bg-[#1E293B] rounded-xl border border-[#334155]">
          <Avatar fallback="DR" />
          <div className="hidden md:hidden lg:block overflow-hidden">
            <p className="text-sm font-medium text-[#E5E7EB] truncate">Dr. Ricardo</p>
            <p className="text-xs text-[#94A3B8] truncate">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;

