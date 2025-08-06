// hooks/useSocket.ts
import { useEffect, useState } from "react";
import socket from "../lib/socket";

export function useSocket(onNewEvent: (event: any) => void, isPaused: boolean) {
  const [newEvent, setNewEvent] = useState<any | null>(null);

  useEffect(() => {
    if (isPaused) return; // não conecta ao WebSocket

    console.log("useSocket mounted");
    const handler = (event: any) => {
      console.log("Evento recebido via websocket", event);
      setNewEvent(event);
      onNewEvent(event);
    };

    socket.on("new_event", handler);

    return () => {
      console.log("useSocket unmounted");
      socket.off("new_event", handler);
    };
  }, [onNewEvent, isPaused]);

  return { newEvent };
}
