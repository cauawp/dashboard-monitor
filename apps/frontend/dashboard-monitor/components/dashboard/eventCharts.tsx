"use client";

import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";

Chart.register(...registerables);

interface EventChartsProps {
  filters: { type: string; from: string; to: string };
  events: any[]; // array de eventos para atualizar localmente
}

export default function EventCharts({ filters, events }: EventChartsProps) {
  const [volumeData, setVolumeData] = useState<any>(null);
  const [distributionData, setDistributionData] = useState<any>(null);
  const [topUsersData, setTopUsersData] = useState<any>(null);

  // Função para processar eventos locais e gerar dados para os gráficos
  const processEvents = (events: any[]) => {
    if (!events.length) {
      setVolumeData(null);
      setDistributionData(null);
      setTopUsersData(null);
      return;
    }

    // --- Volume de eventos por data (exemplo agrupando por dia)
    const volumeMap: Record<string, number> = {};
    events.forEach((e) => {
      const day = new Date(e.timestamp).toISOString().slice(0, 10);
      volumeMap[day] = (volumeMap[day] || 0) + 1;
    });

    const volumeLabels = Object.keys(volumeMap).sort();
    const volumeCounts = volumeLabels.map((label) => volumeMap[label]);

    const volume = {
      labels: volumeLabels,
      datasets: [
        {
          label: "Eventos",
          data: volumeCounts,
          fill: true,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    };

    // --- Distribuição por tipo
    const typeMap: Record<string, number> = {};
    events.forEach((e) => {
      typeMap[e.type] = (typeMap[e.type] || 0) + 1;
    });
    const distLabels = Object.keys(typeMap);
    const distCounts = distLabels.map((label) => typeMap[label]);
    const distribution = {
      labels: distLabels,
      datasets: [
        {
          label: "Distribuição por tipo",
          data: distCounts,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    };

    // --- Top usuários por quantidade de eventos
    const userMap: Record<string, number> = {};
    events.forEach((e) => {
      userMap[e.userId] = (userMap[e.userId] || 0) + 1;
    });
    // Ordena desc e pega top 5
    const topUsersEntries = Object.entries(userMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topUsersLabels = topUsersEntries.map(([userId]) => userId);
    const topUsersValues = topUsersEntries.map(([, count]) => count);

    const topUsers = {
      labels: topUsersLabels,
      datasets: [
        {
          label: "Top usuários por número de eventos",
          data: topUsersValues,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    setVolumeData(volume);
    setDistributionData(distribution);
    setTopUsersData(topUsers);
  };

  // Atualiza gráficos localmente sempre que `events` mudam
  useEffect(() => {
    processEvents(events);
  }, [events]);

  // Opcional: fetch novos dados do backend quando filtros mudarem
  // Se quiser manter dados do backend + cache local, descomente e adapte:
  /*
  useEffect(() => {
    async function fetchAggregates() {
      const params = new URLSearchParams(filters as any).toString();
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/events/aggregate?${params}`,
          { credentials: "include" }
        );
        const data = await res.json();

        // Aqui você pode transformar data como quiser, igual ao processEvents
        // Ou apenas usar o resultado direto (se formato diferente do local)
      } catch (err) {
        console.error("Erro ao buscar agregados", err);
      }
    }
    fetchAggregates();
  }, [filters]);
  */

  if (!volumeData || !distributionData || !topUsersData) {
    return <p>Carregando gráficos...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Volume de Eventos</h3>
        <Line data={volumeData} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Distribuição por Tipo</h3>
        <Pie data={distributionData} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Top Usuários</h3>
        <Bar data={topUsersData} />
      </div>
    </div>
  );
}
