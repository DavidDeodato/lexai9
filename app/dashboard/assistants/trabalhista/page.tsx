"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChatInterface } from "@/components/chat/chat-interface"
import { FileText, Settings, Info, ArrowRight } from "lucide-react"
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

// Especialidades do assistente trabalhista
const trabalhistaSpecialties = [
  {
    id: "reclamacao-trabalhista",
    name: "Reclamação Trabalhista",
    description: "Modelo para petição inicial trabalhista",
    content: `Modelo de Reclamação Trabalhista:

1. QUALIFICAÇÃO DO RECLAMANTE
   - Nome completo, nacionalidade, estado civil, profissão, RG, CPF, CTPS, PIS/PASEP, endereço

2. QUALIFICAÇÃO DO RECLAMADO
   - Razão social, CNPJ, endereço

3. FATOS
   - Data de admissão e demissão
   - Função exercida e último salário
   - Jornada de trabalho
   - Descrição detalhada dos fatos que fundamentam os pedidos

4. FUNDAMENTOS JURÍDICOS
   - Dispositivos da CLT aplicáveis
   - Súmulas e OJs do TST
   - Jurisprudência relevante
   - Princípios do Direito do Trabalho

5. PEDIDOS
   - Verbas rescisórias
   - Horas extras e reflexos
   - Adicional noturno
   - Adicional de insalubridade/periculosidade
   - Danos morais
   - Outros pedidos específicos

6. REQUERIMENTOS
   - Notificação do reclamado
   - Produção de provas
   - Condenação do reclamado
   - Benefícios da justiça gratuita
   - Honorários advocatícios

7. VALOR DA CAUSA
   - Estimativa do valor total dos pedidos`,
  },
  {
    id: "calculo-trabalhista",
    name: "Cálculo Trabalhista",
    description: "Modelo para cálculos de verbas trabalhistas",
    content: `Modelo para Cálculo de Verbas Trabalhistas:

1. DADOS DO CONTRATO
   - Período do contrato: [data inicial] a [data final]
   - Salário base: R$ [valor]
   - Função: [cargo]
   - Jornada contratual: [horário]
   - Jornada efetivamente cumprida: [horário real]

2. VERBAS RESCISÓRIAS
   - Saldo de salário: [dias] x [salário diário] = R$ [valor]
   - Aviso prévio: [salário] = R$ [valor]
   - 13º salário proporcional: [salário] ÷ 12 x [meses] = R$ [valor]
   - Férias proporcionais + 1/3: [salário] ÷ 12 x [meses] x 1,33 = R$ [valor]
   - FGTS + multa de 40%: [salário] x [meses] x 8% x 1,4 = R$ [valor]

3. HORAS EXTRAS
   - Quantidade de horas extras: [horas semanais] x [semanas trabalhadas] = [total horas]
   - Valor da hora normal: [salário] ÷ [horas mensais] = R$ [valor hora]
   - Valor da hora extra (50%): [valor hora] x 1,5 = R$ [valor hora extra]
   - Total de horas extras: [total horas] x [valor hora extra] = R$ [valor]

4. ADICIONAL NOTURNO
   - Horas em período noturno: [quantidade]
   - Adicional noturno (20%): [valor hora] x 0,2 x [horas noturnas] = R$ [valor]

5. REFLEXOS
   - Reflexos das horas extras em DSR: [valor horas extras] ÷ [dias úteis] x [domingos e feriados] = R$ [valor]
   - Reflexos em 13º salário: [valor horas extras + adicional noturno] ÷ 12 = R$ [valor]
   - Reflexos em férias + 1/3: [valor horas extras + adicional noturno] ÷ 12 x 1,33 = R$ [valor]
   - Reflexos no FGTS + 40%: [valor horas extras + adicional noturno] x 8% x 1,4 = R$ [valor]

6. VALOR TOTAL: R$ [soma de todos os valores]`,
  },
  {
    id: "contestacao-trabalhista",
    name: "Contestação Trabalhista",
    description: "Modelo para defesa em reclamação trabalhista",
    content: `Modelo de Contestação Trabalhista:

1. QUALIFICAÇÃO DAS PARTES
   - Reclamante: [nome]
   - Reclamada: [empresa]
   - Número do processo: [número]

2. PRELIMINARES
   - Inépcia da inicial
   - Carência de ação
   - Prescrição
   - Incompetência territorial/material
   - Ilegitimidade de parte

3. IMPUGNAÇÃO AOS FATOS
   - Impugnação específica de cada fato narrado na inicial
   - Contradições na narrativa do reclamante
   - Documentos que contradizem as alegações

4. MÉRITO
   - Contrato de trabalho (data de admissão, função, salário)
   - Jornada de trabalho efetivamente cumprida
   - Pagamento correto de todas as verbas devidas
   - Motivo da rescisão contratual
   - Cumprimento das obrigações trabalhistas

5. IMPUGNAÇÃO AOS PEDIDOS
   - Análise individualizada de cada pedido
   - Fundamentos fáticos e jurídicos para rejeição
   - Documentos comprobatórios

6. REQUERIMENTOS
   - Acolhimento das preliminares
   - Improcedência total dos pedidos
   - Produção de provas (testemunhal, documental, pericial)
   - Condenação em litigância de má-fé (se aplicável)

7. PROVAS DOCUMENTAIS
   - Contrato de trabalho
   - Cartões de ponto
   - Recibos de pagamento
   - Termo de rescisão
   - Outros documentos relevantes`,
  },
  {
    id: "recurso-ordinario",
    name: "Recurso Ordinário",
    description: "Modelo para recurso ordinário trabalhista",
    content: `Modelo de Recurso Ordinário Trabalhista:

1. QUALIFICAÇÃO DAS PARTES
   - Recorrente: [nome/empresa]
   - Recorrido: [nome/empresa]
   - Número do processo: [número]

2. TEMPESTIVIDADE
   - Data da intimação da sentença: [data]
   - Prazo recursal: 8 dias úteis
   - Data da interposição do recurso: [data]

3. PREPARO
   - Custas processuais: R$ [valor]
   - Depósito recursal: R$ [valor]
   - Comprovantes de recolhimento em anexo

4. SÍNTESE PROCESSUAL
   - Breve resumo da reclamação trabalhista
   - Principais pontos da sentença recorrida

5. PRELIMINARES (se houver)
   - Nulidade da sentença
   - Cerceamento de defesa
   - Negativa de prestação jurisdicional

6. RAZÕES DE REFORMA
   - Erro na apreciação das provas
   - Violação de dispositivos legais
   - Divergência jurisprudencial
   - Análise detalhada de cada ponto da sentença que merece reforma

7. PREQUESTIONAMENTO
   - Indicação expressa dos dispositivos legais e constitucionais violados
   - Súmulas e OJs do TST aplicáveis

8. PEDIDOS
   - Conhecimento e provimento do recurso
   - Reforma da sentença nos pontos especificados
   - Inversão do ônus da sucumbência`,
  },
]

