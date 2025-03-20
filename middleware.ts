import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Rotas que requerem autenticação
  const isAuthRoute = request.nextUrl.pathname.startsWith("/dashboard")

  // Rotas de autenticação
  const isLoginPage = request.nextUrl.pathname === "/login"
  const isRegisterPage = request.nextUrl.pathname === "/register"

  // Redirecionar usuários não autenticados para o login
  if (isAuthRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirecionar usuários autenticados para o dashboard se tentarem acessar login/registro
  if ((isLoginPage || isRegisterPage) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configurar quais caminhos devem ser verificados pelo middleware
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}

