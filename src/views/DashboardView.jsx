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
      { title: "Leads Novos", value: newLeads.toString(), icon: UserPlus, color: "text-[#3B82F6]" },
      { title: "Em Andamento", value: inProgressLeads.toString(), icon: TrendingUp, color: "text-[#F59E0B]" },
      { title: "Convertidos", value: convertedLeads.toString(), icon: CheckCircle, color: "text-[#22C55E]" },
      { title: "Perdidos", value: lostLeads.toString(), icon: XCircle, color: "text-[#EF4444]" },
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header com botão de refresh */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-[#E5E7EB] md:hidden">Métricas</h2>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#94A3B8] hover:text-[#E5E7EB] hover:bg-[#1E293B] rounded-lg border border-[#334155] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          title="Atualizar leads"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>

      {/* KPI Grid - Métricas Operacionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            trend=""
            icon={stat.icon}
            trendUp={true}
          />
        ))}
      </div>

      {/* Gráfico de Distribuição do Funil */}
      <Card className="p-4 md:p-6 min-h-[350px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <div>
            <h3 className="text-[#E5E7EB] font-semibold text-base md:text-lg">Distribuição do Funil</h3>
            <p className="text-[#94A3B8] text-xs mt-1">Status atual dos leads</p>
          </div>
          <span className="text-xs text-[#64748B] whitespace-nowrap bg-[#1E293B] px-3 py-1 rounded-lg border border-[#334155]">
            {funnelDistribution.total} leads total
          </span>
        </div>
        
        {/* Chart Visual */}
        <div className="h-48 md:h-64 flex items-end justify-between gap-1 md:gap-2 px-2 overflow-x-auto">
          {funnelDistribution.data && funnelDistribution.data.length > 0 ? (
            funnelDistribution.data.map((item, i) => (
              <div 
                key={i} 
                className="flex-1 min-w-[60px] md:min-w-[80px] bg-[#334155]/30 rounded-t-lg relative group hover:bg-[#334155]/50 transition-all h-full flex items-end"
              >
                <div 
                  style={{ height: `${item.height}%` }} 
                  className={`w-full bg-gradient-to-t ${item.color} opacity-80 group-hover:opacity-100 rounded-t-sm transition-all relative`}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0F172A] border border-[#334155] text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
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
        
        {/* Labels */}
        {funnelDistribution.data && funnelDistribution.data.length > 0 && (
          <div className="flex justify-between mt-4 text-xs text-[#64748B] overflow-x-auto gap-1">
            {funnelDistribution.data.map((item, i) => (
              <span key={i} className="flex-1 text-center whitespace-nowrap truncate" title={item.label}>
                {item.label}
              </span>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardView;

