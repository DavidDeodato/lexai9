// Create a new assistant page for the "Resumidor de Documentos"
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Brain, Settings, Info, FileText, ArrowRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useChat } from "@/hooks/use-chat"

// Modelos de IA disponíveis
const aiModels = [
  { id: "gpt-4o", name: "GPT-4o", description: "Modelo mais avançado da OpenAI" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", description: "Modelo avançado da Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", description: "Modelo avançado do Google" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Modelo rápido e econômico da OpenAI" },
]

// Especialidades do assistente resumidor
const resumidorSpecialties = [
  {
    id: "resumo-peticao",
    name: "Resumo de Petição",
    description: "Modelo para resumir petições extensas",
    content: `Modelo para Resumo de Petição:

1. IDENTIFICAÇÃO DO DOCUMENTO
   - Tipo de petição
   - Número do processo
   - Partes envolvidas
   - Juízo/Tribunal

2. RESUMO DOS FATOS
   - Contextualização do caso
   - Cronologia dos eventos relevantes
   - Pontos principais da narrativa fática

3. FUNDAMENTOS JURÍDICOS
   - Principais argumentos legais
   - Legislação citada
   - Jurisprudência relevante
   - Doutrinas mencionadas

4. PEDIDOS
   - Lista dos pedidos principais
   - Pedidos subsidiários
   - Tutelas provisórias solicitadas

5. PROVAS APRESENTADAS
   - Documentos juntados
   - Testemunhas arroladas
   - Perícias solicitadas

6. PONTOS CRÍTICOS
   - Argumentos mais fortes
   - Possíveis fragilidades
   - Questões controversas

7. PRAZOS RELEVANTES
   - Data de protocolo
   - Prazos processuais mencionados
   - Audiências designadas`,
  },
  {
    id: "resumo-contrato",
    name: "Resumo de Contrato",
    description: "Modelo para resumir contratos complexos",
    content: `Modelo para Resumo de Contrato:

1. IDENTIFICAÇÃO DO CONTRATO
   - Tipo de contrato
   - Partes contratantes
   - Data de assinatura
   - Prazo de vigência

2. OBJETO DO CONTRATO
   - Descrição do objeto principal
   - Escopo dos serviços/produtos
   - Especificações técnicas relevantes

3. CONDIÇÕES FINANCEIRAS
   - Valor total do contrato
   - Forma de pagamento
   - Reajustes previstos
   - Multas e penalidades financeiras

4. OBRIGAÇÕES DAS PARTES
   - Principais obrigações do contratante
   - Principais obrigações do contratado
   - Responsabilidades compartilhadas

5. CLÁUSULAS CRÍTICAS
   - Rescisão contratual
   - Confidencialidade
   - Propriedade intelectual
   - Exclusividade
   - Não concorrência

6. GARANTIAS E SEGUROS
   - Garantias oferecidas
   - Seguros exigidos
   - Fianças bancárias

7. DISPOSIÇÕES FINAIS
   - Foro de eleição
   - Possibilidade de cessão
   - Comunicações entre as partes`,
  },
  {
    id: "resumo-sentenca",
    name: "Resumo de Sentença",
    description: "Modelo para resumir sentenças judiciais",
    content: `Modelo para Resumo de Sentença:

1. IDENTIFICAÇÃO DA DECISÃO
   - Tipo de decisão (sentença, acórdão)
   - Número do processo
   - Juízo/Tribunal
   - Data da publicação

2. PARTES PROCESSUAIS
   - Autor/Reclamante/Recorrente
   - Réu/Reclamado/Recorrido
   - Outros interessados

3. OBJETO DA AÇÃO
   - Tipo de ação
   - Pedidos formulados
   - Valor da causa

4. RELATÓRIO
   - Síntese dos fatos processuais
   - Argumentos principais das partes
   - Provas produzidas

5. FUNDAMENTAÇÃO
   - Base legal da decisão
   - Análise das provas
   - Jurisprudência citada
   - Teses acolhidas e rejeitadas

6. DISPOSITIVO
   - Resultado do julgamento
   - Procedência total/parcial/improcedência
   - Condenações específicas
   - Honorários e custas

7. RECURSOS CABÍVEIS
   - Tipos de recursos possíveis
   - Prazos recursais
   - Efeitos dos recursos`,
  },
  {
    id: "resumo-parecer",
    name: "Resumo de Parecer",
    description: "Modelo para resumir pareceres jurídicos",
    content: `Modelo para Resumo de Parecer Jurídico:

1. IDENTIFICAÇÃO DO PARECER
   - Número/referência do parecer
   - Órgão/departamento emissor
   - Data de emissão
   - Consulente

2. OBJETO DA CONSULTA
   - Questão jurídica analisada
   - Contexto fático
   - Delimitação do escopo

3. ANÁLISE JURÍDICA
   - Legislação aplicável
   - Jurisprudência relevante
   - Doutrina citada
   - Precedentes administrativos

4. PONTOS CONTROVERSOS
   - Questões jurídicas debatidas
   - Diferentes interpretações possíveis
   - Riscos jurídicos identificados

5. CONCLUSÃO
   - Resposta à consulta
   - Recomendações práticas
   - Providências sugeridas

6. RESSALVAS
   - Limitações da análise
   - Condicionantes da conclusão
   - Cenários alternativos`,
  },
]

