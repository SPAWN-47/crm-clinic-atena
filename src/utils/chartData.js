/**
 * Utilitários para processar dados do gráfico
 * MVP: Agrupamento simples por dia/mês
 */

/**
 * Calcula a data de início baseado no range selecionado
 * 
 * @param {string} range - Range: 'today' | '7d' | '14d' | '30d' | '90d' | '180d' | '365d'
 * @returns {Date} Data de início
 */
export const getStartDate = (range) => {
  const now = new Date();
  const startDate = new Date(now);

  switch (range) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '14d':
      startDate.setDate(startDate.getDate() - 14);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '90d':
      startDate.setMonth(startDate.getMonth() - 3);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '180d':
      startDate.setMonth(startDate.getMonth() - 6);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '365d':
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setMonth(0);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate.setMonth(startDate.getMonth() - 6);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
  }

  return startDate;
};

/**
 * Agrupa leads por dia
 * 
 * @param {Array} leads - Array de leads
 * @param {Date} startDate - Data de início
 * @returns {Array} Array de { date, count, label }
 */
export const groupLeadsByDay = (leads, startDate) => {
  const grouped = {};
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  // Inicializa todos os dias no range
  const days = [];
  const currentDate = new Date(startDate);
  while (currentDate <= now) {
    const dateKey = currentDate.toISOString().split('T')[0];
    grouped[dateKey] = 0;
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Conta leads por dia
  leads.forEach(lead => {
    if (!lead.created_at) return;
    const leadDate = new Date(lead.created_at);
    const dateKey = leadDate.toISOString().split('T')[0];
    if (grouped[dateKey] !== undefined) {
      grouped[dateKey]++;
    }
  });

  // Converte para array e formata labels
  return days.map(date => {
    const dateKey = date.toISOString().split('T')[0];
    return {
      date: new Date(date),
      count: grouped[dateKey] || 0,
      label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    };
  });
};

/**
 * Agrupa leads por mês
 * 
 * @param {Array} leads - Array de leads
 * @param {Date} startDate - Data de início
 * @returns {Array} Array de { date, count, label }
 */
export const groupLeadsByMonth = (leads, startDate) => {
  const grouped = {};
  const now = new Date();

  // Inicializa todos os meses no range
  const months = [];
  const currentDate = new Date(startDate);
  while (currentDate <= now) {
    const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    grouped[monthKey] = 0;
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Conta leads por mês
  leads.forEach(lead => {
    if (!lead.created_at) return;
    const leadDate = new Date(lead.created_at);
    const monthKey = `${leadDate.getFullYear()}-${String(leadDate.getMonth() + 1).padStart(2, '0')}`;
    if (grouped[monthKey] !== undefined) {
      grouped[monthKey]++;
    }
  });

  // Converte para array e formata labels
  return months.map(date => {
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return {
      date: new Date(date),
      count: grouped[monthKey] || 0,
      label: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    };
  });
};

/**
 * Processa dados do gráfico baseado no range
 * 
 * @param {Array} leads - Array de leads
 * @param {string} range - Range selecionado
 * @returns {Object} { data, labels, total }
 */
export const processChartData = (leads, range) => {
  if (!leads || leads.length === 0) {
    return {
      data: [],
      labels: [],
      total: 0
    };
  }

  const startDate = getStartDate(range);
  
  // Filtra leads no período
  const filteredLeads = leads.filter(lead => {
    if (!lead.created_at) return false;
    const leadDate = new Date(lead.created_at);
    return leadDate >= startDate;
  });

  // Decide se agrupa por dia ou mês
  const isShortRange = ['today', '7d', '14d', '30d'].includes(range);
  const grouped = isShortRange
    ? groupLeadsByDay(filteredLeads, startDate)
    : groupLeadsByMonth(filteredLeads, startDate);

  // Limita a 6 barras (pega os últimos 6 períodos se houver mais de 6)
  const last6 = grouped.length > 6 ? grouped.slice(-6) : grouped;

  // Calcula alturas normalizadas
  const counts = last6.map(item => item.count);
  const max = Math.max(...counts, 1);
  const heights = counts.map(count => max > 0 ? Math.round((count / max) * 100) : 0);

  return {
    data: last6.map((item, index) => ({
      date: item.date,
      count: item.count,
      label: item.label,
      height: heights[index]
    })),
    labels: last6.map(item => item.label),
    total: filteredLeads.length
  };
};

