'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { ws_response } from './ws_response';
import { useRouter } from 'next/navigation';
import { usePosterReducers } from '@/redux/getdata/usePostReducer';

type WSEvent = {
  event: string;
  data: any;
};

type WebSocketContextType = {
  socket: WebSocket | null;
  sendMessage: (data: Record<string, any>) => void;
  isConnected: boolean;
  lastEvent: WSEvent | null;
};

export const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  sendMessage: () => { },
  isConnected: false,
  lastEvent: null,
});

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<WSEvent | null>(null);

  const dispatch = useDispatch<any>();
  const { user_data } = usePosterReducers();
  const router = useRouter();

  const access_token = user_data?.access_token;

  useEffect(() => {
    if (!access_token || socketRef.current) return;

    const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API_URL}/ws/${access_token}/`;
    console.log("url ::: " , url)
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error('⚠️ WebSocket error:', err);
    };

    ws.onmessage = (msgEvent: MessageEvent) => {
      try {
        const raw = JSON.parse(msgEvent.data);

        // ✅ normalize payload
        const parsed = {
          event: raw.event ?? raw.type, // 👈 FIX
          data: raw.data ?? raw,
        };

        if (!parsed.event) {
          console.warn('⚠️ Invalid WS payload', raw);
          return;
        }

        console.log('📥 WS EVENT:', parsed);

        setLastEvent(parsed);

        dispatch(
          ws_response(
            { evt: parsed },
            router,
            (d: any) => sendMessage(d)
          )
        );
      } catch (err) {
        console.error('⚠️ WS parse error', msgEvent.data, err);
      }
    };

    socketRef.current = ws;

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [access_token, dispatch, router]);

  const sendMessage = (data: Record<string, any>) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket: socketRef.current,
        sendMessage,
        isConnected,
        lastEvent,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
