"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Scale, CreditCard, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const planId = searchParams.get("plan") || "free"
  const cycle = searchParams.get("cycle") || "monthly"

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulação de processamento de pagamento
    setTimeout(() => {
      setIsProcessing(false)

      // Simulação de atualização do plano do usuário no banco de dados
      localStorage.setItem("userPlan", planId)
      localStorage.setItem("planCycle", cycle)
      localStorage.setItem("planExpiresAt", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())

      // Redirecionar para página de sucesso
      router.push(`/pricing/success?plan=${planId}&cycle=${cycle}`)
    }, 2000)
  }

  // Se for plano gratuito, não precisa de checkout
  if (planId === "free") {
    setIsProcessing(true)

    // Simulação de atualização do plano do usuário no banco de dados
    localStorage.setItem("userPlan", "free")
    localStorage.setItem("planCycle", "monthly")
    localStorage.setItem("planExpiresAt", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())

    // Redirecionar para página de sucesso
    router.push(`/pricing/success?plan=free&cycle=monthly`)

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Processando sua solicitação...</p>
        </div>
      </div>
    )
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Finalizar Compra</h1>
            <p className="text-gray-400">Complete seu pagamento para ativar seu plano</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="bg-slate-800/70 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Informações de Pagamento</CardTitle>
                  <CardDescription className="text-gray-400">Escolha seu método de pagamento preferido</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <RadioGroup
                      defaultValue="credit-card"
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="text-white flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          Cartão de Crédito
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pix" id="pix" disabled />
                        <Label htmlFor="pix" className="text-gray-500 flex items-center gap-2">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M9.5 4V20M9.5 4L4 9.5M9.5 4L15 9.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14.5 20V4M14.5 20L20 14.5M14.5 20L9 14.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          PIX (Em breve)
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "credit-card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName" className="text-white">
                            Nome no Cartão
                          </Label>
                          <Input
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            placeholder="Nome como aparece no cartão"
                            className="bg-slate-900/50 border-gray-700"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber" className="text-white">
                            Número do Cartão
                          </Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className="bg-slate-900/50 border-gray-700"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry" className="text-white">
                              Data de Validade
                            </Label>
                            <Input
                              id="cardExpiry"
                              name="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={handleInputChange}
                              placeholder="MM/AA"
                              className="bg-slate-900/50 border-gray-700"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cardCvc" className="text-white">
                              CVC
                            </Label>
                            <Input
                              id="cardCvc"
                              name="cardCvc"
                              value={formData.cardCvc}
                              onChange={handleInputChange}
                              placeholder="123"
                              className="bg-slate-900/50 border-gray-700"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-white">
                            Endereço
                          </Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Rua, número, complemento"
                            className="bg-slate-900/50 border-gray-700"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city" className="text-white">
                              Cidade
                            </Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="Cidade"
                              className="bg-slate-900/50 border-gray-700"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="state" className="text-white">
                              Estado
                            </Label>
                            <Input
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              placeholder="Estado"
                              className="bg-slate-900/50 border-gray-700"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="zip" className="text-white">
                              CEP
                            </Label>
                            <Input
                              id="zip"
                              name="zip"
                              value={formData.zip}
                              onChange={handleInputChange}
                              placeholder="00000-000"
                              className="bg-slate-900/50 border-gray-700"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing ? "Processando..." : `Pagar R$${price.toFixed(2)}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-slate-800/70 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plano</span>
                    <span className="text-white font-medium">{selectedPlan.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Ciclo</span>
                    <span className="text-white font-medium">{cycle === "yearly" ? "Anual" : "Mensal"}</span>
                  </div>

                  <div className="border-t border-gray-700 my-2"></div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">R${price.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Impostos</span>
                    <span className="text-white">R$0.00</span>
                  </div>

                  <div className="border-t border-gray-700 my-2"></div>

                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-white">R${price.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-gray-400">
                    {cycle === "monthly"
                      ? "Você será cobrado mensalmente. Cancele a qualquer momento."
                      : "Você será cobrado anualmente. Cancele a qualquer momento."}
                  </div>

                  <div className="text-sm text-gray-400 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Garantia de 7 dias. Reembolso total se não estiver satisfeito.</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

