// app/dashboard/components/Filters.tsx
"use client";

interface Props {
  filters: any;
  setFilters: (f: any) => void;
}

export default function Filters({ filters, setFilters }: Props) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-sm">Tipo</label>
        <select
          className="border p-1"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Todos</option>
          <option value="login">Login</option>
          <option value="purchase">Compra</option>
        </select>
      </div>

      <div>
        <label className="block text-sm">De</label>
        <input
          type="date"
          className="border p-1"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm">Até</label>
        <input
          type="date"
          className="border p-1"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />
      </div>
    </div>
  );
}
