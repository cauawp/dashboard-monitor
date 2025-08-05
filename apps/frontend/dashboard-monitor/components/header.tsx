"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const { message } = await res.json();
        setError(message || "Erro ao deslogar");
      }
    } catch (err) {
      setError("Erro inesperado");
    }
  };

  return (
    <div className="flex justify-between w-full px-8 py-4">
      <h4>Dashboard Monitor</h4>
      <button className="cursor-pointer" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Header;
