import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isLogin = pathname === "/login";

  // Middleware NÃO consegue verificar se o usuário está logado com cookie HttpOnly

  // Permite acesso à rota pública
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Para rotas protegidas, segue o fluxo. A página em si deve verificar auth.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|robots.txt|sitemap.xml|api/).*)",
  ],
};
