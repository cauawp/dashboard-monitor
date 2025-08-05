"use client";

interface EventFeedProps {
  events: any[];
}

export default function EventFeed({ events }: EventFeedProps) {
  return (
    <div className="bg-white shadow p-4 rounded max-h-80 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-2">Feed de Eventos</h2>
      <ul className="space-y-2">
        {events.map((e) => (
          <li key={e._id} className="text-sm">
            [{new Date(e.timestamp).toLocaleTimeString()}] {e.type} - {e.userId}
          </li>
        ))}
      </ul>
    </div>
  );
}
