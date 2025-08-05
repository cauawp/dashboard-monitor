"use client";

import { useState, useEffect } from "react";
import EventCharts from "@/components/dashboard/eventCharts";
import EventFeed from "@/components/dashboard/eventFeed";
import InsightCard from "@/components/dashboard/insightCard";
import Filters from "@/components/dashboard/filters";
import LastUpdate from "@/components/dashboard/lastUpdate";
import { useSocket } from "@/hooks/useSocket";
import Header from "@/components/header";

export default function Dashboard() {
  const [filters, setFilters] = useState({ type: "", from: "", to: "" });
  const [lastEventTime, setLastEventTime] = useState<Date | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar eventos (com filtros)

  const fetchEvents = async () => {
    setLoading(true);

    const query: Record<string, string> = {
      ...filters,
      page: "1",
      limit: "50",
    };

    if (filters.from || filters.to) {
      query["limit"] = "99999999999";
    }

    const params = new URLSearchParams(query).toString();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/events?${params}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Erro ao buscar eventos");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const { newEvent } = useSocket((event) => {
    if (event?.timestamp) {
      setLastEventTime(new Date(event.timestamp));
      setEvents((prev) => [event, ...prev]);
    }
  });

  return (
    <>
      <Header />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LastUpdate timestamp={lastEventTime} />
        </div>

        <Filters filters={filters} setFilters={setFilters} />

        <InsightCard
          events={events}
          lastEventTime={lastEventTime}
          loading={loading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EventCharts filters={filters} events={events} />
          <EventFeed events={events} />
        </div>
      </div>
    </>
  );
}
