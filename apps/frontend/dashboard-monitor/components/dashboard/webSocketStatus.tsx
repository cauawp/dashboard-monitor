"use client";

import { Button } from "@/components/ui/button";

interface Props {
  isPaused: boolean;
  onToggle: () => void;
}

export default function WebSocketStatus({ isPaused, onToggle }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-md shadow border">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 ${
            !isPaused ? "bg-green-500" : "bg-red-500"
          } rounded-full animate-pulse`}
        ></span>

        <div>
          <span className="font-semibold">Monitoramento em tempo real</span>
          <span className="text-sm text-muted-foreground ml-2">
            {isPaused ? "Pausado" : "Conectado ao WebSocket"}
          </span>
        </div>
      </div>

      <Button
        variant="destructive"
        size="sm"
        onClick={onToggle}
        className="ml-auto cursor-pointer"
      >
        {isPaused ? "Retomar feed" : "Pausar feed"}
      </Button>
    </div>
  );
}
