import Cookies from "js-cookie";

export const login = async (email: string, password: string) => {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const { token } = await res.json();
  Cookies.set("token", token);
};
