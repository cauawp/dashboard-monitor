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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalPages: 1,
  });
  const [lastEventTime, setLastEventTime] = useState<Date | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar eventos (com filtros)

  const fetchEvents = async (pageOverride?: number, limitOverride?: number) => {
    setLoading(true);

    const page = pageOverride ?? pagination.page;
    const limit = limitOverride ?? pagination.limit;

    const query: Record<string, string> = {
      ...filters,
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
    fetchEvents(1); // volta para página 1 ao mudar filtros
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
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <div>
            Página {pagination.page} de {pagination.totalPages}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchEvents(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => fetchEvents(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Próxima
            </button>

            <label className="ml-4">
              Eventos por página:
              <select
                value={pagination.limit}
                onChange={(e) => {
                  const newLimit = parseInt(e.target.value);
                  setPagination((prev) => ({
                    ...prev,
                    page: 1,
                    limit: newLimit,
                  }));
                  fetchEvents(1, newLimit);
                }}
                className="ml-2 px-2 py-1 border rounded"
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

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
