import "server-only";
import { io, Socket } from "socket.io-client";

const API_URL =
  process.env.NEXT_PUBLIC_ENDPOINT_API_URL || "http://localhost:8000";

let singletonSocket: Socket | null = null;
let connecting = false;
let connectionError = false;

type SocketResponse = {
  request?: {
    type?: string;
    action?: string;
  };
  data?: any;
  status?: boolean;
};

function getSocket(): Promise<Socket> {
  if (singletonSocket?.connected) return Promise.resolve(singletonSocket);
  if (connectionError) {
    connectionError = false;
    singletonSocket = null;
  }
  if (connecting && singletonSocket) return Promise.resolve(singletonSocket);

  connecting = true;

  return new Promise<Socket>((resolve, reject) => {
    const socket = io(API_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      forceNew: false,
    });

    const timer = setTimeout(() => {
      connecting = false;
      connectionError = true;
      try { socket.disconnect(); } catch (_) {}
      reject(new Error("Socket connection timeout"));
    }, 10000);

    socket.on("connect", () => {
      clearTimeout(timer);
      connecting = false;
      singletonSocket = socket;
      resolve(socket);
    });

    socket.on("connect_error", (err) => {
      clearTimeout(timer);
      connecting = false;
      connectionError = true;
      try { socket.disconnect(); } catch (_) {}
      reject(err);
    });
  });
}

export async function socketFetch<T = any>(
  type: string,
  action: string,
  payload: any = {},
  options: { timeout?: number } = {},
): Promise<T> {
  const timeout = options.timeout ?? 10000;

  try {
    const socket = await getSocket();

    return await new Promise<T>((resolve) => {
      const timer = setTimeout(() => {
        resolve(null as T);
      }, timeout);

      const onResponse = (_event: string, res: SocketResponse) => {
        if (
          res?.request?.type === type &&
          res?.request?.action === action
        ) {
          clearTimeout(timer);
          socket.offAny(onResponse);
          resolve(res?.data ?? (null as T));
        }
      };

      socket.onAny(onResponse);
      socket.emit("action", { type, action, payload });

      setTimeout(() => {
        socket.offAny(onResponse);
      }, timeout);
    });
  } catch (err) {
    console.error(`[socketFetch] ${type}.${action} error:`, err);
    return null as T;
  }
}
