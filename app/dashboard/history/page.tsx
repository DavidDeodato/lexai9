"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Search, CalendarIcon, Filter, X, MessageSquare, FileText, Gavel, Users, Brain, Scale } from "lucide-react"
import Link from "next/link"

// Importe o hook useChat e useEffect, useState
import { useChat } from "@/hooks/use-chat"

// Dados de exemplo para histórico de conversas
const conversationHistory = [
  {
    id: "1",
    title: "Análise de contrato de locação comercial",
    assistant: "Especialista Civil",
    assistantIcon: <Users className="h-5 w-5" />,
    date: new Date(2025, 2, 18, 14, 30),
    preview:
      "O contrato apresenta cláusulas abusivas nas seções 3.2 e 4.5 que podem ser contestadas com base no Art. 51 do CDC...",
    tags: ["Contrato", "Civil"],
  },
  {
    id: "2",
    title: "Resumo de processo trabalhista nº 0001234-56.2025.5.01.0001",
    assistant: "Especialista Trabalhista",
    assistantIcon: <FileText className="h-5 w-5" />,
    date: new Date(2025, 2, 17, 10, 15),
    preview:
      "O reclamante alega horas extras não pagas e assédio moral. As evidências apresentadas incluem registros de ponto e testemunhas...",
    tags: ["Processo", "Trabalhista"],
  },
  {
    id: "3",
    title: "Estratégia para audiência criminal",
    assistant: "Especialista Penal",
    assistantIcon: <Gavel className="h-5 w-5" />,
    date: new Date(2025, 2, 15, 9, 45),
    preview:
      "Recomendo focar nos seguintes pontos durante a audiência: 1) Inconsistências no depoimento da testemunha principal...",
    tags: ["Audiência", "Penal"],
  },
  {
    id: "4",
    title: "Resumo de petição inicial",
    assistant: "Resumidor de Documentos",
    assistantIcon: <Brain className="h-5 w-5" />,
    date: new Date(2025, 2, 14, 16, 20),
    preview:
      "A petição inicial de 45 páginas apresenta os seguintes pontos principais: 1) Descumprimento contratual por parte da empresa...",
    tags: ["Resumo", "Petição"],
  },
  {
    id: "5",
    title: "Análise de recurso de apelação",
    assistant: "Avaliador de Petições",
    assistantIcon: <Scale className="h-5 w-5" />,
    date: new Date(2025, 2, 12, 11, 10),
    preview:
      "O recurso está bem fundamentado, mas recomendo fortalecer o argumento sobre cerceamento de defesa com precedentes do STJ...",
    tags: ["Recurso", "Apelação"],
  },
  {
    id: "6",
    title: "Proposta para cliente potencial - Caso de divórcio",
    assistant: "Conversor de Clientes",
    assistantIcon: <Users className="h-5 w-5" />,
    date: new Date(2025, 2, 10, 15, 45),
    preview:
      "Elaborei uma proposta personalizada destacando nossa experiência em casos similares e oferecendo um plano de pagamento flexível...",
    tags: ["Proposta", "Cliente"],
  },
  {
    id: "7",
    title: "Análise de jurisprudência sobre dano moral",
    assistant: "Especialista Civil",
    assistantIcon: <Users className="h-5 w-5" />,
    date: new Date(2025, 2, 8, 9, 30),
    preview:
      "Compilei as decisões mais recentes do STJ sobre quantificação de dano moral em casos de negativação indevida...",
    tags: ["Jurisprudência", "Dano Moral"],
  },
  {
    id: "8",
    title: "Preparação para sustentação oral",
    assistant: "Especialista Penal",
    assistantIcon: <Gavel className="h-5 w-5" />,
    date: new Date(2025, 2, 5, 14, 0),
    preview:
      "Para a sustentação oral, sugiro estruturar em três partes: 1) Contextualização do caso, 2) Argumentos técnicos...",
    tags: ["Sustentação", "Tribunal"],
  },
  {
    id: "9",
    title: "Cálculo de verbas rescisórias",
    assistant: "Especialista Trabalhista",
    assistantIcon: <FileText className="h-5 w-5" />,
    date: new Date(2025, 2, 3, 10, 20),
    preview:
      "Com base nas informações fornecidas, o valor total das verbas rescisórias é de R$ 24.567,89, incluindo...",
    tags: ["Cálculo", "Rescisão"],
  },
  {
    id: "10",
    title: "Análise de contrato de prestação de serviços",
    assistant: "Especialista Civil",
    assistantIcon: <Users className="h-5 w-5" />,
    date: new Date(2025, 2, 1, 16, 15),
    preview:
      "O contrato de prestação de serviços apresenta lacunas importantes nas cláusulas de rescisão e propriedade intelectual...",
    tags: ["Contrato", "Serviços"],
  },
]

