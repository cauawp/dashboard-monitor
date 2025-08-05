// app/dashboard/components/LastUpdate.tsx
"use client";

import { useEffect, useState } from "react";

interface Props {
  timestamp: Date | null;
}

export default function LastUpdate({ timestamp }: Props) {
  const [diff, setDiff] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (!timestamp) return;
      const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
      setDiff(`Último evento há ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <p className="text-sm text-gray-600">{diff}</p>;
}
