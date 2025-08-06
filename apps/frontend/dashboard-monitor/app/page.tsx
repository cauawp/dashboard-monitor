// app/page.tsx ou pages/index.tsx

import { LogIn, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Bem-vindo ao Painel de Monitoramento
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Acesse o login ou vá direto para o dashboard se já estiver
          autenticado.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <LogIn size={18} />
            Login
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gray-800 text-white hover:bg-gray-900 transition"
          >
            <LayoutDashboard size={18} />
            Ir para o Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
