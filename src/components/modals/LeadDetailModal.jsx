import React from 'react';
import { X, Phone, Mail, Clock } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LeadTimeline from '../lead/LeadTimeline';

/**
 * Modal de detalhes do lead com timeline
 * MVP: Informações principais + timeline de eventos
 */
const LeadDetailModal = ({ lead, onClose }) => {
  if (!lead) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[#334155] flex justify-between items-center sticky top-0 bg-[#1E293B] z-10">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#E5E7EB]">Detalhes do Lead</h2>
            <p className="text-[#94A3B8] text-xs md:text-sm">Informações e histórico</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#E5E7EB] p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Informações Principais */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-[#E5E7EB]">Informações</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#94A3B8] mb-1 block">Nome</label>
                <p className="text-[#E5E7EB]">{lead.name || 'Sem nome'}</p>
              </div>
              
              <div>
                <label className="text-xs text-[#94A3B8] mb-1 block">Telefone</label>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#64748B]" />
                  <p className="text-[#E5E7EB]">{lead.phone || 'Sem telefone'}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#94A3B8] mb-1 block">Status</label>
                <p className="text-[#E5E7EB]">{lead.status || 'Sem status'}</p>
              </div>

              <div>
                <label className="text-xs text-[#94A3B8] mb-1 block">Criado em</label>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#64748B]" />
                  <p className="text-[#E5E7EB] text-sm">{formatDate(lead.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-[#E5E7EB]">Timeline de Eventos</h3>
            <div className="bg-[#0F172A] rounded-lg p-3 md:p-4 border border-[#334155]">
              <LeadTimeline leadId={lead.id} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-[#334155] bg-[#1E293B] flex justify-end gap-3 rounded-b-xl">
          <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto">
            Fechar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LeadDetailModal;

