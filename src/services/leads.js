/**
 * Serviço para criação de leads via Edge Function
 * MVP: Usa o mesmo backend que N8N/IA
 * 
 * Todas as funções retornam { success: boolean, data?: Object, error?: string }
 * Nunca lança exceções - sempre retorna objeto padronizado
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const CRM_API_KEY = import.meta.env.VITE_CRM_API_KEY || 'x7mbOpMYxMAlHeFF';

/**
 * Cria um lead manualmente via Edge Function
 * 
 * @param {Object} leadData - Dados do lead
 * @param {string} leadData.name - Nome do lead
 * @param {string} leadData.phone - Telefone (obrigatório)
 * @param {string|null} leadData.email - Email (opcional)
 * @param {string|null} leadData.notes - Notas (opcional)
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 * 
 * @example
 * const result = await createLeadManual({ phone: '11999999999', name: 'João' });
 * if (result.success) {
 *   console.log('Lead criado:', result.data);
 * } else {
 *   console.error('Erro:', result.error);
 * }
 */
export const createLeadManual = async (leadData) => {
  try {
    // Desestruturação com valores padrão
    const { name, phone, email, notes } = leadData || {};

    // Validação: telefone é obrigatório e deve ser string
    if (!phone || typeof phone !== 'string') {
      return {
        success: false,
        error: 'Telefone é obrigatório'
      };
    }

    // Remove caracteres não numéricos do telefone
    const cleanPhone = phone.replace(/\D/g, '');

    // Validação: telefone deve ter pelo menos alguns dígitos após limpeza
    if (cleanPhone.length < 10) {
      return {
        success: false,
        error: 'Telefone inválido'
      };
    }

    // Validação: URL do Supabase deve estar configurada
    if (!SUPABASE_URL) {
      return {
        success: false,
        error: 'Configuração do Supabase não encontrada'
      };
    }

    let response;
    try {
      // Supabase Functions requires Authorization header even with verify_jwt=false
      // We use anon key here - the function will validate X-CRM-API-KEY instead
      const headers = {
        'Content-Type': 'application/json',
        'x-crm-api-key': CRM_API_KEY,
      };
      
      // Add Authorization header if anon key is available (required by Supabase gateway)
      if (SUPABASE_ANON_KEY) {
        headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
      }
      
      response = await fetch(`${SUPABASE_URL}/functions/v1/crm-api/api/leads`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          source: 'manual',
          name: name && typeof name === 'string' ? name.trim() || null : null,
          phone: cleanPhone,
          email: email && typeof email === 'string' ? email.trim() || null : null,
          notes: notes && typeof notes === 'string' ? notes.trim() || null : null,
        }),
      });
    } catch (fetchError) {
      // Erro de rede ou fetch
      return {
        success: false,
        error: fetchError.message || 'Erro de conexão ao criar lead'
      };
    }

    // Tratamento de erro para response.ok === false
    if (!response.ok) {
      let errorMessage = 'Erro ao criar lead';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        // Se não conseguir parsear JSON, usa status text
        errorMessage = response.statusText || `Erro HTTP ${response.status}`;
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    // Parse da resposta de sucesso
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // Se não conseguir parsear JSON de sucesso, retorna erro
      return {
        success: false,
        error: 'Resposta inválida do servidor'
      };
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    // Catch final para qualquer erro não previsto
    console.error('Error creating lead:', error);
    return {
      success: false,
      error: error?.message || 'Erro inesperado ao criar lead'
    };
  }
};

/**
 * Atualiza um lead existente via Edge Function
 * 
 * @param {string} leadId - ID do lead a ser atualizado
 * @param {Object} updateData - Dados a serem atualizados
 * @param {string} [updateData.name] - Nome do lead
 * @param {string} [updateData.phone] - Telefone
 * @param {string|null} [updateData.email] - Email
 * @param {string} [updateData.status] - Status do lead
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 * 
 * @example
 * const result = await updateLead('lead-id-123', { name: 'João Silva', status: 'contato_feito' });
 * if (result.success) {
 *   console.log('Lead atualizado:', result.data);
 * } else {
 *   console.error('Erro:', result.error);
 * }
 */
export const updateLead = async (leadId, updateData) => {
  try {
    // Validação: leadId é obrigatório
    if (!leadId || typeof leadId !== 'string') {
      return {
        success: false,
        error: 'ID do lead é obrigatório'
      };
    }

    // Validação: deve haver dados para atualizar
    if (!updateData || typeof updateData !== 'object') {
      return {
        success: false,
        error: 'Dados para atualização são obrigatórios'
      };
    }

    // Validação: URL do Supabase deve estar configurada
    if (!SUPABASE_URL) {
      return {
        success: false,
        error: 'Configuração do Supabase não encontrada'
      };
    }

    // Prepara o payload com apenas os campos permitidos
    const payload = {};
    
    if (updateData.name !== undefined) {
      payload.name = updateData.name && typeof updateData.name === 'string' 
        ? updateData.name.trim() || null 
        : null;
    }

    if (updateData.phone !== undefined) {
      if (!updateData.phone || typeof updateData.phone !== 'string') {
        return {
          success: false,
          error: 'Telefone inválido'
        };
      }
      // Remove caracteres não numéricos do telefone
      const cleanPhone = updateData.phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        return {
          success: false,
          error: 'Telefone deve ter pelo menos 10 dígitos'
        };
      }
      payload.phone = cleanPhone;
    }

    if (updateData.email !== undefined) {
      payload.email = updateData.email && typeof updateData.email === 'string'
        ? updateData.email.trim() || null
        : null;
    }

    if (updateData.status !== undefined) {
      payload.status = updateData.status || 'novo';
    }

    // Verifica se há algo para atualizar
    if (Object.keys(payload).length === 0) {
      return {
        success: false,
        error: 'Nenhum campo válido para atualizar'
      };
    }

    let response;
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-crm-api-key': CRM_API_KEY,
      };
      
      // Add Authorization header if anon key is available (required by Supabase gateway)
      if (SUPABASE_ANON_KEY) {
        headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
      }
      
      response = await fetch(`${SUPABASE_URL}/functions/v1/crm-api/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(payload),
      });
    } catch (fetchError) {
      // Erro de rede ou fetch
      return {
        success: false,
        error: fetchError.message || 'Erro de conexão ao atualizar lead'
      };
    }

    // Tratamento de erro para response.ok === false
    if (!response.ok) {
      let errorMessage = 'Erro ao atualizar lead';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        // Se não conseguir parsear JSON, usa status text
        errorMessage = response.statusText || `Erro HTTP ${response.status}`;
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    // Parse da resposta de sucesso
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // Se não conseguir parsear JSON de sucesso, retorna erro
      return {
        success: false,
        error: 'Resposta inválida do servidor'
      };
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    // Catch final para qualquer erro não previsto
    console.error('Error updating lead:', error);
    return {
      success: false,
      error: error?.message || 'Erro inesperado ao atualizar lead'
    };
  }
};

