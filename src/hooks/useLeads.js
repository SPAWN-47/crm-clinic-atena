import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollingIntervalRef = useRef(null);
  const channelRef = useRef(null);

  const fetchLeads = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      const { data, error: queryError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) {
        console.error('Error fetching leads:', queryError);
        setError(queryError.message);
        return;
      }

      setLeads(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(err.message);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchLeads();

    // Setup realtime subscription (pode não funcionar se RLS bloquear)
    try {
      const channel = supabase
        .channel('leads-changes', {
          config: {
            broadcast: { self: false },
          },
        })
        .on(
          'postgres_changes',
          {
            event: '*', // INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'leads',
          },
          (payload) => {
            console.log('Realtime event received:', payload.eventType);
            // Refetch silently to avoid loading state flicker
            fetchLeads(true);
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('✅ Realtime subscription active');
          } else if (status === 'CHANNEL_ERROR') {
            console.warn('⚠️ Realtime subscription error - falling back to polling');
          }
        });

      channelRef.current = channel;
    } catch (err) {
      console.warn('Failed to setup realtime subscription:', err);
    }

    // Polling fallback: busca a cada 15 segundos
    // Funciona mesmo se realtime falhar
    pollingIntervalRef.current = setInterval(() => {
      fetchLeads(true); // Silent fetch para não mostrar loading
    }, 15000);

    // Refetch quando a janela ganha foco (usuário volta para a aba)
    const handleFocus = () => {
      console.log('Window focused - refetching leads');
      fetchLeads(true);
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchLeads]);

  return { leads, loading, error, refetch: () => fetchLeads(false) };
};

