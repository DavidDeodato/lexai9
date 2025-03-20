"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChatInterface } from "@/components/chat/chat-interface"
import { ShoppingBag, Settings, Info, FileText, ArrowRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useChat } from "@/hooks/use-chat"
import { useAuth } from "@/hooks/use-auth"

// Modelos de IA disponíveis
const aiModels = [
  { id: "gpt-4o", name: "GPT-4o", description: "Modelo mais avançado da OpenAI" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", description: "Modelo avançado da Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", description: "Modelo avançado do Google" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Modelo rápido e econômico da OpenAI" },
]

// Especialidades do assistente consumidor
const consumidorSpecialties = [
  {
    id: "reclamacao-consumidor",
    name: "Reclamação de Consumidor",
    description: "Modelo para petição inicial de consumidor",
    content: `Modelo para Reclamação de Consumidor:

1. QUALIFICAÇÃO DAS PARTES
 - Consumidor: [nome completo, nacionalidade, estado civil, profissão, RG, CPF, endereço]
 - Fornecedor: [razão social, CNPJ, endereço]

2. FATOS
 - Data da aquisição do produto/serviço
 - Descrição detalhada do produto/serviço
 - Valor pago
 - Problemas apresentados
 - Tentativas de resolução extrajudicial
 - Protocolos de atendimento
 - Danos sofridos pelo consumidor

3. FUNDAMENTOS JURÍDICOS
 - Código de Defesa do Consumidor (Lei 8.078/90)
 - Relação de consumo (arts. 2º e 3º do CDC)
 - Responsabilidade objetiva (art. 14 do CDC)
 - Vício do produto/serviço (arts. 18 a 25 do CDC)
 - Práticas abusivas (arts. 39 a 41 do CDC)
 - Publicidade enganosa/abusiva (arts. 36 a 38 do CDC)
 - Danos morais e materiais (art. 6º, VI, do CDC)

4. INVERSÃO DO ÔNUS DA PROVA
 - Hipossuficiência técnica/financeira do consumidor
 - Verossimilhança das alegações
 - Aplicação do art. 6º, VIII, do CDC

5. PEDIDOS
 - Concessão dos benefícios da justiça gratuita
 - Inversão do ônus da prova
 - Condenação à substituição do produto/refazimento do serviço
 - Restituição de valores pagos
 - Indenização por danos materiais
 - Indenização por danos morais
 - Multa por descumprimento

6. PROVAS
 - Nota fiscal/contrato
 - Comprovante de pagamento
 - Registros de reclamações
 - Laudos técnicos
 - Fotografias/vídeos
 - Testemunhas

7. VALOR DA CAUSA
 - Soma dos pedidos econômicos`,
  },
  {
    id: "defesa-fornecedor",
    name: "Defesa do Fornecedor",
    description: "Modelo para contestação em ação consumerista",
    content: `Modelo para Defesa do Fornecedor:

1. QUALIFICAÇÃO DAS PARTES
 - Consumidor/Autor: [nome]
 - Fornecedor/Réu: [razão social]
 - Número do processo: [número]

2. PRELIMINARES
 - Ilegitimidade passiva
 - Incompetência do juízo
 - Litispendência
 - Coisa julgada
 - Prescrição/decadência (arts. 26 e 27 do CDC)

3. IMPUGNAÇÃO AOS FATOS
 - Contestação específica dos fatos narrados
 - Esclarecimentos sobre o produto/serviço
 - Cumprimento das obrigações contratuais
 - Ausência de vícios/defeitos
 - Uso inadequado pelo consumidor

4. EXCLUDENTES DE RESPONSABILIDADE
 - Inexistência de defeito (art. 14, §3º, I, do CDC)
 - Culpa exclusiva do consumidor (art. 14, §3º, II, do CDC)
 - Culpa exclusiva de terceiro (art. 14, §3º, II, do CDC)
 - Caso fortuito/força maior

5. IMPUGNAÇÃO AOS DANOS
 - Ausência de comprovação dos danos materiais
 - Mero aborrecimento (não configuração de dano moral)
 - Quantum indenizatório excessivo

6. IMPUGNAÇÃO À INVERSÃO DO ÔNUS DA PROVA
 - Ausência de hipossuficiência
 - Ausência de verossimilhança

7. PEDIDOS
 - Acolhimento das preliminares
 - Improcedência total dos pedidos
 - Subsidiariamente, redução do quantum indenizatório

8. PROVAS
 - Documentos técnicos
 - Laudos periciais
 - Registros de atendimento
 - Testemunhas`,
  },
  {
    id: "analise-contrato-consumo",
    name: "Análise de Contrato de Consumo",
    description: "Modelo para análise de contratos consumeristas",
    content: `Modelo para Análise de Contrato de Consumo:

1. IDENTIFICAÇÃO DO CONTRATO
 - Tipo de contrato (adesão, padrão, etc.)
 - Partes contratantes
 - Objeto do contrato
 - Data de celebração
 - Prazo de vigência

2. CLÁUSULAS ESSENCIAIS
 - Descrição do produto/serviço
 - Preço e forma de pagamento
 - Prazo e condições de entrega/execução
 - Garantias oferecidas
 - Direito de arrependimento (art. 49 do CDC)

3. ANÁLISE DE CLÁUSULAS ABUSIVAS (art. 51 do CDC)
 - Limitação de responsabilidade do fornecedor
 - Renúncia a direitos do consumidor
 - Transferência de responsabilidade a terceiros
 - Obrigações iníquas ou abusivas
 - Inversão do ônus da prova
 - Arbitragem compulsória
 - Alteração unilateral do contrato

4. PRÁTICAS COMERCIAIS
 - Publicidade (arts. 36 a 38 do CDC)
 - Oferta (arts. 30 a 35 do CDC)
 - Informações claras e adequadas (art. 6º, III, do CDC)
 - Cobrança de dívidas (art. 42 do CDC)
 - Banco de dados (arts. 43 e 44 do CDC)

5. RISCOS JURÍDICOS
 - Cláusulas potencialmente nulas
 - Violações ao CDC
 - Jurisprudência desfavorável
 - Fiscalização de órgãos de defesa do consumidor

6. RECOMENDAÇÕES
 - Ajustes necessários
 - Exclusão de cláusulas abusivas
 - Inclusão de informações obrigatórias
 - Adequação à legislação consumerista`,
  },
  {
    id: "recall",
    name: "Procedimento de Recall",
    description: "Modelo para recall de produtos",
    content: `Modelo para Procedimento de Recall:

1. IDENTIFICAÇÃO DO FORNECEDOR
 - Razão social
 - CNPJ
 - Endereço
 - Contatos (telefone, e-mail)
 - Responsável legal

2. IDENTIFICAÇÃO DO PRODUTO/SERVIÇO
 - Descrição detalhada
 - Marca e modelo
 - Lote/série
 - Data de fabricação
 - Período de comercialização
 - Quantidade afetada

3. DESCRIÇÃO DO DEFEITO
 - Natureza do defeito
 - Riscos ao consumidor
 - Acidentes já ocorridos
 - Gravidade do risco

4. PLANO DE MÍDIA (art. 10, §1º, CDC)
 - Veículos de comunicação
 - Frequência das comunicações
 - Abrangência territorial
 - Conteúdo da mensagem
 - Duração da campanha

5. PLANO DE ATENDIMENTO
 - Canais de atendimento
 - Procedimentos para o consumidor
 - Locais de atendimento
 - Prazos para reparo/substituição
 - Compensações oferecidas

6. COMUNICAÇÃO ÀS AUTORIDADES
 - SENACON (Secretaria Nacional do Consumidor)
 - PROCON
 - Agências reguladoras

7. CRONOGRAMA DE EXECUÇÃO
 - Início e término da campanha
 - Metas de atendimento
 - Indicadores de efetividade
 - Relatórios periódicos

8. MEDIDAS CORRETIVAS
 - Alterações no produto/serviço
 - Controle de qualidade
 - Prevenção de novos incidentes

9. DOCUMENTAÇÃO
 - Registros de comunicação
 - Comprovantes de atendimento
 - Relatórios às autoridades
 - Arquivamento de informações`,
  },
]

