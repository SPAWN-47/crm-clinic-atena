import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook para buscar eventos de um lead
 * MVP: Query simples, sem paginação ou filtros complexos
 */
export const useLeadEvents = (leadId) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!leadId) {
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: queryError } = await supabase
          .from('lead_events')
          .select('type, source, created_at, payload')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false });

        if (queryError) {
          console.error('Error fetching lead events:', queryError);
          setError(queryError.message);
          return;
        }

        setEvents(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [leadId]);

  return { events, loading, error };
};

