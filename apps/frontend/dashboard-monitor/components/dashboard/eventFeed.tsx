"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  LogIn,
  LogOut,
  UserPlus,
  ShoppingCart,
} from "lucide-react";

interface EventFeedProps {
  events: any[];
}

const eventLabels: Record<string, string> = {
  login: "Login",
  logout: "Logout",
  signup: "Cadastro",
  purchase: "Compra",
};

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "login":
      return <LogIn className="text-green-500" size={20} />;
    case "logout":
      return <LogOut className="text-gray-400" size={20} />;
    case "signup":
      return <UserPlus className="text-purple-500" size={20} />;
    case "purchase":
      return <ShoppingCart className="text-blue-500" size={20} />;
    default:
      return <CheckCircle className="text-gray-600" size={20} />;
  }
};

const getColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "login":
      return "text-green-400";
    case "logout":
      return "text-gray-500";
    case "signup":
      return "text-purple-400";
    case "purchase":
      return "text-blue-400";
    default:
      return "text-gray-600";
  }
};

const formatTimeAgo = (timestamp: string | Date) => {
  const seconds = Math.floor(
    (Date.now() - new Date(timestamp).getTime()) / 1000
  );

  if (seconds < 60) return `${seconds}s atrás`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
};

export default function EventFeed({ events }: EventFeedProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4 rounded-xl shadow-md max-h-[800px] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Feed de eventos ao vivo</span>
        </div>
        <span className="text-sm text-muted-foreground">
          Último evento:{" "}
          {events?.[0] ? formatTimeAgo(events[0].timestamp) : "—"}
        </span>
      </div>

      <div className="space-y-2">
        {events.map((e) => (
          <div
            key={e._id}
            className="rounded-md p-3 flex items-start justify-between"
          >
            <div className="flex items-center gap-3">
              {getIcon(e.type)}
              <div className="flex flex-col">
                <div className={`font-semibold capitalize ${getColor(e.type)}`}>
                  {eventLabels[e.type.toLowerCase()] ?? e.type}
                </div>
                <div className="text-sm text-muted-foreground">{e.userId}</div>
                {e.type.toLowerCase() === "purchase" && e.value && (
                  <div className="text-sm text-blue-300">
                    Valor: R$ {Number(e.value).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <Badge
                variant="outline"
                className="text-green-500 border-green-500 text-xs"
              >
                sucesso
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(e.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