// Sugestões para o assistente trabalhista
const trabalhistaSuggestions = [
  "Calcular verbas rescisórias para demissão sem justa causa",
  "Analisar possibilidade de reconhecimento de vínculo empregatício",
  "Verificar prescrição em caso trabalhista",
  "Elaborar estratégia para audiência trabalhista",
  "Calcular horas extras e reflexos",
  "Analisar acordo trabalhista proposto",
]

export default function TrabalhistaAssistant() {
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
        const chat = await createChat("Conversa com Especialista Trabalhista", "trabalhista")
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
      const specialty = trabalhistaSpecialties.find((s) => s.id === selectedSpecialty)
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
          <div className="animate-spin h-5 w-5 text-indigo-500">
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
          <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <FileText className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Especialista Trabalhista</h1>
            <p className="text-gray-400 text-sm">Avaliação de processos trabalhistas e cálculos</p>
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
            assistantType="trabalhista"
            initialMessages={initialMessages}
            suggestions={trabalhistaSuggestions}
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
                    {trabalhistaSpecialties.map((specialty) => (
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
                      {trabalhistaSpecialties.find((s) => s.id === selectedSpecialty)?.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {trabalhistaSpecialties.find((s) => s.id === selectedSpecialty)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900/50 p-4 rounded-md border border-gray-700">
                      <p className="text-gray-300 whitespace-pre-line">{specialtyContent}</p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        className="border-indigo-500 text-indigo-400 hover:bg-indigo-500/10"
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
                  {trabalhistaSpecialties.map((specialty) => (
                    <Card
                      key={specialty.id}
                      className="bg-slate-800/70 border-gray-700 hover:border-indigo-500/50 transition-all cursor-pointer"
                      onClick={() => setSelectedSpecialty(specialty.id)}
                    >
                      <CardContent className="p-4 flex items-start gap-3">
                        <FileText className="h-5 w-5 text-indigo-500 mt-0.5" />
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

