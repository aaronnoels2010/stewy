import { useEffect, useRef, useCallback } from 'react';
import { API_BASE_URL } from '@/constants/Config';

type NotificationHandler = (event: any) => void;

export function useWebSocketNotifications(
  volunteerId: string | null,
  onNotification: NotificationHandler,
  enabled: boolean = true,
) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    if (!volunteerId || !enabled) return;

    const wsUrl = API_BASE_URL.replace(/^http/, 'ws') + '/ws/socket/websocket';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      // Subscribe to volunteer topic via STOMP
      const subscribeFrame = `SUBSCRIBE\nid:sub-0\ndestination:/topic/volunteer/${volunteerId}/notifications\n\n\u0000`;
      ws.send(subscribeFrame);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onNotification(data);
      } catch {
        // Ignore non-JSON messages (e.g. STOMP heartbeats)
      }
    };

    ws.onclose = () => {
      // Reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(connect, 5000);
    };

    wsRef.current = ws;
  }, [volunteerId, enabled, onNotification]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return { disconnect, reconnect: connect };
}
