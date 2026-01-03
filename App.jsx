import React, { useState } from 'react';
import { LayoutDashboard, Users, Calendar as CalendarIcon, Settings, Filter, PieChart } from 'lucide-react';
import Sidebar from './src/components/layout/Sidebar';
import Topbar from './src/components/layout/Topbar';
import DashboardView from './src/views/DashboardView';
import FunnelView from './src/views/FunnelView';
import NewPatientModal from './src/components/modals/NewPatientModal';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'funnel', label: 'Funil de Vendas', icon: Filter },
    { id: 'calendar', label: 'Agenda', icon: CalendarIcon },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'financial', label: 'Financeiro', icon: PieChart },
  ];

  return (
    <div className="flex h-screen bg-[#0F172A] font-sans selection:bg-[#3B82F6]/30 text-[#E5E7EB] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0">
        <Topbar 
          activeTab={activeTab} 
          navItems={navItems} 
          onNewPatient={() => setShowModal(true)} 
        />

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#334155] scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'funnel' && <FunnelView />}
            {activeTab !== 'dashboard' && activeTab !== 'funnel' && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-[#64748B]">
                <Settings size={48} className="mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-[#E5E7EB]">Módulo em Desenvolvimento</h3>
                <p>Esta funcionalidade estará disponível na próxima atualização.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <NewPatientModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            // Lead criado com sucesso
            // O hook useLeads vai atualizar automaticamente via polling/realtime
          }}
        />
      )}
    </div>
  );
};

export default App;

