"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, CheckCircle2, ArrowRight } from "lucide-react"

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const planId = searchParams.get("plan") || "free"
  const cycle = searchParams.get("cycle") || "monthly"

  // Dados dos planos
  const plans = {
    free: {
      name: "Gratuito",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "Acesso a 2 assistentes",
        "Limite de 50 mensagens por mês",
        "Upload de 5 documentos por mês",
        "Histórico de conversas por 7 dias",
      ],
    },
    pro: {
      name: "Profissional",
      monthlyPrice: 49.9,
      yearlyPrice: 479.9,
      features: [
        "Acesso a todos os assistentes",
        "Mensagens ilimitadas",
        "Upload de 100 documentos por mês",
        "Histórico de conversas ilimitado",
        "1 assistente personalizado",
        "Biblioteca de documentos",
      ],
    },
    enterprise: {
      name: "Empresarial",
      monthlyPrice: 99.9,
      yearlyPrice: 959.9,
      features: [
        "Acesso a todos os assistentes",
        "Mensagens ilimitadas",
        "Upload de documentos ilimitado",
        "Histórico de conversas ilimitado",
        "Assistentes personalizados ilimitados",
        "Biblioteca de documentos avançada",
        "Suporte prioritário 24/7",
      ],
    },
  }

  const selectedPlan = plans[planId] || plans.free
  const price = cycle === "yearly" ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const isAuthenticated = localStorage.getItem("userPlan") !== null

    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <header className="border-b border-gray-700 bg-slate-800/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-7 w-7 text-purple-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
              LexIA
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800/70 border-gray-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-white">Pagamento Confirmado!</CardTitle>
              <CardDescription className="text-gray-400">
                Seu plano {selectedPlan.name} foi ativado com sucesso.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Plano</span>
                  <span className="text-white font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Ciclo</span>
                  <span className="text-white font-medium">{cycle === "yearly" ? "Anual" : "Mensal"}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Valor</span>
                  <span className="text-white font-medium">R${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Próxima cobrança</span>
                  <span className="text-white font-medium">
                    {new Date(Date.now() + (cycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Recursos incluídos:</h3>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/dashboard">
                <Button className="flex items-center gap-2">
                  Ir para o Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

