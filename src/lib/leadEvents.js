/**
 * Helper simples para registrar eventos de leads
 * MVP: Persistência direta, sem complexidade
 */

import { supabase } from './supabase';

/**
 * Registra um evento para um lead
 * 
 * @param {string} leadId - UUID do lead
 * @param {string} type - Tipo do evento (ex: 'status_changed', 'message_received')
 * @param {object} payload - Dados opcionais do evento
 * @param {string} source - Origem: 'ia', 'n8n', ou 'manual'
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const registerLeadEvent = async (leadId, type, payload = null, source = 'manual') => {
  try {
    const { error } = await supabase
      .from('lead_events')
      .insert({
        lead_id: leadId,
        type,
        payload,
        source,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to register lead event:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error registering event:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Busca eventos de um lead (timeline)
 * 
 * @param {string} leadId - UUID do lead
 * @returns {Promise<{data: Array, error?: string}>}
 */
export const getLeadEvents = async (leadId) => {
  try {
    const { data, error } = await supabase
      .from('lead_events')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch lead events:', error);
      return { data: [], error: error.message };
    }

    return { data: data || [] };
  } catch (err) {
    console.error('Unexpected error fetching events:', err);
    return { data: [], error: err.message };
  }
};

/**
 * Tipos de eventos suportados (v1)
 */
export const EVENT_TYPES = {
  LEAD_CREATED: 'lead_created',
  LEAD_UPDATED: 'lead_updated',
  STATUS_CHANGED: 'status_changed',
  MESSAGE_RECEIVED: 'message_received',
  MESSAGE_SENT: 'message_sent',
  APPOINTMENT_SCHEDULED: 'appointment_scheduled',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
};

/**
 * Fontes de eventos
 */
export const EVENT_SOURCES = {
  IA: 'ia',
  N8N: 'n8n',
  MANUAL: 'manual',
};

