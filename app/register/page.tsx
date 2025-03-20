"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scale, Eye, EyeOff, Mail, Lock, User, Building } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const username = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    await register({
      username,
      email,
      password,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-purple-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
            LexIA
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/70 p-8 rounded-2xl border border-gray-700 shadow-xl backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
                Crie sua conta
              </h1>
              <p className="text-gray-400 mt-2">Comece a usar assistentes de IA especializados para advogados</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Seu nome completo"
                    required
                    className="pl-10 bg-slate-900/50 border-gray-700 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    className="pl-10 bg-slate-900/50 border-gray-700 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Escritório/Empresa</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="company"
                    name="company"
                    placeholder="Nome do seu escritório"
                    className="pl-10 bg-slate-900/50 border-gray-700 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-slate-900/50 border-gray-700 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-center">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

