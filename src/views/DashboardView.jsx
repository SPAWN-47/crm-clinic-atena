import React, { useMemo, useState } from 'react';
import { Users, UserPlus, Calendar as CalendarIcon, Activity, MoreHorizontal, Clock, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';
import { useLeads } from '../hooks/useLeads';
import { processChartData } from '../utils/chartData';

const DashboardView = () => {
  const { leads, loading, error, refetch } = useLeads();
  const [selectedPeriod, setSelectedPeriod] = useState('180d'); // Default: 6 meses

  const iconMap = {
    Users,
    UserPlus,
    CalendarIcon,
    Activity,
  };

  const dashboardStats = useMemo(() => {
    const totalLeads = leads.length;
    const newLeads = leads.filter(lead => {
      const createdAt = new Date(lead.created_at);
      const now = new Date();
      const daysDiff = (now - createdAt) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;
    const scheduled = leads.filter(lead => lead.status === 'scheduled' || lead.status === 'agendado').length;
    const conversionRate = totalLeads > 0 ? ((scheduled / totalLeads) * 100).toFixed(1) : 0;

    return [
      { title: "Leads Totais", value: totalLeads.toString(), trend: "0%", iconKey: "Users", trendUp: true },
      { title: "Novos Pacientes", value: newLeads.toString(), trend: "0%", iconKey: "UserPlus", trendUp: true },
      { title: "Agendamentos", value: scheduled.toString(), trend: "0%", iconKey: "CalendarIcon", trendUp: true },
      { title: "Taxa Conversão", value: `${conversionRate}%`, trend: "0%", iconKey: "Activity", trendUp: true },
    ];
  }, [leads]);

  // Processa dados do gráfico baseado no período selecionado
  const chartData = useMemo(() => {
    return processChartData(leads, selectedPeriod);
  }, [leads, selectedPeriod]);

  const upcomingAppointments = useMemo(() => {
    // For now, return empty array as we don't have appointments table yet
    return [];
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-[#64748B]">Carregando leads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-[#EF4444]">
        <p className="mb-2">Erro ao carregar leads:</p>
        <p className="text-sm text-[#64748B]">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header com botão de refresh */}
      <div className="flex justify-end">
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#94A3B8] hover:text-[#E5E7EB] hover:bg-[#1E293B] rounded-lg border border-[#334155] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Atualizar leads"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            icon={iconMap[stat.iconKey]}
            trendUp={stat.trendUp}
          />
        ))}
      </div>

      {/* Charts & Lists Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-6 min-h-[350px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#E5E7EB] font-semibold text-lg">Fluxo de Pacientes</h3>
            <div className="flex gap-2 items-center">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-[#0F172A] border border-[#334155] text-[#94A3B8] text-sm rounded-lg px-3 py-1 outline-none focus:border-[#3B82F6]"
              >
                <option value="today">Hoje</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="14d">Últimos 14 dias</option>
                <option value="30d">Último mês</option>
                <option value="90d">Últimos 3 meses</option>
                <option value="180d">Últimos 6 meses</option>
                <option value="365d">Último ano</option>
              </select>
              <span className="text-xs text-[#64748B]">
                {chartData.total} leads
              </span>
            </div>
          </div>
          {/* Chart Visual */}
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {chartData.data && chartData.data.length > 0 ? (
              chartData.data.map((item, i) => (
                <div key={i} className="w-full bg-[#334155]/30 rounded-t-lg relative group hover:bg-[#334155]/50 transition-all h-full flex items-end">
                  <div style={{ height: `${item.height}%` }} className="w-full bg-gradient-to-t from-[#3B82F6] to-[#06B6D4] opacity-80 group-hover:opacity-100 rounded-t-sm transition-all relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0F172A] border border-[#334155] text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      <div className="font-medium">{item.count} leads</div>
                      <div className="text-[#94A3B8] text-[10px]">{item.label}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#64748B] text-sm">
                Sem dados
              </div>
            )}
          </div>
          {chartData.labels && chartData.labels.length > 0 && (
            <div className="flex justify-between mt-4 text-xs text-[#64748B]">
              {chartData.labels.map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Activity / Agenda */}
        <Card className="p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#334155] flex justify-between items-center">
            <h3 className="text-[#E5E7EB] font-semibold text-lg">Próximos Agendamentos</h3>
            <Button variant="ghost" className="!p-1"><MoreHorizontal size={20} /></Button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[300px] p-4 space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#334155]/30 transition-colors group cursor-pointer border border-transparent hover:border-[#334155]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F172A] flex items-center justify-center text-[#3B82F6] font-bold text-sm border border-[#334155]">
                      {item.time}
                    </div>
                    <div>
                      <p className="text-[#E5E7EB] font-medium text-sm">{item.name}</p>
                      <p className="text-[#94A3B8] text-xs">{item.type}</p>
                    </div>
                  </div>
                  <div>
                     {item.status === 'confirmado' && <Badge type="success">Confirmado</Badge>}
                     {item.status === 'pendente' && <Badge type="warning">Pendente</Badge>}
                     {item.status === 'cancelado' && <Badge type="error">Cancelado</Badge>}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-[#64748B] text-sm">
                Nenhum agendamento próximo
              </div>
            )}
          </div>
          <div className="p-4 border-t border-[#334155] bg-[#111827]/50">
            <Button variant="ghost" className="w-full text-sm">Ver Agenda Completa</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;