// Sugestões para o assistente resumidor
const resumidorSuggestions = [
  "Resumir petição inicial de processo trabalhista",
  "Extrair pontos principais de contrato de prestação de serviços",
  "Resumir acórdão do STJ sobre responsabilidade civil",
  "Identificar cláusulas críticas em contrato de locação",
  "Resumir parecer jurídico sobre questão tributária",
  "Extrair argumentos principais de contestação",
]

export default function ResumidorAssistant() {
  const router = useRouter()
  const { toast } = useToast()
  const { createChat, getChat, isLoading } = useChat()

  const [chatId, setChatId] = useState<number | null>(null)
  const [initialMessages, setInitialMessages] = useState([])
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [specialtyContent, setSpecialtyContent] = useState<string | null>(null)

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Verificar se já existe um chat para este assistente ou criar um novo
        const chat = await createChat("Conversa com Resumidor de Documentos", "resumidor")
        if (chat) {
          setChatId(chat.id)

          // Buscar mensagens iniciais
          const chatData = await getChat(chat.id)
          if (chatData && chatData.messages) {
            setInitialMessages(chatData.messages)
          }
        }
      } catch (error) {
        console.error("Erro ao inicializar chat:", error)
        toast({
          title: "Erro",
          description: "Não foi possível inicializar o chat. Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    }

    initializeChat()
  }, [])

  // Atualizar conteúdo da especialidade quando selecionada
  useEffect(() => {
    if (selectedSpecialty) {
      const specialty = resumidorSpecialties.find((s) => s.id === selectedSpecialty)
      if (specialty) {
        setSpecialtyContent(specialty.content)
      }
    } else {
      setSpecialtyContent(null)
    }
  }, [selectedSpecialty])

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    toast({
      title: "Modelo alterado",
      description: `O modelo foi alterado para ${aiModels.find((m) => m.id === modelId)?.name}.`,
    })
  }

  const handleSpecialtyChange = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId)
  }

  const handleUseSpecialty = () => {
    if (specialtyContent && chatId) {
      // Enviar o conteúdo da especialidade para o chat
      toast({
        title: "Especialidade aplicada",
        description: "O modelo de especialidade foi aplicado ao chat.",
      })
    }
  }

  if (!chatId) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-5 w-5 text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <span>Inicializando conversa...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Brain className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Resumidor de Documentos</h1>
            <p className="text-gray-400 text-sm">Resumo inteligente de petições e documentos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Modelo:</label>
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-gray-700">
                <SelectValue placeholder="Selecione um modelo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-gray-700">
                {aiModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center gap-2">
                      <span>{model.name}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{model.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="icon" className="border-gray-700 text-gray-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="self-start bg-slate-800/50 border border-gray-700 mb-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <ChatInterface
            chatId={chatId}
            assistantType="resumidor"
            initialMessages={initialMessages}
            suggestions={resumidorSuggestions}
            modelTemplates={aiModels}
          />
        </TabsContent>

        <TabsContent value="especialidades" className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Selecione uma especialidade</h3>

                <Select value={selectedSpecialty || ""} onValueChange={handleSpecialtyChange}>
                  <SelectTrigger className="w-[250px] bg-slate-800/50 border-gray-700">
                    <SelectValue placeholder="Selecione uma especialidade" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-gray-700">
                    {resumidorSpecialties.map((specialty) => (
                      <SelectItem key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSpecialty && specialtyContent && (
                <Card className="bg-slate-800/70 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {resumidorSpecialties.find((s) => s.id === selectedSpecialty)?.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {resumidorSpecialties.find((s) => s.id === selectedSpecialty)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900/50 p-4 rounded-md border border-gray-700">
                      <p className="text-gray-300 whitespace-pre-line">{specialtyContent}</p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        className="border-green-500 text-green-400 hover:bg-green-500/10"
                        onClick={handleUseSpecialty}
                      >
                        Usar esta especialidade
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!selectedSpecialty && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumidorSpecialties.map((specialty) => (
                    <Card
                      key={specialty.id}
                      className="bg-slate-800/70 border-gray-700 hover:border-green-500/50 transition-all cursor-pointer"
                      onClick={() => setSelectedSpecialty(specialty.id)}
                    >
                      <CardContent className="p-4 flex items-start gap-3">
                        <FileText className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-white">{specialty.name}</h3>
                          <p className="text-sm text-gray-400">{specialty.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

