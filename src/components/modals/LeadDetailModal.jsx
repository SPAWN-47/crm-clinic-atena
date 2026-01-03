import React, { useState } from 'react';
import { X, Phone, Mail, Clock, Edit2, Save, XCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LeadTimeline from '../lead/LeadTimeline';
import { updateLead } from '../../services/leads';

/**
 * Modal de detalhes do lead com timeline e edição
 * v1.2: Suporta edição de campos (name, phone, email, status)
 */
const LeadDetailModal = ({ lead, onClose, onLeadUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados dos campos editáveis
  const [editedName, setEditedName] = useState(lead?.name || '');
  const [editedPhone, setEditedPhone] = useState(lead?.phone || '');
  const [editedEmail, setEditedEmail] = useState(lead?.email || '');
  const [editedStatus, setEditedStatus] = useState(lead?.status || 'novo');

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

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Restaura valores originais
    setEditedName(lead.name || '');
    setEditedPhone(lead.phone || '');
    setEditedEmail(lead.email || '');
    setEditedStatus(lead.status || 'novo');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const updateData = {
        name: editedName,
        phone: editedPhone,
        email: editedEmail,
        status: editedStatus,
      };

      const result = await updateLead(lead.id, updateData);

      if (result.success) {
        setIsEditing(false);
        // Notifica o componente pai sobre a atualização
        if (onLeadUpdated) {
          onLeadUpdated(result.data);
        }
      } else {
        setError(result.error || 'Erro ao salvar alterações');
      }
    } catch (err) {
      setError('Erro inesperado ao salvar');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Opções de status disponíveis
  const statusOptions = [
    { value: 'novo', label: 'Novo' },
    { value: 'contato_feito', label: 'Contato Feito' },
    { value: 'qualificado', label: 'Qualificado' },
    { value: 'agendado', label: 'Agendado' },
    { value: 'compareceu', label: 'Compareceu' },
    { value: 'nao_compareceu', label: 'Não Compareceu' },
    { value: 'convertido', label: 'Convertido' },
    { value: 'perdido', label: 'Perdido' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[#334155] flex justify-between items-center sticky top-0 bg-[#1E293B] z-10">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#E5E7EB]">Detalhes do Lead</h2>
            <p className="text-[#94A3B8] text-xs md:text-sm">
              {isEditing ? 'Editando informações' : 'Informações e histórico'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#E5E7EB] p-1"
            disabled={isSaving}
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Informações Principais */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base md:text-lg font-semibold text-[#E5E7EB]">Informações</h3>
              {!isEditing && (
                <Button
                  variant="secondary"
                  onClick={handleEdit}
                  className="text-sm"
                >
                  <Edit2 size={16} className="mr-2" />
                  Editar
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label className="text-xs text-[#94A3B8] mb-1 block">Nome</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#4F46E5] transition-colors"
                    placeholder="Nome do lead"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="text-[#E5E7EB]">{lead.name || 'Sem nome'}</p>
                )}
              </div>
              
              {/* Telefone */}
              <div>
                <label className="text-xs text-[#94A3B8] mb-1 block">Telefone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#4F46E5] transition-colors"
                    placeholder="(11) 99999-9999"
                    disabled={isSaving}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#64748B]" />
                    <p className="text-[#E5E7EB]">{lead.phone || 'Sem telefone'}</p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-[#94A3B8] mb-1 block">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#4F46E5] transition-colors"
                    placeholder="email@exemplo.com"
                    disabled={isSaving}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[#64748B]" />
                    <p className="text-[#E5E7EB]">{lead.email || 'Sem email'}</p>
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="text-xs text-[#94A3B8] mb-1 block">Status</label>
                {isEditing ? (
                  <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#4F46E5] transition-colors"
                    disabled={isSaving}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-[#E5E7EB]">{lead.status || 'Sem status'}</p>
                )}
              </div>

              {/* Data de criação (não editável) */}
              {!isEditing && (
                <div>
                  <label className="text-xs text-[#94A3B8] mb-1 block">Criado em</label>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#64748B]" />
                    <p className="text-[#E5E7EB] text-sm">{formatDate(lead.created_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline - escondida durante edição */}
          {!isEditing && (
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-[#E5E7EB]">Timeline de Eventos</h3>
              <div className="bg-[#0F172A] rounded-lg p-3 md:p-4 border border-[#334155]">
                <LeadTimeline leadId={lead.id} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-[#334155] bg-[#1E293B] flex justify-end gap-3 rounded-b-xl">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                <XCircle size={16} className="mr-2" />
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto">
              Fechar
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LeadDetailModal;

