import { useCallback, useEffect, useRef, useState } from 'react';
import PartySocket from 'partysocket';
import type { ClientMessage, ServerMessage, ConnectionStatus } from './types';

const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST || 'localhost:1999';

interface UsePartySocketOptions {
  roomId: string;
  onMessage: (message: ServerMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

interface UsePartySocketReturn {
  send: (message: ClientMessage) => void;
  close: () => void;
  connectionStatus: ConnectionStatus;
}

export function usePartySocket({
  roomId,
  onMessage,
  onOpen,
  onClose,
  onError,
}: UsePartySocketOptions): UsePartySocketReturn {
  const socketRef = useRef<PartySocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');

  // Store callbacks in refs to avoid reconnection on callback changes
  const onMessageRef = useRef(onMessage);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
    onErrorRef.current = onError;
  }, [onMessage, onOpen, onClose, onError]);

  useEffect(() => {
    if (!roomId) {
      console.log('[usePartySocket] No roomId, skipping connection');
      return;
    }

    console.log('[usePartySocket] Creating socket for room:', roomId);
    setConnectionStatus('connecting');

    // Track if this effect has been cleaned up
    let isCleanedUp = false;

    const socket = new PartySocket({
      host: PARTYKIT_HOST,
      room: roomId,
    });

    socket.addEventListener('open', () => {
      if (isCleanedUp) {
        console.log('[usePartySocket] Ignoring OPEN event from stale socket');
        return;
      }
      console.log('[usePartySocket] Socket OPENED for room:', roomId, 'readyState:', socket.readyState);
      setConnectionStatus('connected');
      onOpenRef.current?.();
    });

    socket.addEventListener('message', (event) => {
      if (isCleanedUp) {
        console.log('[usePartySocket] Ignoring MESSAGE from stale socket');
        return;
      }
      try {
        const message = JSON.parse(event.data) as ServerMessage;
        onMessageRef.current(message);
      } catch (error) {
        console.error('[usePartySocket] Failed to parse message:', error);
      }
    });

    socket.addEventListener('close', (event) => {
      if (isCleanedUp) {
        console.log('[usePartySocket] Ignoring CLOSE event from stale socket for room:', roomId);
        return;
      }
      console.log('[usePartySocket] Socket CLOSED for room:', roomId, {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
      setConnectionStatus('disconnected');
      onCloseRef.current?.();
    });

    socket.addEventListener('error', (error) => {
      if (isCleanedUp) {
        console.log('[usePartySocket] Ignoring ERROR from stale socket');
        return;
      }
      console.error('[usePartySocket] Socket ERROR for room:', roomId, error);
      onErrorRef.current?.(error);
    });

    socketRef.current = socket;

    return () => {
      console.log('[usePartySocket] Cleanup - closing socket for room:', roomId);
      isCleanedUp = true;
      socket.close();
      socketRef.current = null;
    };
  }, [roomId]);

  const send = useCallback((message: ClientMessage) => {
    console.log('[usePartySocket] Sending message:', message.type, message);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message: WebSocket not open');
    }
  }, []);

  const close = useCallback(() => {
    socketRef.current?.close();
  }, []);

  return {
    send,
    close,
    connectionStatus,
  };
}
