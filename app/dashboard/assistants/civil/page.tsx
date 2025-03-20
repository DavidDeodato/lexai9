"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Users, Settings, Info, FileText, ArrowRight, Lock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useChat } from "@/hooks/use-chat"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

// Modelos de IA disponíveis
const aiModels = [
  { id: "gpt-4o", name: "GPT-4o", description: "Modelo mais avançado da OpenAI" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", description: "Modelo avançado da Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", description: "Modelo avançado do Google" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Modelo rápido e econômico da OpenAI" },
]

// Especialidades do assistente civil
const civilSpecialties = [
  {
    id: "contrato-locacao",
    name: "Contrato de Locação",
    description: "Modelo para locação residencial",
    content: `Modelo de Contrato de Locação Residencial:

1. QUALIFICAÇÃO DAS PARTES
   - Locador: [nome completo, nacionalidade, estado civil, profissão, RG, CPF, endereço]
   - Locatário: [nome completo, nacionalidade, estado civil, profissão, RG, CPF, endereço]

2. OBJETO DA LOCAÇÃO
   - Descrição do imóvel: [endereço completo, características, área, matrícula]
   - Finalidade da locação: exclusivamente residencial

3. PRAZO
   - Prazo determinado: [período]
   - Data de início: [data]
   - Data de término: [data]

4. VALOR E FORMA DE PAGAMENTO
   - Valor mensal do aluguel: R$ [valor]
   - Forma de pagamento: [forma]
   - Data de vencimento: [dia] de cada mês
   - Local de pagamento: [local]
   - Multa e juros por atraso: [percentuais]

5. REAJUSTE
   - Periodicidade: anual
   - Índice: [IGPM/FGV, IPCA, etc.]

6. TRIBUTOS E DESPESAS
   - Responsabilidade pelo IPTU: [locador/locatário]
   - Despesas de condomínio: [locador/locatário]
   - Despesas de consumo: [água, luz, gás, internet, etc.]

7. GARANTIA
   - Modalidade: [caução, fiança, seguro fiança]
   - Detalhes da garantia: [valor, prazo, condições]

8. CONSERVAÇÃO E BENFEITORIAS
   - Obrigações do locatário quanto à conservação
   - Regras para realização de benfeitorias
   - Classificação e indenização de benfeitorias

9. CLÁUSULAS ESPECÍFICAS
   - Proibição de sublocação
   - Condições para rescisão antecipada
   - Multa por descumprimento contratual
   - Direito de preferência na compra

10. DISPOSIÇÕES FINAIS
    - Foro de eleição
    - Data e assinaturas
    - Testemunhas`,
  },
  {
    id: "contrato-prestacao-servicos",
    name: "Contrato de Prestação de Serviços",
    description: "Modelo para prestação de serviços",
    content: `Modelo de Contrato de Prestação de Serviços:

1. QUALIFICAÇÃO DAS PARTES
   - Contratante: [nome/razão social, CNPJ/CPF, endereço, representante legal]
   - Contratada: [nome/razão social, CNPJ/CPF, endereço, representante legal]

2. OBJETO DO CONTRATO
   - Descrição detalhada dos serviços a serem prestados
   - Especificações técnicas
   - Resultados esperados
   - Cronograma de execução

3. PRAZO
   - Prazo de vigência: [período]
   - Data de início: [data]
   - Data de término: [data]
   - Possibilidade de prorrogação

4. VALOR E FORMA DE PAGAMENTO
   - Valor total: R$ [valor]
   - Forma de pagamento: [à vista, parcelado, por etapas]
   - Datas de vencimento
   - Dados bancários para pagamento
   - Reajustes (se aplicável)
   - Multa e juros por atraso

5. OBRIGAÇÕES DA CONTRATADA
   - Executar os serviços conforme especificações
   - Fornecer materiais e equipamentos necessários
   - Manter sigilo sobre informações confidenciais
   - Responsabilidade técnica
   - Garantia dos serviços

6. OBRIGAÇÕES DA CONTRATANTE
   - Fornecer informações necessárias
   - Permitir acesso às instalações
   - Efetuar pagamentos nos prazos acordados
   - Fiscalizar a execução dos serviços

7. PROPRIEDADE INTELECTUAL
   - Titularidade dos direitos autorais
   - Licenciamento de uso
   - Confidencialidade

8. RESCISÃO
   - Hipóteses de rescisão
   - Multa rescisória
   - Procedimentos para rescisão

9. DISPOSIÇÕES GERAIS
   - Não existência de vínculo empregatício
   - Responsabilidade por encargos trabalhistas e previdenciários
   - Casos omissos
   - Foro de eleição

10. ASSINATURAS
    - Local e data
    - Assinatura das partes
    - Testemunhas`,
  },
  {
    id: "petição-inicial-civil",
    name: "Petição Inicial Cível",
    description: "Modelo para ação de indenização",
    content: `Modelo de Petição Inicial Cível - Ação de Indenização:

EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA VARA CÍVEL DA COMARCA DE [COMARCA]

[NOME DO AUTOR], [nacionalidade], [estado civil], [profissão], portador do RG nº [número], inscrito no CPF sob o nº [número], residente e domiciliado na [endereço completo], por seu advogado que esta subscreve, conforme procuração anexa, vem, respeitosamente, à presença de Vossa Excelência, propor a presente

AÇÃO DE INDENIZAÇÃO POR DANOS MORAIS E MATERIAIS

em face de [NOME DO RÉU], [nacionalidade], [estado civil], [profissão], portador do RG nº [número], inscrito no CPF sob o nº [número], residente e domiciliado na [endereço completo], pelos fatos e fundamentos a seguir expostos:

1. DOS FATOS
   - Narrativa cronológica e detalhada dos fatos
   - Descrição da conduta do réu
   - Nexo causal entre a conduta e os danos sofridos
   - Provas disponíveis (documentos, testemunhas, etc.)

2. DOS DANOS MATERIAIS
   - Descrição dos prejuízos financeiros sofridos
   - Comprovação dos valores (notas fiscais, orçamentos, etc.)
   - Cálculo do montante total

3. DOS DANOS MORAIS
   - Descrição dos danos à honra, imagem ou dignidade
   - Impacto na vida pessoal e profissional
   - Jurisprudência sobre casos similares

4. DO DIREITO
   - Fundamentos jurídicos (artigos do Código Civil)
   - Responsabilidade civil (art. 186 e 927 do CC)
   - Dever de indenizar
   - Jurisprudência aplicável

5. DO PEDIDO
   - Citação do réu
   - Condenação ao pagamento de danos materiais: R$ [valor]
   - Condenação ao pagamento de danos morais: R$ [valor]
   - Juros e correção monetária
   - Honorários advocatícios
   - Benefícios da justiça gratuita (se aplicável)

6. DAS PROVAS
   - Depoimento pessoal do réu
   - Oitiva de testemunhas
   - Juntada de documentos
   - Outras provas admitidas em direito

7. DO VALOR DA CAUSA
   - R$ [soma dos danos materiais e morais]

Termos em que,
Pede deferimento.

[Local], [data].

[Nome do Advogado]
OAB/[Estado] [número]`,
  },
  {
    id: "contestacao-civil",
    name: "Contestação Cível",
    description: "Modelo para defesa em ação cível",
    content: `Modelo de Contestação Cível:

EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA VARA CÍVEL DA COMARCA DE [COMARCA]

Processo nº [número do processo]

[NOME DO RÉU], já qualificado nos autos da AÇÃO [tipo de ação] que lhe move [NOME DO AUTOR], igualmente qualificado, vem, respeitosamente, por seu advogado que esta subscreve, apresentar sua

CONTESTAÇÃO

pelos fatos e fundamentos a seguir expostos:

1. PRELIMINARES (se houver)
   - Inépcia da inicial
   - Ilegitimidade passiva
   - Incompetência do juízo
   - Litispendência
   - Coisa julgada
   - Prescrição/decadência

2. DOS FATOS
   - Versão do réu sobre os fatos narrados na inicial
   - Contradições na narrativa do autor
   - Fatos impeditivos, modificativos ou extintivos do direito do autor

3. DO DIREITO
   - Fundamentos jurídicos da defesa
   - Dispositivos legais aplicáveis
   - Jurisprudência favorável
   - Doutrinas pertinentes

4. DA IMPUGNAÇÃO ESPECÍFICA
   - Impugnação detalhada de cada alegação do autor
   - Impugnação dos documentos juntados
   - Impugnação do valor da causa (se for o caso)

5. DO PEDIDO
   - Acolhimento das preliminares (se houver)
   - Improcedência total dos pedidos do autor
   - Condenação do autor em custas e honorários
   - Produção de provas (especificar)

6. DAS PROVAS
   - Depoimento pessoal do autor
   - Oitiva de testemunhas (rol em anexo)
   - Perícia (se necessário)
   - Juntada de documentos

Termos em que,
Pede deferimento.

[Local], [data].

[Nome do Advogado]
OAB/[Estado] [número]`,
  },
]

