"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Scale, Settings, Info, FileText, ArrowRight } from "lucide-react"
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

// Especialidades do assistente avaliador
const avaliadorSpecialties = [
  {
    id: "avaliacao-peticao-inicial",
    name: "Avaliação de Petição Inicial",
    description: "Modelo para avaliar petições iniciais",
    content: `Modelo para Avaliação de Petição Inicial:

1. ASPECTOS FORMAIS
   - Endereçamento correto
   - Qualificação completa das partes
   - Valor da causa adequado
   - Documentos essenciais anexados
   - Formatação e organização do texto

2. REQUISITOS LEGAIS (Art. 319 do CPC)
   - Juízo a que é dirigida
   - Nomes, prenomes, estado civil, profissão, etc.
   - Fatos e fundamentos jurídicos do pedido
   - Pedido com suas especificações
   - Valor da causa
   - Provas com que o autor pretende demonstrar a verdade dos fatos
   - Opção pela realização de audiência de conciliação

3. NARRATIVA DOS FATOS
   - Clareza e objetividade
   - Cronologia lógica
   - Detalhamento suficiente
   - Relevância dos fatos narrados
   - Conexão com os pedidos

4. FUNDAMENTAÇÃO JURÍDICA
   - Adequação da legislação citada
   - Pertinência da jurisprudência
   - Atualidade dos precedentes
   - Coerência entre fatos e fundamentos
   - Profundidade da argumentação

5. PEDIDOS
   - Clareza e especificidade
   - Correlação com os fatos e fundamentos
   - Pedidos principais e subsidiários
   - Tutelas provisórias adequadas
   - Pedidos implícitos necessários

6. PONTOS FORTES
   - Aspectos positivos da petição
   - Argumentos mais convincentes
   - Provas mais relevantes

7. PONTOS FRACOS
   - Aspectos que precisam ser melhorados
   - Argumentos frágeis
   - Lacunas probatórias
   - Riscos processuais

8. RECOMENDAÇÕES
   - Sugestões de melhorias
   - Argumentos adicionais
   - Provas complementares
   - Ajustes formais`,
  },
  {
    id: "avaliacao-contestacao",
    name: "Avaliação de Contestação",
    description: "Modelo para avaliar contestações",
    content: `Modelo para Avaliação de Contestação:

1. ASPECTOS FORMAIS
   - Tempestividade
   - Qualificação completa das partes
   - Referência ao processo
   - Formatação e organização do texto

2. PRELIMINARES
   - Pertinência das preliminares arguidas
   - Fundamentação adequada
   - Potencial de acolhimento
   - Consequências processuais

3. IMPUGNAÇÃO ESPECÍFICA
   - Abrangência da impugnação
   - Especificidade das refutações
   - Clareza na contraposição aos fatos
   - Ônus da impugnação específica (art. 341 do CPC)

4. MÉRITO
   - Qualidade da argumentação defensiva
   - Coerência lógica
   - Fatos impeditivos, modificativos ou extintivos
   - Teses jurídicas apresentadas

5. PROVAS
   - Pertinência das provas indicadas
   - Documentos juntados
   - Testemunhas arroladas
   - Necessidade de perícia

6. PEDIDOS
   - Clareza dos pedidos
   - Acolhimento das preliminares
   - Improcedência dos pedidos do autor
   - Pedidos subsidiários

7. PONTOS FORTES
   - Aspectos positivos da contestação
   - Argumentos mais convincentes
   - Provas mais relevantes

8. PONTOS FRACOS
   - Aspectos que precisam ser melhorados
   - Argumentos frágeis
   - Lacunas probatórias
   - Riscos processuais

9. RECOMENDAÇÕES
   - Sugestões de melhorias
   - Argumentos adicionais
   - Provas complementares
   - Ajustes formais`,
  },
  {
    id: "avaliacao-recurso",
    name: "Avaliação de Recurso",
    description: "Modelo para avaliar recursos",
    content: `Modelo para Avaliação de Recurso:

1. ASPECTOS FORMAIS
   - Cabimento do recurso
   - Tempestividade
   - Preparo (custas e depósito recursal)
   - Regularidade de representação
   - Dialeticidade (impugnação específica)

2. PRESSUPOSTOS RECURSAIS
   - Legitimidade recursal
   - Interesse recursal
   - Inexistência de fato impeditivo ou extintivo

3. DELIMITAÇÃO DA MATÉRIA RECORRIDA
   - Clareza quanto aos pontos impugnados
   - Abrangência da impugnação
   - Devolutividade pretendida

4. PRELIMINARES RECURSAIS
   - Pertinência das preliminares arguidas
   - Fundamentação adequada
   - Potencial de acolhimento

5. RAZÕES RECURSAIS
   - Qualidade da argumentação
   - Coerência lógica
   - Demonstração do error in judicando ou error in procedendo
   - Confronto específico com a decisão recorrida

6. FUNDAMENTAÇÃO JURÍDICA
   - Adequação da legislação citada
   - Pertinência da jurisprudência
   - Atualidade dos precedentes
   - Demonstração de violação à lei ou divergência jurisprudencial

7. PEDIDOS RECURSAIS
   - Clareza e especificidade
   - Correlação com as razões recursais
   - Efeitos pretendidos

8. PREQUESTIONAMENTO
   - Indicação expressa dos dispositivos legais
   - Adequação para recursos excepcionais

9. PONTOS FORTES
   - Aspectos positivos do recurso
   - Argumentos mais convincentes
   - Precedentes favoráveis

10. PONTOS FRACOS
    - Aspectos que precisam ser melhorados
    - Argumentos frágeis
    - Precedentes desfavoráveis
    - Riscos processuais

11. RECOMENDAÇÕES
    - Sugestões de melhorias
    - Argumentos adicionais
    - Precedentes complementares
    - Ajustes formais`,
  },
  {
    id: "avaliacao-contrato",
    name: "Avaliação de Contrato",
    description: "Modelo para avaliar contratos",
    content: `Modelo para Avaliação de Contrato:

1. ASPECTOS FORMAIS
   - Qualificação completa das partes
   - Capacidade dos contratantes
   - Assinaturas e reconhecimento de firmas
   - Testemunhas
   - Formatação e organização

2. OBJETO DO CONTRATO
   - Clareza e precisão
   - Determinação ou determinabilidade
   - Licitude, possibilidade e determinação
   - Especificações técnicas adequadas

3. OBRIGAÇÕES DAS PARTES
   - Definição clara das obrigações
   - Equilíbrio contratual
   - Exequibilidade das obrigações
   - Consequências do inadimplemento

4. ASPECTOS FINANCEIROS
   - Preço e forma de pagamento
   - Reajustes e correções
   - Tributação aplicável
   - Garantias financeiras

5. PRAZO E VIGÊNCIA
   - Termo inicial e final
   - Condições de prorrogação
   - Denúncia e resilição

6. CLÁUSULAS SENSÍVEIS
   - Rescisão contratual
   - Multas e penalidades
   - Limitação de responsabilidade
   - Caso fortuito e força maior
   - Confidencialidade
   - Exclusividade
   - Não concorrência
   - Propriedade intelectual

7. SOLUÇÃO DE CONTROVÉRSIAS
   - Foro de eleição
   - Arbitragem
   - Mediação
   - Notificações prévias

8. RISCOS JURÍDICOS
   - Cláusulas potencialmente abusivas
   - Violações à legislação aplicável
   - Interpretações ambíguas
   - Omissões relevantes

9. RECOMENDAÇÕES
   - Sugestões de melhorias
   - Cláusulas adicionais necessárias
   - Ajustes redacionais
   - Garantias complementares`,
  },
]

