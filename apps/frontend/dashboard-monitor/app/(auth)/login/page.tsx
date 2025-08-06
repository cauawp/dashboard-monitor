"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/auth/login`,
        {
          method: "POST",
          body: JSON.stringify({ username, password }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const { message } = await res.json();
        setError(message || "Erro ao fazer login");
      }
    } catch (err) {
      setError(`Erro inesperado: ${err}`);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-sm mx-auto mt-20 flex flex-col gap-4"
    >
      <h1 className="text-xl font-bold">Login</h1>

      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button className="cursor-pointer" type="submit">
        Entrar
      </Button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
