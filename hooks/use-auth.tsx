"use client"

import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou senha inválidos")
        return
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await signOut({ redirect: false })
      router.push("/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    username: string
    email: string
    password: string
  }) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro ao registrar usuário")
        return
      }

      // Login automático após registro bem-sucedido
      await login(userData.email, userData.password)
    } catch (error) {
      console.error("Erro ao registrar:", error)
      setError("Ocorreu um erro ao registrar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const getUserPlan = () => {
    if (!session?.user) return "free"
    return (session.user as any).plan || "free"
  }

  const isPlanActive = () => {
    if (!session?.user) return false
    return (session.user as any).planStatus === "active"
  }

  return {
    user: session?.user,
    login,
    logout,
    register,
    isLoading: status === "loading" || isLoading,
    error,
    getUserPlan,
    isPlanActive,
  }
}

