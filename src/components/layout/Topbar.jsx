import React from 'react';
import { Bell, Search, Plus, CalendarDays, LogOut, User, Menu } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ activeTab, navItems, onNewPatient, onMenuClick }) => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  return (
    <header className="h-16 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#334155] flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Botão Menu Mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-[#94A3B8] hover:text-[#E5E7EB] hover:bg-[#1E293B] rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-lg md:text-xl font-bold text-[#E5E7EB] truncate">
          {navItems.find(i => i.id === activeTab)?.label}
        </h1>
        <div className="hidden md:flex h-6 w-[1px] bg-[#334155] mx-2"></div>
        <div className="hidden lg:flex items-center gap-2 text-sm text-[#94A3B8] bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#334155]">
          <CalendarDays size={14} />
          <span>Hoje, 02 Jan 2026</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden lg:flex relative">
          <Search className="absolute left-3 top-2.5 text-[#64748B]" size={16} />
          <input 
            type="text" 
            placeholder="Buscar paciente..." 
            className="w-64 bg-[#111827] border border-[#334155] rounded-full pl-10 pr-4 py-2 text-sm text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
        </div>
        
        <button className="hidden sm:block relative p-2 text-[#94A3B8] hover:text-[#E5E7EB] hover:bg-[#1E293B] rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-[#0F172A]"></span>
        </button>

        {user && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#1E293B] border border-[#334155] rounded-lg text-sm text-[#94A3B8]">
            <User size={14} />
            <span>{user.email}</span>
          </div>
        )}
        
        <Button onClick={onNewPatient} icon={Plus} className="hidden sm:flex">
          <span className="hidden md:inline">Novo Paciente</span>
        </Button>

        {/* Botão mobile Novo Paciente (só ícone) */}
        <button
          onClick={onNewPatient}
          className="sm:hidden p-2 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
        </button>

        <button
          onClick={handleLogout}
          className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#1E293B] rounded-full transition-colors"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;