// Sugestões para o assistente civil
const civilSuggestions = [
  "Analisar contrato de locação comercial",
  "Verificar cláusulas abusivas em contrato de adesão",
  "Elaborar notificação extrajudicial",
  "Analisar possibilidade de ação de danos morais",
  "Verificar prescrição em caso de responsabilidade civil",
  "Elaborar contrato de prestação de serviços",
]

// Adicione uma verificação de cliente no início do componente
export default function CivilAssistant() {
  const router = useRouter()
  const { toast } = useToast()
  const { createChat, getChat, isLoading } = useChat()
  const { getUserPlan } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  const [chatId, setChatId] = useState<number | null>(null)
  const [initialMessages, setInitialMessages] = useState([])
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [specialtyContent, setSpecialtyContent] = useState<string | null>(null)

  // Verificar se o componente está montado (cliente)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Verificar se o usuário tem acesso a este assistente
  const userPlan = getUserPlan()
  const hasAccess = userPlan === "pro" || userPlan === "enterprise"

  useEffect(() => {
    if (!hasAccess || !isMounted) return

    const initializeChat = async () => {
      try {
        // Verificar se já existe um chat para este assistente ou criar um novo
        const chat = await createChat("Conversa com Especialista Civil", "civil")
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
  }, [hasAccess, isMounted, createChat, getChat, toast])

  // Se o componente não estiver montado (SSR), renderize um estado de carregamento
  if (!isMounted) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-5 w-5 text-blue-500">
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
          <span>Carregando...</span>
        </div>
      </div>
    )
  }

  // Atualizar conteúdo da especialidade quando selecionada
  useEffect(() => {
    if (selectedSpecialty) {
      const specialty = civilSpecialties.find((s) => s.id === selectedSpecialty)
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

  // Se o usuário não tem acesso, mostrar mensagem de bloqueio
  if (!hasAccess) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
            <Lock className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Assistente Bloqueado</h2>
          <p className="text-gray-400 mb-6">
            O Especialista Civil está disponível apenas para usuários dos planos Profissional e Empresarial.
          </p>
          <Link href="/pricing">
            <Button>Fazer Upgrade</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!chatId) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-5 w-5 text-blue-500">
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
          <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Especialista Civil</h1>
            <p className="text-gray-400 text-sm">Elaboração de contratos e análise de responsabilidade</p>
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
            assistantType="civil"
            initialMessages={initialMessages}
            suggestions={civilSuggestions}
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
                    {civilSpecialties.map((specialty) => (
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
                      {civilSpecialties.find((s) => s.id === selectedSpecialty)?.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {civilSpecialties.find((s) => s.id === selectedSpecialty)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900/50 p-4 rounded-md border border-gray-700">
                      <p className="text-gray-300 whitespace-pre-line">{specialtyContent}</p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
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
                  {civilSpecialties.map((specialty) => (
                    <Card
                      key={specialty.id}
                      className="bg-slate-800/70 border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer"
                      onClick={() => setSelectedSpecialty(specialty.id)}
                    >
                      <CardContent className="p-4 flex items-start gap-3">
                        <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
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