// Sugestões para o assistente avaliador
const avaliadorSuggestions = [
  "Avaliar petição inicial de ação de indenização",
  "Analisar contestação em processo trabalhista",
  "Verificar pontos fracos em recurso de apelação",
  "Identificar riscos em contrato de prestação de serviços",
  "Avaliar qualidade de argumentação em agravo de instrumento",
  "Analisar cláusulas abusivas em contrato de adesão",
]

export default function AvaliadorAssistant() {
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
        const chat = await createChat("Conversa com Avaliador de Petições", "avaliador")
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
      const specialty = avaliadorSpecialties.find((s) => s.id === selectedSpecialty)
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
          <div className="animate-spin h-5 w-5 text-purple-500">
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
          <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Scale className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Avaliador de Petições</h1>
            <p className="text-gray-400 text-sm">Análise crítica de petições com sugestões</p>
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
            assistantType="avaliador"
            initialMessages={initialMessages}
            suggestions={avaliadorSuggestions}
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
                    {avaliadorSpecialties.map((specialty) => (
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
                      {avaliadorSpecialties.find((s) => s.id === selectedSpecialty)?.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {avaliadorSpecialties.find((s) => s.id === selectedSpecialty)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900/50 p-4 rounded-md border border-gray-700">
                      <p className="text-gray-300 whitespace-pre-line">{specialtyContent}</p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
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
                  {avaliadorSpecialties.map((specialty) => (
                    <Card
                      key={specialty.id}
                      className="bg-slate-800/70 border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
                      onClick={() => setSelectedSpecialty(specialty.id)}
                    >
                      <CardContent className="p-4 flex items-start gap-3">
                        <FileText className="h-5 w-5 text-purple-500 mt-0.5" />
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

