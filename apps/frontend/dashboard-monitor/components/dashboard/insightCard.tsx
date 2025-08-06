"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Clock } from "lucide-react";

interface Insight {
  title: string;
  description: string;
}

interface InsightCardProps {
  events: any[];
  lastEventTime: Date | null;
  loading: boolean;
  eventType: string;
}

export default function InsightCard({
  events,
  lastEventTime,
  loading,
  eventType,
}: InsightCardProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  const [insightError, setInsightError] = useState(false);

  useEffect(() => {
    if (loading || !events.length) return;

    const compras = events.filter((e) => e.type === "purchase");
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
Você é um analista de dados para um dashboard executivo.

Receba os seguintes eventos entre ${new Date(
      primeiroEvento
    ).toLocaleString()} e ${new Date(ultimoEvento).toLocaleString()}:

- Tipo de evento analisado: ${
      eventType === "all" ? "Todos os tipos de eventos" : eventType
    }
- Total de eventos: ${events.length}
- Compras: ${totalCompras}
- Ticket médio: R$ ${ticketMedio}
- Top usuários: ${topUsers}

Gere um resumo ${
      eventType === "all"
        ? "global dos eventos observados, destacando padrões gerais e comportamentos."
        : `focado especificamente em eventos do tipo "${eventType}", descrevendo comportamentos, tendências e observações para este tipo.`
    }

Responda sempre no seguinte formato em português:

[
  {
    "title": "Título do Insight",
    "description": "Descrição detalhada do insight."
  },
  {
    "title": "Título do Insight",
    "description": "Descrição detalhada do insight."
  },
  {
    "title": "Título do Insight",
    "description": "Descrição detalhada do insight."
  }
]

Não adicione texto fora do JSON.
`;

    const fetchInsights = () => {
      setInsightError(false); // resetar erro
      fetch(`${process.env.NEXT_PUBLIC_API_URL}api/insight`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: prompt }),
      })
        .then((res) => res.json())
        .then((data) => {
          try {
            if (!data?.insight || typeof data.insight !== "string") {
              throw new Error("Resposta da API inválida ou insight ausente");
            }

            const parsed = JSON.parse(data.insight);
            setInsights(parsed);
            setLastAnalysis(new Date());
            setInsightError(false);
          } catch (err) {
            console.error("Erro ao parsear insight:", err, data);
            setInsightError(true);
          }
        });
    };

    fetchInsights();

    const interval = setInterval(() => {
      fetchInsights();
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  }, [events, lastEventTime, loading, eventType]);

  const icons = [
    <TrendingUp className="text-green-400" size={20} />,
    <AlertCircle className="text-red-500" size={20} />,
    <Clock className="text-blue-400" size={20} />,
  ];

  return (
    <Card className="p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-white font-semibold">AI Insights</h2>
          <p className="text-sm text-muted-foreground">
            Última análise:{" "}
            {lastAnalysis
              ? `${Math.floor(
                  (Date.now() - lastAnalysis.getTime()) / 60000
                )} minutos atrás`
              : "—"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 ${
              !insightError ? "bg-green-500" : "bg-red-500"
            } rounded-full`}
          ></span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {insightError ? (
          <div className="text-sm text-red-500">
            Erro ao gerar insights. Tentaremos novamente em instantes...
          </div>
        ) : insights.length > 0 ? (
          insights.map((insight, index) => (
            <div key={index} className="rounded-md p-3 flex items-start gap-3">
              <span className="max-w-[20px]">{icons[index] || icons[0]}</span>
              <div>
                <div className="font-semibold mb-1">{insight.title}</div>
                <div className="text-sm text-muted-foreground">
                  {insight.description}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            Gerando insights...
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground border-t border-neutral-700 pt-2 flex justify-between">
        <span>Powered by OpenAI</span>
        <span>Atualiza automaticamente a cada 5 minutos</span>
      </div>
    </Card>
  );
}
