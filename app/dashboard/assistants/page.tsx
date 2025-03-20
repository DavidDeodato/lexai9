"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Gavel,
  FileText,
  Users,
  Brain,
  Scale,
  Search,
  Star,
  StarOff,
  Lock,
  ShoppingBag,
  Heart,
  Home,
  Leaf,
  Shield,
  Briefcase,
  Globe,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"

// Assistentes pré-definidos
const predefinedAssistants = [
  {
    id: "penal",
    name: "Especialista Penal",
    description: "Análise de casos criminais e estratégias de defesa",
    icon: "gavel",
    iconColor: "purple",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "free", // disponível em todos os planos
  },
  {
    id: "trabalhista",
    name: "Especialista Trabalhista",
    description: "Avaliação de processos trabalhistas e cálculos",
    icon: "fileText",
    iconColor: "indigo",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "free", // disponível em todos os planos
  },
  {
    id: "civil",
    name: "Especialista Civil",
    description: "Elaboração de contratos e análise de responsabilidade",
    icon: "users",
    iconColor: "blue",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "pro", // requer plano profissional
  },
  {
    id: "resumidor",
    name: "Resumidor de Documentos",
    description: "Resumo inteligente de petições e documentos",
    icon: "brain",
    iconColor: "green",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "free", // disponível em todos os planos
  },
  {
    id: "avaliador",
    name: "Avaliador de Petições",
    description: "Análise crítica de petições com sugestões",
    icon: "scale",
    iconColor: "purple",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "pro", // requer plano profissional
  },
  {
    id: "conversor",
    name: "Conversor de Clientes",
    description: "Elaboração de propostas personalizadas",
    icon: "users",
    iconColor: "indigo",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "enterprise", // requer plano empresarial
  },
  {
    id: "tributario",
    name: "Especialista em Direito Tributário",
    description: "Análise de questões fiscais e planejamento tributário",
    icon: "scale",
    iconColor: "green",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "pro", // requer plano profissional
  },
  {
    id: "audiencias",
    name: "Assistente de Audiências",
    description: "Preparação para audiências e análise de depoimentos",
    icon: "users",
    iconColor: "amber",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "pro", // requer plano profissional
  },
  // Novos assistentes adicionados
  {
    id: "consumidor",
    name: "Especialista em Direito do Consumidor",
    description: "Análise de casos de relações de consumo",
    icon: "shoppingBag",
    iconColor: "red",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "free",
  },
  {
    id: "familia",
    name: "Especialista em Direito de Família",
    description: "Divórcios, guarda de filhos e pensão alimentícia",
    icon: "heart",
    iconColor: "pink",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "free",
  },
  {
    id: "imobiliario",
    name: "Especialista em Direito Imobiliário",
    description: "Contratos imobiliários e questões de propriedade",
    icon: "home",
    iconColor: "orange",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "pro",
  },
  {
    id: "ambiental",
    name: "Especialista em Direito Ambiental",
    description: "Legislação ambiental e licenciamento",
    icon: "leaf",
    iconColor: "green",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "pro",
  },
  {
    id: "previdenciario",
    name: "Especialista em Direito Previdenciário",
    description: "Aposentadorias, benefícios e recursos ao INSS",
    icon: "shield",
    iconColor: "teal",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "pro",
  },
  {
    id: "empresarial",
    name: "Especialista em Direito Empresarial",
    description: "Contratos empresariais e societários",
    icon: "briefcase",
    iconColor: "blue",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "enterprise",
  },
  {
    id: "internacional",
    name: "Especialista em Direito Internacional",
    description: "Questões jurídicas internacionais e tratados",
    icon: "globe",
    iconColor: "cyan",
    isSystem: true,
    isFavorite: false,
    requiredPlan: "enterprise",
  },
]

