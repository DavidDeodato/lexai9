"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scale, Check, X, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/use-auth"

interface PlanFeature {
  name: string
  included: boolean | string
  tooltip?: string
}

interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: PlanFeature[]
  highlight?: boolean
  buttonText: string
  buttonVariant?: "default" | "outline" | "secondary"
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const { user } = useAuth()
  const router = useRouter()

  // Verificar o plano atual do usuário (simulado com localStorage)
  const userPlan = typeof window !== "undefined" ? localStorage.getItem("userPlan") || "free" : "free"

  const plans: Plan[] = [
    {
      id: "free",
      name: "Gratuito",
      description: "Para advogados individuais que desejam experimentar a plataforma.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      buttonText: userPlan === "free" ? "Plano Atual" : "Começar Gratuitamente",
      buttonVariant: "outline",
      features: [
        { name: "Acesso a 2 assistentes", included: true },
        { name: "Limite de 50 mensagens por mês", included: true },
        { name: "Upload de 5 documentos por mês", included: true },
        { name: "Histórico de conversas por 7 dias", included: true },
        { name: "Assistentes personalizados", included: false },
        { name: "Biblioteca de documentos", included: false },
        { name: "Suporte por email", included: true },
        { name: "Suporte prioritário", included: false },
      ],
    },
    {
      id: "pro",
      name: "Profissional",
      description: "Para advogados que precisam de recursos avançados.",
      monthlyPrice: 49.9,
      yearlyPrice: 479.9,
      buttonText: userPlan === "pro" ? "Plano Atual" : "Assinar Plano Pro",
      highlight: true,
      features: [
        { name: "Acesso a todos os assistentes", included: true },
        { name: "Mensagens ilimitadas", included: true },
        { name: "Upload de 100 documentos por mês", included: true },
        { name: "Histórico de conversas ilimitado", included: true },
        { name: "1 assistente personalizado", included: true },
        { name: "Biblioteca de documentos", included: true },
        { name: "Suporte por email", included: true },
        { name: "Suporte prioritário", included: false },
      ],
    },
    {
      id: "enterprise",
      name: "Empresarial",
      description: "Para escritórios de advocacia e departamentos jurídicos.",
      monthlyPrice: 99.9,
      yearlyPrice: 959.9,
      buttonText: userPlan === "enterprise" ? "Plano Atual" : "Assinar Plano Empresarial",
      buttonVariant: "secondary",
      features: [
        { name: "Acesso a todos os assistentes", included: true },
        { name: "Mensagens ilimitadas", included: true },
        { name: "Upload de documentos ilimitado", included: true },
        { name: "Histórico de conversas ilimitado", included: true },
        { name: "Assistentes personalizados ilimitados", included: true },
        { name: "Biblioteca de documentos avançada", included: true },
        { name: "Suporte por email", included: true },
        { name: "Suporte prioritário 24/7", included: true },
      ],
    },
  ]

  const discount = 20 // Desconto de 20% para planos anuais

  const handleSubscribe = (planId: string) => {
    // If it's the current plan, don't do anything
    if (planId === userPlan) return

    // For the free plan, update directly
    if (planId === "free") {
      localStorage.setItem("userPlan", "free")
      router.push("/dashboard")
      return
    }

    // For paid plans, redirect to checkout
    router.push(`/pricing/checkout?plan=${planId}&cycle=${billingCycle}`)
  }

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

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button>Criar Conta</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Planos e Preços</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades jurídicas. Todos os planos incluem acesso aos nossos
            assistentes de IA especializados em direito.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <Tabs
            defaultValue={billingCycle}
            onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
            className="bg-slate-800/50 border border-gray-700 rounded-lg p-1"
          >
            <TabsList className="grid grid-cols-2 w-[300px]">
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
              <TabsTrigger value="yearly">
                Anual <span className="ml-1 text-xs text-green-400">(-{discount}%)</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`bg-slate-800/70 border-gray-700 ${plan.highlight ? "ring-2 ring-purple-500 relative" : ""}`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Mais Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">
                      {billingCycle === "monthly"
                        ? `R$${plan.monthlyPrice.toFixed(2)}`
                        : `R$${(plan.yearlyPrice / 12).toFixed(2)}`}
                    </span>
                    <span className="text-gray-400 ml-2">/mês</span>
                  </div>

                  {billingCycle === "yearly" && (
                    <div className="text-sm text-gray-400 mt-1">
                      Faturado anualmente como R${plan.yearlyPrice.toFixed(2)}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {typeof feature.included === "boolean" ? (
                        feature.included ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-gray-500" />
                        )
                      ) : (
                        <Check className="h-5 w-5 text-green-500" />
                      )}

                      <span className="text-gray-300 flex items-center gap-1">
                        {feature.name}
                        {typeof feature.included === "string" && (
                          <span className="text-gray-400">({feature.included})</span>
                        )}
                        {feature.tooltip && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-3 w-3 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                {plan.id === "pro" ? (
                  <Link href="/pricing/checkout?plan=pro&cycle=monthly">
                    <Button className="w-full">Assinar Agora</Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.buttonVariant || "default"}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={plan.id === userPlan}
                  >
                    {plan.buttonText}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Precisa de um plano personalizado?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Entre em contato com nossa equipe para discutir suas necessidades específicas e obter um plano personalizado
            para seu escritório ou departamento jurídico.
          </p>
          <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
            Fale com nossa equipe
          </Button>
        </div>
      </main>
    </div>
  )
}

