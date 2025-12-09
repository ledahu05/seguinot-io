import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { usePartySocket } from './usePartySocket';
import type { ServerMessage, OnlineGameState } from './types';
import {
  setOnlineGame,
  setConnectionStatus,
  setOnlineRoom,
  clearOnlineRoom,
  handlePlayerLeft,
  setError,
} from '../store/quartoSlice';

// Session storage keys
const PLAYER_ID_KEY = 'quarto_player_id';
const ROOM_ID_KEY = 'quarto_room_id';

interface UseOnlineGameOptions {
  roomId: string;
  playerName: string;
  isHost: boolean;
}

interface UseOnlineGameReturn {
  state: OnlineGameState;
  createRoom: () => void;
  joinRoom: () => void;
  selectPiece: (pieceId: number) => void;
  placePiece: (position: number) => void;
  callQuarto: () => void;
  leaveRoom: () => void;
  reconnect: () => boolean;
}

export function useOnlineGame({
  roomId,
  playerName,
  isHost,
}: UseOnlineGameOptions): UseOnlineGameReturn {
  const dispatch = useDispatch();

  const [state, setState] = useState<OnlineGameState>({
    roomId: null,
    playerId: null,
    playerIndex: null,
    isHost,
    connectionStatus: 'disconnected',
    error: null,
  });

  // Handle incoming messages from server
  const handleMessage = useCallback(
    (message: ServerMessage) => {
      console.log('[useOnlineGame] Received message:', message.type, message);
      switch (message.type) {
        case 'ROOM_CREATED':
          setState((prev) => ({
            ...prev,
            roomId: message.roomId,
            playerId: message.playerId,
            playerIndex: 0,
            isHost: true,
            error: null,
          }));
          dispatch(
            setOnlineRoom({
              roomId: message.roomId,
              playerId: message.playerId,
              playerIndex: 0,
              isHost: true,
            })
          );
          // Store for reconnection
          sessionStorage.setItem(PLAYER_ID_KEY, message.playerId);
          sessionStorage.setItem(ROOM_ID_KEY, message.roomId);
          break;

        case 'ROOM_JOINED':
          setState((prev) => ({
            ...prev,
            playerId: message.playerId,
            playerIndex: 1,
            isHost: false,
            error: null,
          }));
          dispatch(
            setOnlineRoom({
              roomId,
              playerId: message.playerId,
              playerIndex: 1,
              isHost: false,
            })
          );
          dispatch(setOnlineGame(message.game));
          // Store for reconnection
          sessionStorage.setItem(PLAYER_ID_KEY, message.playerId);
          sessionStorage.setItem(ROOM_ID_KEY, roomId);
          break;

        case 'PLAYER_JOINED':
          dispatch(setOnlineGame(message.game));
          break;

        case 'STATE_UPDATE':
          dispatch(setOnlineGame(message.game));
          break;

        case 'PLAYER_LEFT':
          dispatch(handlePlayerLeft({ reason: message.reason }));
          break;

        case 'GAME_OVER':
          dispatch(setOnlineGame(message.game));
          // Don't clear online room - we need playerIndex to show win/lose result
          // Only clear session storage to prevent reconnection to finished game
          sessionStorage.removeItem(PLAYER_ID_KEY);
          sessionStorage.removeItem(ROOM_ID_KEY);
          break;

        case 'ERROR':
          setState((prev) => ({
            ...prev,
            error: message.message,
          }));
          dispatch(setError(message.message));
          break;
      }
    },
    [dispatch, roomId]
  );

  const handleOpen = useCallback(() => {
    dispatch(setConnectionStatus('connected'));
    setState((prev) => ({ ...prev, connectionStatus: 'connected' }));
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(setConnectionStatus('disconnected'));
    setState((prev) => ({ ...prev, connectionStatus: 'disconnected' }));
  }, [dispatch]);

  const { send, close, connectionStatus } = usePartySocket({
    roomId,
    onMessage: handleMessage,
    onOpen: handleOpen,
    onClose: handleClose,
  });

  // Sync connection status with state
  useEffect(() => {
    setState((prev) => ({ ...prev, connectionStatus }));
    dispatch(setConnectionStatus(connectionStatus));
  }, [connectionStatus, dispatch]);

  const createRoom = useCallback(() => {
    send({ type: 'CREATE_ROOM', playerName });
  }, [send, playerName]);

  const joinRoom = useCallback(() => {
    send({ type: 'JOIN_ROOM', playerName });
  }, [send, playerName]);

  const selectPiece = useCallback(
    (pieceId: number) => {
      send({ type: 'SELECT_PIECE', pieceId });
    },
    [send]
  );

  const placePiece = useCallback(
    (position: number) => {
      send({ type: 'PLACE_PIECE', position });
    },
    [send]
  );

  const callQuarto = useCallback(() => {
    send({ type: 'CALL_QUARTO' });
  }, [send]);

  const leaveRoom = useCallback(() => {
    send({ type: 'LEAVE_ROOM' });
    close();
    dispatch(clearOnlineRoom());
    // Clear session storage
    sessionStorage.removeItem(PLAYER_ID_KEY);
    sessionStorage.removeItem(ROOM_ID_KEY);
  }, [send, close, dispatch]);

  const reconnect = useCallback((): boolean => {
    const storedPlayerId = sessionStorage.getItem(PLAYER_ID_KEY);
    const storedRoomId = sessionStorage.getItem(ROOM_ID_KEY);

    if (storedPlayerId && storedRoomId === roomId) {
      send({ type: 'RECONNECT', playerId: storedPlayerId });
      return true;
    }
    return false;
  }, [send, roomId]);

  return {
    state,
    createRoom,
    joinRoom,
    selectPiece,
    placePiece,
    callQuarto,
    leaveRoom,
    reconnect,
  };
}
