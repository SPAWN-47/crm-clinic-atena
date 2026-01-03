import React, { useMemo, useState } from 'react';
import { Plus, MoreHorizontal, Clock, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { useLeads } from '../hooks/useLeads';
import LeadDetailModal from '../components/modals/LeadDetailModal';

const FunnelView = () => {
  const { leads, loading, error, refetch } = useLeads();
  const [selectedLead, setSelectedLead] = useState(null);

  const funnelColumns = useMemo(() => {
    // Estrutura de colunas com arrays de statuses
    const columnConfig = [
      { 
        id: 'new', 
        title: 'Novos Leads', 
        color: 'border-l-[#3B82F6]', 
        statuses: ['novo', 'new'] // Inclui null/undefined também
      },
      { 
        id: 'contact', 
        title: 'Contato / Qualificação', 
        color: 'border-l-[#8B5CF6]', 
        statuses: ['contato_feito', 'qualificado']
      },
      { 
        id: 'scheduled', 
        title: 'Agendados', 
        color: 'border-l-[#F59E0B]', 
        statuses: ['agendado', 'scheduled']
      },
      { 
        id: 'attendance', 
        title: 'Comparecimento', 
        color: 'border-l-[#06B6D4]', 
        statuses: ['compareceu', 'nao_compareceu']
      },
      { 
        id: 'treatment', 
        title: 'Tratamento', 
        color: 'border-l-[#22C55E]', 
        statuses: ['convertido', 'closed', 'tratamento']
      },
      { 
        id: 'lost', 
        title: 'Perdidos', 
        color: 'border-l-[#EF4444]', 
        statuses: ['perdido']
      },
    ];

    // Coletar todos os statuses mapeados
    const allMappedStatuses = columnConfig.flatMap(col => col.statuses);
    
    // Filtrar leads para cada coluna
    const columnsWithItems = columnConfig.map(col => {
      const items = leads.filter(lead => {
        const leadStatus = lead.status;
        
        // Se não tem status ou status não mapeado, vai para "Novos Leads"
        if (!leadStatus || !allMappedStatuses.includes(leadStatus)) {
          return col.id === 'new';
        }
        
        // Verifica se o status do lead está no array de statuses da coluna
        return col.statuses.includes(leadStatus);
      });

      return {
        ...col,
        items
      };
    });

    return columnsWithItems;
  }, [leads]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getLeadSourceLabel = (source) => {
    return source === 'manual' ? 'MANUAL' : 'IA';
  };

  const getLeadSourceBadgeType = (source) => {
    if (source === 'manual') return 'manual';
    if (source === 'ia') return 'ia';
    return 'neutral';
  };

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

  const handleLeadUpdated = (updatedLead) => {
    // Fecha o modal
    setSelectedLead(null);
    // Recarrega os leads para refletir as mudanças
    refetch();
  };

  return (
    <div className="space-y-4">
      {/* Header com botão de refresh */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#E5E7EB] md:hidden">Funil</h2>
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

      {/* Scroll horizontal em mobile, grid normal em desktop */}
      <div className="h-[calc(100vh-220px)] overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 md:gap-6 h-full min-w-max md:min-w-0 pb-4">
        {funnelColumns.map((col) => (
          <div key={col.id} className="flex-1 flex flex-col min-w-[280px] md:min-w-[250px]">
            <div className={`flex items-center justify-between mb-4 pl-3 border-l-4 ${col.color}`}>
              <h3 className="text-[#E5E7EB] font-semibold">{col.title}</h3>
              <span className="bg-[#334155] text-[#94A3B8] text-xs px-2 py-0.5 rounded-full">{col.items.length}</span>
            </div>
            
            <div className="flex-1 bg-[#111827]/30 rounded-xl p-2 space-y-3 overflow-y-auto border border-[#334155]/30">
              {col.items.length > 0 ? (
                col.items.map((lead) => (
                  <Card
                    key={lead.id}
                    className="p-4 cursor-pointer hover:border-[#3B82F6] group"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 mt-1.5 rounded-full bg-[#3B82F6]"></span>
                        <span className="text-[#94A3B8] text-xs font-medium">Lead #{lead.id?.slice(0, 8) || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge type={getLeadSourceBadgeType(lead.source)}>
                          <span className="text-[10px]">{getLeadSourceLabel(lead.source)}</span>
                        </Badge>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                          }}
                          className="text-[#64748B] hover:text-[#E5E7EB]"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-[#E5E7EB] font-medium mb-1 group-hover:text-[#3B82F6] transition-colors">
                      {lead.name || 'Sem nome'}
                    </h4>
                    <p className="text-[#64748B] text-xs mb-3">
                      {lead.phone ? `Tel: ${lead.phone}` : 'Sem telefone'}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#334155]">
                      <div className="flex items-center gap-1 text-[#94A3B8] text-xs">
                         <Clock size={12} />
                         <span>{formatDate(lead.created_at)}</span>
                      </div>
                      <Avatar fallback="DR" />
                    </div>
                  </Card>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-[#64748B] text-sm">
                  Nenhum lead nesta etapa
                </div>
              )}
              <button className="w-full py-2 border border-dashed border-[#334155] rounded-lg text-[#64748B] text-sm hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors flex items-center justify-center gap-2">
                <Plus size={16} /> Adicionar
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onLeadUpdated={handleLeadUpdated}
        />
      )}
    </div>
  );
};

export default FunnelView;