export default function AssistantsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [assistants, setAssistants] = useState(predefinedAssistants)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Simular o plano do usuário (em produção, isso viria do banco de dados)
  const userPlan = "free" // Opções: "free", "pro", "enterprise"

  useEffect(() => {
    setIsMounted(true)

    // Carregar favoritos do localStorage para demonstração
    const loadFavorites = () => {
      try {
        const favoritesString = localStorage.getItem("favoriteAssistants")
        if (favoritesString) {
          const favorites = JSON.parse(favoritesString)
          setAssistants((prev) =>
            prev.map((assistant) => ({
              ...assistant,
              isFavorite: favorites.includes(assistant.id),
            })),
          )
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error)
      }
    }

    if (typeof window !== "undefined") {
      loadFavorites()
    }
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "gavel":
        return <Gavel className="h-5 w-5" />
      case "fileText":
        return <FileText className="h-5 w-5" />
      case "users":
        return <Users className="h-5 w-5" />
      case "brain":
        return <Brain className="h-5 w-5" />
      case "scale":
        return <Scale className="h-5 w-5" />
      case "shoppingBag":
        return <ShoppingBag className="h-5 w-5" />
      case "heart":
        return <Heart className="h-5 w-5" />
      case "home":
        return <Home className="h-5 w-5" />
      case "leaf":
        return <Leaf className="h-5 w-5" />
      case "shield":
        return <Shield className="h-5 w-5" />
      case "briefcase":
        return <Briefcase className="h-5 w-5" />
      case "globe":
        return <Globe className="h-5 w-5" />
      default:
        return <Brain className="h-5 w-5" />
    }
  }

  const getColorClass = (color: string) => {
    switch (color) {
      case "purple":
        return "text-purple-500"
      case "indigo":
        return "text-indigo-500"
      case "blue":
        return "text-blue-500"
      case "green":
        return "text-green-500"
      case "amber":
        return "text-amber-500"
      case "red":
        return "text-red-500"
      case "pink":
        return "text-pink-500"
      case "orange":
        return "text-orange-500"
      case "teal":
        return "text-teal-500"
      case "cyan":
        return "text-cyan-500"
      default:
        return "text-purple-500"
    }
  }

  const getBgColorClass = (color: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-500/20"
      case "indigo":
        return "bg-indigo-500/20"
      case "blue":
        return "bg-blue-500/20"
      case "green":
        return "bg-green-500/20"
      case "amber":
        return "bg-amber-500/20"
      case "red":
        return "bg-red-500/20"
      case "pink":
        return "bg-pink-500/20"
      case "orange":
        return "bg-orange-500/20"
      case "teal":
        return "bg-teal-500/20"
      case "cyan":
        return "bg-cyan-500/20"
      default:
        return "bg-purple-500/20"
    }
  }

  const handleStartChat = (assistantId: string) => {
    router.push(`/dashboard/assistants/${assistantId}`)
  }

  const handleToggleFavorite = (assistantId: string, isFavorite: boolean) => {
    // Atualizar estado local
    setAssistants((prev) =>
      prev.map((assistant) => (assistant.id === assistantId ? { ...assistant, isFavorite: !isFavorite } : assistant)),
    )

    // Salvar no localStorage para demonstração
    try {
      const favoritesString = localStorage.getItem("favoriteAssistants")
      let favorites = favoritesString ? JSON.parse(favoritesString) : []

      if (isFavorite) {
        favorites = favorites.filter((id) => id !== assistantId)
      } else {
        favorites.push(assistantId)
      }

      localStorage.setItem("favoriteAssistants", JSON.stringify(favorites))

      toast({
        title: !isFavorite ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: `Assistente ${!isFavorite ? "adicionado aos" : "removido dos"} favoritos com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao salvar favoritos:", error)
    }
  }

  const canAccessAssistant = (requiredPlan: string) => {
    if (requiredPlan === "free") return true
    if (userPlan === "enterprise") return true
    if (userPlan === "pro" && requiredPlan !== "enterprise") return true
    return false
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "free":
        return "Gratuito"
      case "pro":
        return "Profissional"
      case "enterprise":
        return "Empresarial"
      default:
        return "Desconhecido"
    }
  }

  const filteredAssistants = assistants.filter((assistant) => {
    // Filtrar por pesquisa
    const matchesSearch =
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtrar por tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "favorites" && assistant.isFavorite) ||
      (activeTab === "system" && assistant.isSystem)

    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Assistentes</h1>
          <p className="text-gray-400">Gerencie seus assistentes de IA especializados</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Pesquisar assistentes..."
          className="pl-10 bg-slate-800/50 border-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-gray-700">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <Card key={index} className="bg-slate-800/70 border-gray-700 animate-pulse">
                  <CardContent className="p-6 h-[180px]"></CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAssistants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssistants.map((assistant) => {
                const hasAccess = canAccessAssistant(assistant.requiredPlan)

                return (
                  <Card
                    key={assistant.id}
                    className={`bg-slate-800/70 border-gray-700 hover:border-purple-500/50 transition-all relative group ${!hasAccess ? "opacity-80" : ""}`}
                  >
                    {!hasAccess && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                        <Lock className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-white font-medium mb-1">Assistente Bloqueado</p>
                        <p className="text-gray-400 text-sm text-center mb-3 px-4">
                          Disponível no plano {getPlanName(assistant.requiredPlan)}
                        </p>
                        <Link href="/pricing">
                          <Button size="sm">Fazer Upgrade</Button>
                        </Link>
                      </div>
                    )}

                    <CardContent className="p-6">
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleToggleFavorite(assistant.id, assistant.isFavorite)}
                        >
                          {assistant.isFavorite ? (
                            <StarOff className="h-4 w-4 text-yellow-400" />
                          ) : (
                            <Star className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>

                      <div className="flex items-start gap-4">
                        <div
                          className={`h-10 w-10 rounded-full ${getBgColorClass(assistant.iconColor)} flex items-center justify-center ${getColorClass(assistant.iconColor)}`}
                        >
                          {getIconComponent(assistant.icon)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-medium text-white">{assistant.name}</h3>
                            {assistant.requiredPlan !== "free" && (
                              <Badge variant="outline" className="text-xs border-purple-500 text-purple-400">
                                {getPlanName(assistant.requiredPlan)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{assistant.description}</p>

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                            onClick={() => handleStartChat(assistant.id)}
                            disabled={!hasAccess}
                          >
                            Iniciar conversa →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Nenhum assistente encontrado</h3>
              <p className="text-gray-400 text-center max-w-md">
                {searchQuery
                  ? `Não encontramos assistentes correspondentes a "${searchQuery}". Tente outra pesquisa.`
                  : "Não há assistentes disponíveis nesta categoria."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