// Componente para a página de histórico
// Adicione o hook useChat e a busca de chats
export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedAssistant, setSelectedAssistant] = useState<string | undefined>(undefined)
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined)
  const [chats, setChats] = useState([])
  const [filteredChats, setFilteredChats] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { getChats, isLoading } = useChat()

  // Buscar chats ao carregar a página
  useEffect(() => {
    const fetchChats = async () => {
      const chatData = await getChats()
      setChats(chatData)
      setFilteredChats(chatData)
    }

    fetchChats()
  }, [])

  // Aplicar filtros
  useEffect(() => {
    let result = chats

    // Filtrar por termo de busca
    if (searchTerm) {
      result = result.filter(
        (chat) =>
          chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (chat.messages[0]?.content && chat.messages[0].content.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filtrar por data
    if (selectedDate) {
      result = result.filter((chat) => {
        const chatDate = new Date(chat.messages[0]?.timestamp || chat.createdAt)
        return (
          chatDate.getDate() === selectedDate.getDate() &&
          chatDate.getMonth() === selectedDate.getMonth() &&
          chatDate.getFullYear() === selectedDate.getFullYear()
        )
      })
    }

    // Outros filtros podem ser implementados conforme necessário

    setFilteredChats(result)
  }, [searchTerm, selectedDate, selectedAssistant, selectedTag, chats])

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDate(undefined)
    setSelectedAssistant(undefined)
    setSelectedTag(undefined)
  }

  // Modificar o componente ConversationCard para usar dados reais
  function ConversationCard({ conversation }) {
    const chatDate = new Date(conversation.messages[0]?.timestamp || conversation.createdAt)

    return (
      <Card className="bg-slate-800/70 border-gray-700 hover:border-purple-500/50 transition-all">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-lg font-medium text-white truncate">{conversation.title}</h3>
                <span className="text-xs text-gray-400 whitespace-nowrap">{format(chatDate, "dd/MM/yyyy HH:mm")}</span>
              </div>

              <p className="text-sm text-gray-400 mb-2">
                {conversation.messages[0]?.sender === "ai" ? "Assistente" : "Você"}
              </p>

              <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                {conversation.messages[0]?.content || "Sem mensagens"}
              </p>

              <Link href={`/dashboard/chat/${conversation.id}`}>
                <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 p-0">
                  Continuar conversa →
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Histórico de Conversas</h1>
          <p className="text-gray-400">Visualize e pesquise suas conversas anteriores com os assistentes</p>
        </div>
        <Button
          variant="outline"
          className="border-gray-700 text-gray-300 hover:text-white flex items-center gap-2"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          {isFilterOpen ? "Fechar Filtros" : "Filtros"}
        </Button>
      </div>

      {/* Barra de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar por título ou conteúdo..."
          className="pl-10 bg-slate-800/50 border-gray-700 focus:border-purple-500"
        />
      </div>

      {/* Filtros avançados */}
      {isFilterOpen && (
        <Card className="bg-slate-800/70 border-gray-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro de data */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Data</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-gray-700 bg-slate-900/50"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      ) : (
                        <span className="text-gray-400">Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="bg-slate-800 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Filtro de assistente */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Assistente</label>
                <Select value={selectedAssistant} onValueChange={setSelectedAssistant}>
                  <SelectTrigger className="bg-slate-900/50 border-gray-700">
                    <SelectValue placeholder="Todos os assistentes" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-gray-700">
                    <SelectItem value={undefined}>Todos os assistentes</SelectItem>
                    {/* {uniqueAssistants.map((assistant) => (
                      <SelectItem key={assistant} value={assistant}>
                        {assistant}
                      </SelectItem>
                    ))} */}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de tag */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Tag</label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="bg-slate-900/50 border-gray-700">
                    <SelectValue placeholder="Todas as tags" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-gray-700">
                    <SelectItem value={undefined}>Todas as tags</SelectItem>
                    {/* {uniqueTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))} */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botão para limpar filtros */}
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:text-white"
                onClick={clearFilters}
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Abas de visualização */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-gray-700">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="favorites">Favoritas</TabsTrigger>
        </TabsList>

        {/* Conteúdo das abas */}
        <TabsContent value="all" className="space-y-4">
          {filteredChats.length > 0 ? (
            filteredChats.map((conversation) => <ConversationCard key={conversation.id} conversation={conversation} />)
          ) : (
            <div className="text-center py-10">
              <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300">Nenhuma conversa encontrada</h3>
              <p className="text-gray-400 mt-2">Tente ajustar seus filtros de busca</p>
              <Button
                variant="outline"
                className="mt-4 border-gray-700 text-gray-300 hover:text-white"
                onClick={clearFilters}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {filteredChats
            .sort((a, b) => {
              const dateA = new Date(a.messages[0]?.timestamp || a.createdAt)
              const dateB = new Date(b.messages[0]?.timestamp || b.createdAt)
              return dateB.getTime() - dateA.getTime()
            })
            .slice(0, 5)
            .map((conversation) => (
              <ConversationCard key={conversation.id} conversation={conversation} />
            ))}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <div className="text-center py-10">
            <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-300">Nenhuma conversa favorita</h3>
            <p className="text-gray-400 mt-2">Marque conversas como favoritas para vê-las aqui</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

