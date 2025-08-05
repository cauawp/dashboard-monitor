"use client";

import { useEffect, useState } from "react";

interface InsightCardProps {
  events: any[];
  lastEventTime: Date | null;
  loading: boolean;
}

export default function InsightCard({
  events,
  lastEventTime,
  loading,
}: InsightCardProps) {
  const [summary, setSummary] = useState("Gerando resumo...");

  useEffect(() => {
    if (loading) return;
    if (!events.length) {
      setSummary("Nenhum evento recente para análise.");
      return;
    }

    const compras = events.filter((e) => e.type === "compra");
    const totalCompras = compras.length;
    const totalValue = compras.reduce(
      (sum, e) => (typeof e.value === "number" ? sum + e.value : sum),
      0
    );
    const ticketMedio =
      totalCompras > 0 ? (totalValue / totalCompras).toFixed(2) : "0";

    const userCounts: Record<string, number> = {};
    events.forEach((e) => {
      userCounts[e.userId] = (userCounts[e.userId] || 0) + 1;
    });

    const topUsers = Object.entries(userCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([user]) => user)
      .join(", ");

    const primeiroEvento = events[events.length - 1]?.timestamp;
    const ultimoEvento =
      lastEventTime?.toISOString() || new Date().toISOString();

    const prompt = `
Resumo dos eventos entre ${new Date(
      primeiroEvento
    ).toLocaleString()} e ${new Date(ultimoEvento).toLocaleString()}:
- Total: ${events.length}
- Compras: ${totalCompras}
- Ticket médio: R$ ${ticketMedio}
- Top usuários: ${topUsers}

Gere um resumo conciso em linguagem natural para um dashboard executivo.
`;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/insight`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary: prompt }),
    })
      .then((res) => res.json())
      .then((data) => setSummary(data.insight || "Erro ao gerar resumo"))
      .catch(() => setSummary("Erro ao gerar resumo"));
  }, [events, lastEventTime, loading]);

  return (
    <div className="bg-blue-100 text-blue-900 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-1">Resumo (OpenAI)</h2>
      <p>{summary}</p>
    </div>
  );
}
