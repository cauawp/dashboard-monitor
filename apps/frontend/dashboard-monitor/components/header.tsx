"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Moon, Sun, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true); // evita hydration mismatch
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({}),
        }
      );

      if (res.ok) {
        router.push("/login");
      } else {
        const { message } = await res.json();
        setError(message || "Erro ao deslogar");
      }
    } catch {
      setError("Erro inesperado");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (error) {
      console.error("Erro: ", error);
    }
  }, [error]);

  return (
    <header className="flex justify-between items-center w-full px-6 py-4 bg-background border-b">
      <div>
        <h1 className="text-lg font-semibold">Visão geral do painel</h1>
        <p className="text-sm text-muted-foreground">
          Bem-vindo de volta! Veja o que está acontecendo.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {mounted && (
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-800" />
            )}
          </Button>
        )}

        <div className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="@user" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
