import { NextRequest, NextResponse } from "next/server";

// Lista de rotas públicas acessíveis sem autenticação
const publicRoutes = [
  // "/",
  "/login",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isLogin = pathname === "/login";

  // Usuário autenticado
  if (token) {
    // Redireciona se tentar acessar /login ou /signup
    if (isLogin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redireciona se acessar página pública mas não for login
    if (isPublicRoute && !isLogin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Permite acesso normalmente
    return NextResponse.next();
  }

  // Usuário não autenticado tentando acessar rota protegida
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Caso contrário, permite acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|robots.txt|sitemap.xml|api/).*)",
  ],
};
