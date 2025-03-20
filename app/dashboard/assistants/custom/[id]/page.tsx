"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  Paperclip,
  Scale,
  Settings,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  FileUp,
  Lightbulb,
} from "lucide-react"

// Dados de exemplo para assistentes personalizados
const customAssistantsData = {
  "7": {
    name: "Especialista em Direito Tributário",
    description: "Análise de questões fiscais e planejamento tributário",
    icon: <Scale className="h-5 w-5 text-green-500" />,
    initialMessage:
      "Olá, sou o Especialista em Direito Tributário. Posso ajudar com análise fiscal, planejamento tributário, interpretação de legislação tributária e estratégias para redução de carga tributária. Como posso ajudar você hoje?",
  },
  "8": {
    name: "Assistente de Audiências",
    description: "Preparação para audiências e análise de depoimentos",
    icon: <Scale className="h-5 w-5 text-amber-500" />,
    initialMessage:
      "Olá, sou o Assistente de Audiências. Posso ajudar com preparação para audiências, análise de depoimentos, estratégias de inquirição e técnicas de argumentação oral. Como posso ajudar você hoje?",
  },
}

export default function CustomAssistantPage() {
  const params = useParams()
  const assistantId = params.id
  const assistantData = customAssistantsData[assistantId]

  const [messages, setMessages] = useState<Array<{ role: string; content: string; timestamp?: Date }>>([
    {
      role: "assistant",
      content: assistantData?.initialMessage || "Olá, como posso ajudar você hoje?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
        timestamp: new Date(),
      },
    ])

    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Baseado na sua consulta sobre "${input.substring(0, 30)}...", posso fornecer as seguintes informações:\n\n1. A legislação aplicável neste caso é...\n2. Existem precedentes relevantes que...\n3. Recomendo as seguintes estratégias...\n\nPosso detalhar algum desses pontos ou analisar algum aspecto específico da sua questão.`,
          timestamp: new Date(),
        },
      ])
      setIsLoading(false)
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!assistantData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Assistente não encontrado</h2>
          <p className="text-gray-400">O assistente solicitado não existe ou foi removido.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            {assistantData.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{assistantData.name}</h1>
            <p className="text-gray-400 text-sm">{assistantData.description}</p>
          </div>
        </div>
        <Button variant="outline" size="icon" className="border-gray-700 text-gray-400 hover:text-white">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="self-start bg-slate-800/50 border border-gray-700 mb-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="sugestoes">Sugestões</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <Card className="flex-1 bg-slate-800/50 border-gray-700 overflow-hidden flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user" ? "bg-purple-500/20 text-white" : "bg-slate-700/50 text-gray-200"
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.content}</div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-xs text-gray-400">
                        {message.timestamp?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {message.role === "assistant" && (
                        <div className="flex gap-1">
                          <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-slate-700/50">
                            <Copy className="h-3 w-3" />
                          </button>
                          <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-slate-700/50">
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-slate-700/50">
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-slate-700/50 text-gray-200">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
                      <span>Gerando resposta...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="border-gray-700 text-gray-400 hover:text-white">
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                className="min-h-[60px] bg-slate-800/50 border-gray-700 resize-none pr-12"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-purple-500 hover:bg-purple-600"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sugestoes" className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Analisar impactos fiscais de uma reorganização societária",
              "Verificar possibilidades de compensação tributária",
              "Elaborar estratégia para redução de carga tributária",
              "Analisar riscos de autuação fiscal",
              "Verificar aplicabilidade de benefícios fiscais",
              "Estratégias para recuperação de créditos tributários",
            ].map((suggestion, index) => (
              <Card
                key={index}
                className="bg-slate-800/70 border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
                onClick={() => setInput(suggestion)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-purple-500 mt-0.5" />
                  <span className="text-gray-300">{suggestion}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documentos" className="flex-1 overflow-y-auto">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
            <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-1">Arraste documentos ou clique para fazer upload</h3>
            <p className="text-gray-400 text-sm mb-4">Carregue documentos relevantes para análise pelo assistente</p>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
              Selecionar Arquivos
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