// Sugestões para o assistente consumidor
const consumidorSuggestions = [
  "Analisar contrato de adesão para identificar cláusulas abusivas",
  "Elaborar reclamação sobre produto com defeito",
  "Verificar direitos em caso de atraso na entrega de produto",
  "Analisar possibilidade de cancelamento de serviço contínuo",
  "Elaborar notificação extrajudicial para fornecedor",
  "Verificar prazo de garantia legal e contratual",
]

export default function ConsumidorAssistant() {
  const router = useRouter()
  const { toast } = useToast()
  const { createChat, getChat, isLoading } = useChat()
  const { getUserPlan } = useAuth()

  const [chatId, setChatId] = useState<number | null>(null)
  const [initialMessages, setInitialMessages] = useState([])
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [specialtyContent, setSpecialtyContent] = useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Verificar autorização baseada no plano do usuário
    const userPlan = getUserPlan()
    const hasAccess = userPlan === "pro" || userPlan === "enterprise"
    setIsAuthorized(hasAccess)

    if (!hasAccess) {
      toast({
        title: "Acesso restrito",
        description: "Este assistente está disponível apenas para planos Pro e Enterprise.",
        variant: "destructive",
      })
      return
    }

    const initializeChat = async () => {
      try {
        // Verificar se já existe um chat para este assistente ou criar um novo
        const chat = await createChat("Conversa com Especialista em Direito do Consumidor", "consumidor")
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

    if (hasAccess) {
      initializeChat()
    }
  }, [createChat, getChat, getUserPlan, toast])

  // Atualizar conteúdo da especialidade quando selecionada
  useEffect(() => {
    if (selectedSpecialty) {
      const specialty = consumidorSpecialties.find((s) => s.id === selectedSpecialty)
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

  if (!isAuthorized) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center">
        <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20 max-w-md text-center">
          <ShoppingBag className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Acesso Restrito</h2>
          <p className="text-gray-400 mb-4">
            Este assistente está disponível apenas para assinantes dos planos Pro e Enterprise.
          </p>
          <Button onClick={() => router.push("/pricing")} className="bg-red-500 hover:bg-red-600 text-white">
            Ver planos disponíveis
          </Button>
        </div>
      </div>
    )
  }

  if (!chatId) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-5 w-5 text-red-500">
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
          <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Especialista em Direito do Consumidor</h1>
            <p className="text-gray-400 text-sm">Análise de casos de relações de consumo</p>
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
            assistantType="consumidor"
            initialMessages={initialMessages}
            suggestions={consumidorSuggestions}
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
                    {consumidorSpecialties.map((specialty) => (
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
                      {consumidorSpecialties.find((s) => s.id === selectedSpecialty)?.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {consumidorSpecialties.find((s) => s.id === selectedSpecialty)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900/50 p-4 rounded-md border border-gray-700">
                      <p className="text-gray-300 whitespace-pre-line">{specialtyContent}</p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
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
                  {consumidorSpecialties.map((specialty) => (
                    <Card
                      key={specialty.id}
                      className="bg-slate-800/70 border-gray-700 hover:border-red-500/50 transition-all cursor-pointer"
                      onClick={() => setSelectedSpecialty(specialty.id)}
                    >
                      <CardContent className="p-4 flex items-start gap-3">
                        <FileText className="h-5 w-5 text-red-500 mt-0.5" />
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

