"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Clock,
  MessageSquare,
  FileUp,
  Brain,
  TrendingUp,
  Users,
  Award,
  HelpCircle,
  Lock,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Componente para exibir uma métrica com tooltip de explicação
function MetricCard({
  icon,
  title,
  value,
  trend,
  explanation,
  color = "purple",
  isLoading = false,
}: {
  icon: React.ReactNode
  title: string
  value: string
  trend?: string
  explanation: string
  color?: "purple" | "indigo" | "blue" | "green"
  isLoading?: boolean
}) {
  const colorClasses = {
    purple: "text-purple-500",
    indigo: "text-indigo-500",
    blue: "text-blue-500",
    green: "text-green-500",
  };

  return (
    <Card className="bg-slate-800/70 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={colorClasses[color]}>{icon}</div>
            <CardTitle className="text-sm text-gray-300 flex items-center gap-1">
              {title}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{explanation}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-6 w-20 bg-slate-700 animate-pulse rounded"></div>
        ) : (
          <>
            <div className="text-2xl font-bold text-white">{value}</div>
            {trend && <p className="text-xs text-gray-400">{trend}</p>}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Componente para exibir o uso de assistentes
function AssistantUsageCard({
  assistants,
  locked = false,
  isLoading = false,
}: {
  assistants: Array<{
    id: string
    name: string
    usage: number
    color: string
  }>
  locked?: boolean
  isLoading?: boolean
}) {
  const totalUsage = assistants.reduce((sum, assistant) => sum + assistant.usage, 0) || 1 // Evitar divisão por zero

  if (locked) {
    return (
      <Card className="bg-slate-800/70 border-gray-700 col-span-full relative">
        <CardHeader>
          <CardTitle className="text-white">Uso de Assistentes</CardTitle>
          <CardDescription className="text-gray-400">Distribuição de uso entre os assistentes</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
            <Lock className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-white font-medium mb-1">Recurso Bloqueado</p>
            <p className="text-gray-400 text-sm text-center mb-3 px-4">
              Disponível nos planos Profissional e Empresarial
            </p>
            <Link href="/pricing">
              <Button size="sm">Fazer Upgrade</Button>
            </Link>
          </div>

          <div className="text-gray-500 text-center">
            Faça upgrade para ver estatísticas detalhadas de uso dos assistentes
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/70 border-gray-700 col-span-full">
      <CardHeader>
        <CardTitle className="text-white">Uso de Assistentes</CardTitle>
        <CardDescription className="text-gray-400">Distribuição de uso entre os assistentes</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-slate-700 animate-pulse rounded"></div>
                  <div className="h-4 w-10 bg-slate-700 animate-pulse rounded"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {assistants.map((assistant) => (
              <div key={assistant.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-${assistant.color}-500`} />
                    <span className="text-sm text-gray-300">{assistant.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">{Math.round((assistant.usage / totalUsage) * 100)}%</span>
                </div>
                <Progress
                  value={(assistant.usage / totalUsage) * 100}
                  className={`h-2 bg-slate-700`}
                  indicatorClassName={`bg-${assistant.color}-500`}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componente para exibir as conquistas do usuário
function AchievementsCard({ locked = false, isLoading = false, achievements = [] }) {
  if (locked) {
    return (
      <Card className="bg-slate-800/70 border-gray-700 col-span-full relative">
        <CardHeader>
          <CardTitle className="text-white">Conquistas</CardTitle>
          <CardDescription className="text-gray-400">Seu progresso e conquistas na plataforma</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
            <Lock className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-white font-medium mb-1">Recurso Bloqueado</p>
            <p className="text-gray-400 text-sm text-center mb-3 px-4">
              Disponível nos planos Profissional e Empresarial
            </p>
            <Link href="/pricing">
              <Button size="sm">Fazer Upgrade</Button>
            </Link>
          </div>

          <div className="text-gray-500 text-center">Faça upgrade para acompanhar suas conquistas e progresso</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/70 border-gray-700 col-span-full">
      <CardHeader>
        <CardTitle className="text-white">Conquistas</CardTitle>
        <CardDescription className="text-gray-400">Seu progresso e conquistas na plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-slate-900/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-slate-700 animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-32 bg-slate-700 animate-pulse rounded"></div>
                      <div className="h-4 w-full bg-slate-700 animate-pulse rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`bg-slate-900/50 border-gray-700 ${achievement.completed ? "border-green-500/30" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center ${achievement.completed ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-gray-400"}`}
                    >
                      {achievement.completed ? (
                        <Award className="h-4 w-4" />
                      ) : (
                        <span className="text-xs">{achievement.progress}%</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{achievement.name}</h4>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                      {!achievement.completed && (
                        <Progress value={achievement.progress} className="h-1 mt-2 bg-slate-700" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componente para exibir estatísticas de produtividade
function ProductivityStatsCard({ locked = false, isLoading = false }) {
  if (locked) {
    return (
      <Card className="bg-slate-800/70 border-gray-700 col-span-full relative">
        <CardHeader>
          <CardTitle className="text-white">Produtividade Semanal</CardTitle>
          <CardDescription className="text-gray-400">Análise de uso da plataforma nos últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
            <Lock className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-white font-medium mb-1">Recurso Bloqueado</p>
            <p className="text-gray-400 text-sm text-center mb-3 px-4">
              Disponível nos planos Profissional e Empresarial
            </p>
            <Link href="/pricing">
              <Button size="sm">Fazer Upgrade</Button>
            </Link>
          </div>

          <div className="text-gray-500 text-center">
            Faça upgrade para visualizar estatísticas detalhadas de produtividade
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/70 border-gray-700 col-span-full">
      <CardHeader>
        <CardTitle className="text-white">Produtividade Semanal</CardTitle>
        <CardDescription className="text-gray-400">Análise de uso da plataforma nos últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="h-60 w-full bg-slate-700/50 animate-pulse rounded"></div>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-400">Gráfico de produtividade semanal será exibido aqui</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalChats: 0,
    timesSaved: 0,
    documentsAnalyzed: 0,
    efficiency: 0,
    totalMessages: 0,
    averageResponseTime: "0s",
    userSatisfaction: 0,
    activeDays: 0,
  })

  const [assistantUsage, setAssistantUsage] = useState([
    { id: "penal", name: "Especialista Penal", usage: 0, color: "purple" },
    { id: "trabalhista", name: "Especialista Trabalhista", usage: 0, color: "indigo" },
    { id: "civil", name: "Especialista Civil", usage: 0, color: "blue" },
    { id: "resumidor", name: "Resumidor de Documentos", usage: 0, color: "green" },
    { id: "avaliador", name: "Avaliador de Petições", usage: 0, color: "purple" },
  ])

  const [achievements, setAchievements] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const { user, getUserPlan, isPlanActive } = useAuth()
  const userPlan = getUserPlan()
  const isPremium = (userPlan === "pro" || userPlan === "enterprise") && isPlanActive()

  useEffect(() => {
    // Carregar estatísticas do usuário
    const loadStats = async () => {
      if (!user) return

      setIsLoading(true)

      try {
        // Buscar estatísticas reais do usuário
        const response = await fetch("/api/user/stats")

        if (!response.ok) {
          throw new Error("Erro ao carregar estatísticas")
        }

        const data = await response.json()

        setStats({
          totalChats: data.totalChats || 0,
          timesSaved: data.timesSaved || 0,
          documentsAnalyzed: data.documentsAnalyzed || 0,
          efficiency: data.efficiency || 0,
          totalMessages: data.totalMessages || 0,
          averageResponseTime: data.averageResponseTime || "0s",
          userSatisfaction: data.userSatisfaction || 0,
          activeDays: data.activeDays || 0,
        })

        if (data.assistantUsage && data.assistantUsage.length > 0) {
          setAssistantUsage(data.assistantUsage)
        }

        if (data.achievements && data.achievements.length > 0) {
          setAchievements(data.achievements)
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
        // Fallback para dados mínimos em caso de erro
        setStats({
          totalChats: 0,
          timesSaved: 0,
          documentsAnalyzed: 0,
          efficiency: 0,
          totalMessages: 0,
          averageResponseTime: "0s",
          userSatisfaction: 0,
          activeDays: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [user])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Olá, {user?.fullName || user?.name || "Advogado"}</h1>
        <p className="text-gray-400">Bem-vindo à sua plataforma de assistentes jurídicos inteligentes.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-gray-700">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="productivity">Produtividade</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Total de Conversas"
              value={stats.totalChats.toString()}
              trend={`+${Math.round(stats.totalChats * 0.1)} este mês`}
              explanation="Número total de conversas iniciadas com assistentes desde a criação da sua conta."
              color="purple"
              isLoading={isLoading}
            />

            <MetricCard
              icon={<Clock className="h-6 w-6" />}
              title="Tempo Economizado"
              value={`${stats.timesSaved}h`}
              trend="~5h por semana"
              explanation="Estimativa de tempo economizado com base no número de documentos analisados e mensagens processadas. Cada documento economiza em média 30 minutos de análise manual."
              color="indigo"
              isLoading={isLoading}
            />

            <MetricCard
              icon={<FileUp className="h-6 w-6" />}
              title="Documentos Analisados"
              value={stats.documentsAnalyzed.toString()}
              trend={`+${Math.round(stats.documentsAnalyzed * 0.25)} este mês`}
              explanation="Número total de documentos enviados e analisados pelos assistentes."
              color="blue"
              isLoading={isLoading}
            />

            <MetricCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Eficiência"
              value={`${stats.efficiency}%`}
              trend="+5% desde o último mês"
              explanation="Índice de eficiência calculado com base no tempo de resposta, qualidade das respostas e feedback positivo."
              color="green"
              isLoading={isLoading}
            />
          </div>

          <AssistantUsageCard assistants={assistantUsage} locked={!isPremium} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Total de Mensagens"
              value={stats.totalMessages.toString()}
              explanation="Número total de mensagens trocadas com os assistentes."
              color="purple"
              isLoading={isLoading}
            />

            <MetricCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Tempo de Resposta"
              value={stats.averageResponseTime}
              explanation="Tempo médio de resposta dos assistentes às suas perguntas."
              color="indigo"
              isLoading={isLoading}
            />

            <MetricCard
              icon={<Users className="h-6 w-6" />}
              title="Satisfação"
              value={`${stats.userSatisfaction}%`}
              explanation="Índice de satisfação baseado no feedback positivo dado às respostas dos assistentes."
              color="blue"
              isLoading={isLoading}
            />

            <MetricCard
              icon={<Brain className="h-6 w-6" />}
              title="Dias Ativos"
              value={stats.activeDays.toString()}
              explanation="Número de dias em que você utilizou a plataforma nos últimos 30 dias."
              color="green"
              isLoading={isLoading}
            />
          </div>

          <ProductivityStatsCard locked={!isPremium} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsCard locked={!isPremium} isLoading={isLoading} achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

