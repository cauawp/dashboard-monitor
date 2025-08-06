"use client";

import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";

Chart.register(...registerables);

interface EventChartsProps {
  filters: { type: string; from: string; to: string };
  events: any[];
}

const typeLabels: Record<string, string> = {
  purchase: "Compra",
  login: "Login",
  logout: "Logout",
  error: "Erro",
  signup: "Cadastro",
  click: "Clique",
  view: "Visualização",
};

export default function EventCharts({ filters, events }: EventChartsProps) {
  const [volumeData, setVolumeData] = useState<any>(null);
  const [distributionData, setDistributionData] = useState<any>(null);
  const [topUsersData, setTopUsersData] = useState<any>(null);

  const processEvents = (events: any[]) => {
    if (!events.length) {
      setVolumeData(null);
      setDistributionData(null);
      setTopUsersData(null);
      return;
    }

    // --- Por data ou hora
    const dates = events.map((e) =>
      new Date(e.timestamp).toISOString().slice(0, 10)
    );
    const uniqueDates = [...new Set(dates)];
    const isSameDay = uniqueDates.length === 1;

    const volumeMap: Record<string, number> = {};
    events.forEach((e) => {
      const dateObj = new Date(e.timestamp);
      let key;

      if (isSameDay) {
        key = dateObj.toISOString().slice(11, 16); // HH:mm
      } else {
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // getMonth() é zero-indexado
        const year = dateObj.getFullYear();
        key = `${day}/${month}/${year}`; // DD/MM/YYYY
      }

      volumeMap[key] = (volumeMap[key] || 0) + 1;
    });

    const volumeLabels = Object.keys(volumeMap).sort();
    const volumeCounts = volumeLabels.map((label) => volumeMap[label]);

    const volume = {
      labels: volumeLabels,
      datasets: [
        {
          label: isSameDay ? "Eventos por horário" : "Eventos por dia",
          data: volumeCounts,
          fill: true,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    };

    // --- Por tipo
    const typeMap: Record<string, number> = {};
    events.forEach((e) => {
      const readableType = typeLabels[e.type] || e.type;
      typeMap[readableType] = (typeMap[readableType] || 0) + 1;
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

    // --- Top usuários
    const userMap: Record<string, number> = {};
    events.forEach((e) => {
      userMap[e.userId] = (userMap[e.userId] || 0) + 1;
    });

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

  useEffect(() => {
    processEvents(events);
  }, [events]);

  if (!events.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Nenhum evento encontrado para o intervalo selecionado.
      </div>
    );
  }

  if (!volumeData || !distributionData || !topUsersData) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Carregando gráficos...
      </div>
    );
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
