import React, { useMemo } from 'react';
import { UserPlus, TrendingUp, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import { useLeads } from '../hooks/useLeads';

const DashboardView = () => {
  const { leads, loading, error, refetch } = useLeads();

  // Função para normalizar status (compatibilidade com status antigos)
  const normalizeStatus = (status) => {
    if (!status) return 'novo';
    const statusMap = {
      'new': 'novo',
      'scheduled': 'agendado',
      'closed': 'convertido',
      'tratamento': 'convertido',
      'waiting': 'compareceu',
      'aguardando': 'compareceu',
    };
    return statusMap[status] || status;
  };

  // Calcula métricas operacionais
  const dashboardStats = useMemo(() => {
    // Leads Novos (últimos 7 dias) - status === 'novo'
    const newLeads = leads.filter(lead => {
      const normalizedStatus = normalizeStatus(lead.status);
      if (normalizedStatus !== 'novo') return false;
      const createdAt = new Date(lead.created_at);
      const now = new Date();
      const daysDiff = (now - createdAt) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;

    // Leads em Andamento - status IN: contato_feito, qualificado, agendado, compareceu
    const inProgressLeads = leads.filter(lead => {
      const normalizedStatus = normalizeStatus(lead.status);
      return ['contato_feito', 'qualificado', 'agendado', 'compareceu'].includes(normalizedStatus);
    }).length;

    // Leads Convertidos - status === 'convertido'
    const convertedLeads = leads.filter(lead => {
      const normalizedStatus = normalizeStatus(lead.status);
      return normalizedStatus === 'convertido';
    }).length;

    // Leads Perdidos - status === 'perdido'
    const lostLeads = leads.filter(lead => {
      const normalizedStatus = normalizeStatus(lead.status);
      return normalizedStatus === 'perdido';
    }).length;

    return [
      { title: "Leads Novos", value: newLeads.toString(), icon: UserPlus, colorTheme: "blue" },
      { title: "Em Andamento", value: inProgressLeads.toString(), icon: TrendingUp, colorTheme: "purple" },
      { title: "Convertidos", value: convertedLeads.toString(), icon: CheckCircle, colorTheme: "green" },
      { title: "Perdidos", value: lostLeads.toString(), icon: XCircle, colorTheme: "red" },
    ];
  }, [leads]);

  // Dados do gráfico de distribuição do funil
  const funnelDistribution = useMemo(() => {
    // Ordem oficial dos status
    const statusOrder = [
      'novo',
      'contato_feito',
      'qualificado',
      'agendado',
      'compareceu',
      'nao_compareceu',
      'convertido',
      'perdido'
    ];

    // Labels amigáveis
    const statusLabels = {
      'novo': 'Novo',
      'contato_feito': 'Contato Feito',
      'qualificado': 'Qualificado',
      'agendado': 'Agendado',
      'compareceu': 'Compareceu',
      'nao_compareceu': 'Não Compareceu',
      'convertido': 'Convertido',
      'perdido': 'Perdido'
    };

    // Cores por status
    const statusColors = {
      'novo': 'from-[#3B82F6] to-[#60A5FA]',
      'contato_feito': 'from-[#8B5CF6] to-[#A78BFA]',
      'qualificado': 'from-[#A855F7] to-[#C084FC]',
      'agendado': 'from-[#F59E0B] to-[#FBBF24]',
      'compareceu': 'from-[#06B6D4] to-[#22D3EE]',
      'nao_compareceu': 'from-[#F97316] to-[#FB923C]',
      'convertido': 'from-[#22C55E] to-[#4ADE80]',
      'perdido': 'from-[#EF4444] to-[#F87171]'
    };

    // Conta leads por status
    const counts = {};
    leads.forEach(lead => {
      const normalizedStatus = normalizeStatus(lead.status);
      counts[normalizedStatus] = (counts[normalizedStatus] || 0) + 1;
    });

    // Cria array de dados na ordem oficial
    const data = statusOrder.map(status => ({
      status,
      label: statusLabels[status] || status,
      count: counts[status] || 0,
      color: statusColors[status] || 'from-[#64748B] to-[#94A3B8]'
    }));

    // Calcula altura máxima para normalização
    const maxCount = Math.max(...data.map(item => item.count), 1);

    return {
      data: data.map(item => ({
        ...item,
        height: maxCount > 0 ? Math.round((item.count / maxCount) * 100) : 0
      })),
      total: leads.length
    };
  }, [leads]);

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
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-8">
      {/* Header do Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#E5E7EB] mb-1">Dashboard</h2>
          <p className="text-sm text-[#64748B] hidden md:block">Visão geral das métricas e performance</p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#E5E7EB] bg-[#1E293B] hover:bg-[#334155] rounded-lg border border-[#334155] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Atualizar leads"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>

      {/* KPI Grid - Métricas Operacionais - Mobile menor / Desktop destaque */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            trend=""
            icon={stat.icon}
            trendUp={true}
            colorTheme={stat.colorTheme}
          />
        ))}
      </div>

      {/* Gráfico de Distribuição do Funil - Mobile Vertical / Desktop Horizontal */}
      <Card className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-4">
          <div>
            <h3 className="text-[#E5E7EB] font-semibold text-base md:text-lg lg:text-xl mb-1">Distribuição do Funil</h3>
            <p className="text-[#64748B] text-xs md:text-sm">Status atual dos leads</p>
          </div>
          <span className="text-xs md:text-sm text-[#94A3B8] whitespace-nowrap bg-[#0F172A] px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-[#334155]">
            {funnelDistribution.total} leads total
          </span>
        </div>
        
        {/* Mobile: Gráfico Vertical */}
        <div className="md:hidden space-y-2">
          {funnelDistribution.data && funnelDistribution.data.length > 0 ? (
            funnelDistribution.data.map((item, i) => {
              const hasValue = item.count > 0;
              const minHeight = hasValue ? Math.max(item.height, 5) : 0;
              
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1 min-w-[80px]">
                    <span className="text-xs text-[#94A3B8] font-medium block mb-1.5 truncate" title={item.label}>
                      {item.label}
                    </span>
                    <div className="relative w-full h-6 bg-[#334155]/20 rounded-md overflow-hidden">
                      {hasValue && (
                        <div 
                          style={{ width: `${minHeight}%` }} 
                          className={`h-full bg-gradient-to-r ${item.color} rounded-md transition-all relative min-w-[4px] flex items-center justify-end pr-2`}
                        >
                          <span className="text-[10px] font-semibold text-white">
                            {item.count}
                          </span>
                        </div>
                      )}
                      {!hasValue && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-[#475569] opacity-50">
                          0
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full py-8 flex items-center justify-center text-[#64748B] text-sm">
              Sem dados
            </div>
          )}
        </div>

        {/* Desktop: Gráfico Horizontal */}
        <div className="hidden md:flex items-end justify-between gap-2 lg:gap-3 px-1 h-40 lg:h-48">
          {funnelDistribution.data && funnelDistribution.data.length > 0 ? (
            funnelDistribution.data.map((item, i) => {
              const hasValue = item.count > 0;
              const minHeight = hasValue ? Math.max(item.height, 8) : 0;
              
              return (
                <div 
                  key={i} 
                  className="flex-1 min-w-[50px] lg:min-w-[70px] flex flex-col items-center justify-end gap-2 h-full"
                >
                  {hasValue ? (
                    <>
                      <div className="w-full relative group">
                        <div 
                          style={{ height: `${minHeight}%` }} 
                          className={`w-full bg-gradient-to-t ${item.color} rounded-t-md transition-all relative min-h-[4px]`}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0F172A] border border-[#334155] text-xs text-[#E5E7EB] px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl pointer-events-none">
                            <div className="font-semibold">{item.count} leads</div>
                            <div className="text-[#94A3B8] text-[10px] mt-0.5">{item.label}</div>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] lg:text-xs text-[#64748B] text-center leading-tight px-1" title={item.label}>
                        {item.label}
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] lg:text-xs text-[#475569] text-center leading-tight px-1 opacity-50" title={item.label}>
                      {item.label}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#64748B] text-sm">
              Sem dados
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardView;

