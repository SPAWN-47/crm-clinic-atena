import React, { useState } from 'react';
import { X, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { createLeadManual } from '../../services/leads';

const NewPatientModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa erro ao digitar
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phone.trim()) {
      setError('Telefone é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createLeadManual({
      name: formData.name.trim() || null,
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      notes: formData.notes.trim() || null,
    });

    setLoading(false);

    if (result.success) {
      // Chama callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess(result.data);
      }
      // Fecha o modal ao sucesso
      // O hook useLeads vai atualizar automaticamente via polling/realtime
      onClose();
    } else {
      setError(result.error || 'Erro ao criar lead');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6 border-b border-[#334155] flex justify-between items-center sticky top-0 bg-[#1E293B] z-10">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#E5E7EB]">Novo Paciente</h2>
            <p className="text-[#94A3B8] text-xs md:text-sm">Preencha os dados básicos para cadastro</p>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="text-[#94A3B8] hover:text-[#E5E7EB] p-1 disabled:opacity-50"
          >
            <X size={24}/>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-[#EF4444] text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#94A3B8]">Nome Completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: João da Silva"
                  disabled={loading}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] placeholder-[#64748B] disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#94A3B8]">CPF <span className="text-[#64748B] text-xs">(opcional)</span></label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  disabled={loading}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] placeholder-[#64748B] disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#94A3B8]">Telefone / WhatsApp <span className="text-[#EF4444]">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-[#64748B]" size={16} />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    required
                    disabled={loading}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg pl-10 pr-4 py-2.5 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] placeholder-[#64748B] disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#94A3B8]">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-[#64748B]" size={16} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="paciente@email.com"
                    disabled={loading}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg pl-10 pr-4 py-2.5 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] placeholder-[#64748B] disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#94A3B8]">Notas Iniciais</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full h-24 bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] placeholder-[#64748B] resize-none disabled:opacity-50"
                placeholder="Observações sobre o paciente..."
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="p-4 md:p-6 border-t border-[#334155] bg-[#1E293B] flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-xl">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              icon={CheckCircle2}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'Salvando...' : 'Salvar Paciente'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewPatientModal;

