/**
 * Função utilitária para filtrar leads por período
 * MVP: Cálculo simples baseado em created_at
 */

/**
 * Filtra leads por período rolling (baseado em Date.now())
 * 
 * @param {Array} leads - Array de leads
 * @param {string} period - Período: 'today' | '7d' | '14d' | '30d' | '90d' | '180d' | '365d'
 * @returns {Array} Leads filtrados
 */
export const filterLeadsByPeriod = (leads, period) => {
  if (!leads || leads.length === 0) return [];

  const now = new Date();
  const nowTime = now.getTime();
  let startTime;

  switch (period) {
    case 'today':
      // Últimas 24 horas
      startTime = nowTime - (24 * 60 * 60 * 1000);
      break;
    case '7d':
      // 7 dias
      startTime = nowTime - (7 * 24 * 60 * 60 * 1000);
      break;
    case '14d':
      // 14 dias
      startTime = nowTime - (14 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      // 30 dias (1 mês)
      startTime = nowTime - (30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      // 90 dias (3 meses)
      startTime = nowTime - (90 * 24 * 60 * 60 * 1000);
      break;
    case '180d':
      // 180 dias (6 meses)
      startTime = nowTime - (180 * 24 * 60 * 60 * 1000);
      break;
    case '365d':
      // 365 dias (1 ano)
      startTime = nowTime - (365 * 24 * 60 * 60 * 1000);
      break;
    default:
      return leads;
  }

  return leads.filter(lead => {
    if (!lead.created_at) return false;
    const leadDate = new Date(lead.created_at);
    const leadTime = leadDate.getTime();
    return leadTime >= startTime && leadTime <= nowTime;
  });
};

/**
 * Conta leads por período
 * 
 * @param {Array} leads - Array de leads
 * @param {string} period - Período
 * @returns {number} Quantidade de leads
 */
export const countLeadsByPeriod = (leads, period) => {
  return filterLeadsByPeriod(leads, period).length;
};

