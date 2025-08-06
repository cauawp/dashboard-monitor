"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Activity, User, TrendingDown, Timer } from "lucide-react";

import Header from "@/components/header";
import InsightCard from "@/components/dashboard/insightCard";
import EventCharts from "@/components/dashboard/eventCharts";
import EventFeed from "@/components/dashboard/eventFeed";
import LastUpdate from "@/components/dashboard/lastUpdate";
import { useSocket } from "@/hooks/useSocket";
import { Input } from "@/components/ui/input";
import WebSocketStatus from "@/components/dashboard/webSocketStatus";

export default function Dashboard() {
  const [filters, setFilters] = useState({
    type: "all",
    from: "",
    to: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const [lastEventTime, setLastEventTime] = useState<Date | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const fetchEvents = async (pageOverride?: number, limitOverride?: number) => {
    setLoading(true);
    const page = pageOverride ?? pagination.page;
    const limit = limitOverride ?? pagination.limit;

    const query: Record<string, string> = {
      ...filters,
      type: filters.type === "all" ? "" : filters.type,
      page: page.toString(),
      limit: limit.toString(),
    };

    const params = new URLSearchParams(query).toString();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/events?${params}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Erro ao buscar eventos");
      const data = await res.json();
      setEvents(data.events);
      setPagination({
        page: data.pagination.page,
        limit: data.pagination.limit,
        totalPages: data.pagination.totalPages,
      });
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(1);
  }, [filters]);

  useSocket((event) => {
    if (event?.timestamp) {
      setLastEventTime(new Date(event.timestamp));
      setEvents((prev) => [event, ...prev]);
    }
  }, isPaused);

  const getMetrics = () => {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const getPreviousPeriod = () => {
      const from = filters.from ? new Date(filters.from) : todayStart;
      const to = filters.to ? new Date(filters.to) : now;

      const diffMs = to.getTime() - from.getTime();
      const prevFrom = new Date(from.getTime() - diffMs - 86400000); // -1 dia buffer
      const prevTo = new Date(to.getTime() - diffMs - 86400000);

      return { prevFrom, prevTo };
    };

    const { prevFrom, prevTo } = getPreviousPeriod();

    const currentEvents = events.filter((event) => {
      const ts = new Date(event.timestamp);
      return (
        (!filters.from || ts >= new Date(filters.from)) &&
        (!filters.to || ts <= new Date(filters.to))
      );
    });

    const previousEvents = events.filter((event) => {
      const ts = new Date(event.timestamp);
      return ts >= prevFrom && ts <= prevTo;
    });

    const totalEventsCurrent = currentEvents.length;
    const totalEventsPrevious = previousEvents.length;
    const totalEventsChange = calculateChange(
      totalEventsCurrent,
      totalEventsPrevious
    );

    const activeUsersCurrent = new Set(currentEvents.map((e) => e.userId)).size;
    const activeUsersPrevious = new Set(previousEvents.map((e) => e.userId))
      .size;
    const activeUsersChange = calculateChange(
      activeUsersCurrent,
      activeUsersPrevious
    );

    const errorCurrent = currentEvents.filter((e) => e.type === "error").length;
    const errorPrevious = previousEvents.filter(
      (e) => e.type === "error"
    ).length;
    const errorRateCurrent =
      totalEventsCurrent > 0 ? (errorCurrent / totalEventsCurrent) * 100 : 0;
    const errorRatePrevious =
      totalEventsPrevious > 0 ? (errorPrevious / totalEventsPrevious) * 100 : 0;
    const errorRateChange = calculateChange(
      errorRateCurrent,
      errorRatePrevious
    );

    const avgRtCurrent = getAverageResponseTime(currentEvents);
    const avgRtPrevious = getAverageResponseTime(previousEvents);
    const avgRtChange = calculateChange(avgRtCurrent, avgRtPrevious);

    return {
      totalEvents: { value: totalEventsCurrent, change: totalEventsChange },
      activeUsers: { value: activeUsersCurrent, change: activeUsersChange },
      errorRate: {
        value: errorRateCurrent.toFixed(1) + "%",
        change: errorRateChange,
      },
      avgResponseTime: {
        value: Math.round(avgRtCurrent) + "ms",
        change: avgRtChange,
      },
    };
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  };

  const getAverageResponseTime = (events: any[]) => {
    const rts = events
      .filter((e) => e.responseTime !== undefined)
      .map((e) => e.responseTime);
    return rts.length > 0 ? rts.reduce((a, b) => a + b, 0) / rts.length : 0;
  };

  const metricsData = getMetrics();

  const metrics = [
    {
      title: "Total de eventos",
      value: metricsData.totalEvents.value,
      change: `${metricsData.totalEvents.change.toFixed(1)}%`,
      changeColor:
        metricsData.totalEvents.change === 0
          ? "text-muted-foreground"
          : metricsData.totalEvents.change > 0
          ? "text-green-400"
          : "text-red-500",
      icon: <Activity className="text-white" size={20} />,
    },
    {
      title: "Usuários ativos",
      value: metricsData.activeUsers.value,
      change: `${metricsData.activeUsers.change.toFixed(1)}%`,
      changeColor:
        metricsData.activeUsers.change === 0
          ? "text-muted-foreground"
          : metricsData.activeUsers.change > 0
          ? "text-green-400"
          : "text-red-500",
      icon: <User className="text-white" size={20} />,
    },
    {
      title: "Taxa de erro",
      value: metricsData.errorRate.value,
      change: `${metricsData.errorRate.change.toFixed(1)}%`,
      changeColor:
        metricsData.errorRate.change === 0
          ? "text-muted-foreground"
          : metricsData.errorRate.change < 0
          ? "text-green-400"
          : "text-red-500",
      icon: <TrendingDown className="text-white" size={20} />,
    },
    {
      title: "Tempo médio de resposta",
      value: metricsData.avgResponseTime.value,
      change: `${metricsData.avgResponseTime.change.toFixed(1)}%`,
      changeColor:
        metricsData.avgResponseTime.change === 0
          ? "text-muted-foreground"
          : metricsData.avgResponseTime.change < 0
          ? "text-green-400"
          : "text-red-500",
      icon: <Timer className="text-white" size={20} />,
    },
  ];

  return (
    <>
      <Header />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LastUpdate timestamp={lastEventTime} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card
              key={index}
              className="p-6 flex justify-between items-center flex-row"
            >
              <div>
                <div className="text-sm text-muted-foreground">
                  {metric.title}
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`text-sm ${metric.changeColor}`}>
                  {metric.change}
                </div>
              </div>
              <div className="bg-neutral-800 p-2 rounded-md">{metric.icon}</div>
            </Card>
          ))}
        </div>

        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex flex-col">
              <Label className="mb-2">Tipo de evento</Label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Eventos</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="signup">Signup</SelectItem>
                  <SelectItem value="purchase">Compra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <Label className="mb-2">A partir da data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] text-left">
                    {filters.from
                      ? new Date(`${filters.from}T00:00:00`).toLocaleDateString(
                          "pt-BR"
                        )
                      : "Selecionar Data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-4 space-y-2">
                  <Input
                    type="date"
                    value={filters.from}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                  />
                  <Calendar
                    mode="single"
                    selected={
                      filters.from
                        ? new Date(`${filters.from}T00:00:00`)
                        : undefined
                    }
                    onSelect={(date) =>
                      setFilters((prev) => ({
                        ...prev,
                        from: date
                          ? date.toLocaleDateString("en-CA") // YYYY-MM-DD
                          : "",
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col">
              <Label className="mb-2">A data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] text-left">
                    {filters.to
                      ? new Date(`${filters.to}T00:00:00`).toLocaleDateString(
                          "pt-BR"
                        )
                      : "Selecionar Data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-4 space-y-2">
                  <Input
                    type="date"
                    value={filters.to}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        to: e.target.value,
                      }))
                    }
                  />
                  <Calendar
                    mode="single"
                    selected={
                      filters.to
                        ? new Date(`${filters.to}T00:00:00`)
                        : undefined
                    }
                    onSelect={(date) =>
                      setFilters((prev) => ({
                        ...prev,
                        to: date
                          ? date.toLocaleDateString("en-CA") // YYYY-MM-DD
                          : "",
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col">
              <Label className="mb-2">Eventos por página</Label>
              <Select
                value={pagination.limit.toString()}
                onValueChange={(value) => {
                  const newLimit = parseInt(value);
                  setPagination((prev) => ({
                    ...prev,
                    page: 1,
                    limit: newLimit,
                  }));
                  fetchEvents(1, newLimit);
                }}
              >
                <SelectTrigger className="w-min">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} por página
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => fetchEvents(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              &lt;
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (num) => (
                <Button
                  key={num}
                  variant={num === pagination.page ? "default" : "outline"}
                  onClick={() => fetchEvents(num)}
                >
                  {num}
                </Button>
              )
            )}
            <Button
              variant="outline"
              onClick={() => fetchEvents(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              &gt;
            </Button>
          </div>
        </Card>

        <InsightCard
          events={events}
          lastEventTime={lastEventTime}
          loading={loading}
          eventType={filters.type}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <EventCharts filters={filters} events={events} />
          </Card>

          <Card className="p-4">
            <EventFeed events={events} />
          </Card>
        </div>
        <div className="space-y-4">
          <WebSocketStatus
            isPaused={isPaused}
            onToggle={() => setIsPaused((prev) => !prev)}
          />
        </div>
      </div>
    </>
  );
}
