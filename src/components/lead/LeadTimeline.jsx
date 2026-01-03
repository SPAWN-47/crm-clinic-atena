import React from 'react';
import { useLeadEvents } from '../../hooks/useLeadEvents';
import { formatRelativeTime } from '../../utils/dateUtils';

/**
 * Componente de timeline de eventos do lead
 * MVP: Lista vertical simples, sem ícones complexos
 */
const LeadTimeline = ({ leadId }) => {
  const { events, loading, error } = useLeadEvents(leadId);

  const getEventLabel = (type) => {
    const labels = {
      'lead_created': 'Lead criado',
      'lead_updated': 'Lead atualizado',
      'status_changed': 'Status alterado',
    };
    return labels[type] || type;
  };

  const getSourceLabel = (source) => {
    const labels = {
      'ia': 'IA',
      'n8n': 'N8N',
      'manual': 'Manual',
    };
    return labels[source] || source;
  };

  if (loading) {
    return (
      <div className="text-sm text-[#64748B] py-4">Carregando eventos...</div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-[#EF4444] py-4">
        Erro ao carregar eventos: {error}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-sm text-[#64748B] py-4">
        Nenhum evento registrado
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <div
          key={index}
          className="flex items-start gap-3 pb-3 border-b border-[#334155] last:border-0"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#E5E7EB] font-medium text-sm">
                {getEventLabel(event.type)}
              </span>
              <span className="text-[#64748B] text-xs">
                ({getSourceLabel(event.source)})
              </span>
            </div>
            {event.payload && typeof event.payload === 'object' && (
              <div className="text-[#94A3B8] text-xs mt-1 space-y-0.5">
                {event.payload.name && (
                  <div>Nome: {event.payload.name}</div>
                )}
                {event.payload.phone && (
                  <div>Telefone: {event.payload.phone}</div>
                )}
                {event.payload.status && (
                  <div>Status: {event.payload.status}</div>
                )}
                {event.payload.old_status && (
                  <div>Status anterior: {event.payload.old_status}</div>
                )}
                {event.payload.new_status && (
                  <div>Novo status: {event.payload.new_status}</div>
                )}
              </div>
            )}
            <div className="text-[#64748B] text-xs mt-1">
              {formatRelativeTime(event.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadTimeline;

