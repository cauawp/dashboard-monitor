"use client";

import { useEffect, useState } from "react";

interface Props {
  timestamp: Date | null;
}

function formatTimeDiff(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(" ");
}

export default function LastUpdate({ timestamp }: Props) {
  const [diff, setDiff] = useState("");

  useEffect(() => {
    const updateDiff = () => {
      if (!timestamp) return;
      const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
      setDiff(`Último evento há ${formatTimeDiff(seconds)}`);
    };

    updateDiff();

    const interval = setInterval(updateDiff, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <p className="text-sm text-gray-600">{diff}</p>;
}
