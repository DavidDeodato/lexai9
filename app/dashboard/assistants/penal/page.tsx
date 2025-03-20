"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChatInterface } from "@/components/chat/chat-interface";
import { Gavel, Settings, Info, FileText, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useChat } from "@/hooks/use-chat";

// Modelos de IA disponíveis
const aiModels = [
  { id: "gpt-4o", name: "GPT-4o", description: "Modelo mais avançado da OpenAI" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", description: "Modelo avançado da Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", description: "Modelo avançado do Google" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Modelo rápido e econômico da OpenAI" },
];

// Especialidades do assistente penal
const penalSpecialties = [
  {
    id: "hc",
    name: "Habeas Corpus",
    description: "Modelo para casos de prisão preventiva",
    content: `Modelo de Habeas Corpus para casos de prisão preventiva:

1. QUALIFICAÇÃO DO PACIENTE
   - Nome completo, nacionalidade, estado civil, profissão, RG, CPF, endereço

2. AUTORIDADE COATORA
   - Identificação do juízo que decretou a prisão preventiva

3. FATOS
   - Breve histórico do processo
   - Circunstâncias da prisão preventiva
   - Ausência dos requisitos legais para a prisão

4. FUNDAMENTOS JURÍDICOS
   - Art. 5º, LXVIII da Constituição Federal
   - Art. 312 e 313 do Código de Processo Penal
   - Ausência de requisitos para prisão preventiva
   - Princípio da presunção de inocência
   - Medidas cautelares alternativas (Art. 319 do CPP)

5. JURISPRUDÊNCIA RELEVANTE
   - Precedentes do STF e STJ sobre prisão preventiva
   - Súmula 697 do STF

6. PEDIDOS
   - Concessão liminar da ordem
   - Expedição de alvará de soltura
   - Aplicação de medidas cautelares alternativas

7. PROVAS DOCUMENTAIS
   - Cópia da decisão que decretou a prisão
   - Documentos pessoais do paciente
   - Comprovante de residência fixa
   - Comprovante de ocupação lícita`,
  },
  {
    id: "alegacoes-finais",
    name: "Alegações Finais",
    description: "Modelo para crimes contra o patrimônio",
    content: `Modelo de Alegações Finais para crimes contra o patrimônio:

1. QUALIFICAÇÃO DO RÉU
   - Nome completo, nacionalidade, estado civil, profissão

2. SÍNTESE DA ACUSAÇÃO
   - Descrição da denúncia
   - Tipificação legal

3. PRELIMINARES
   - Nulidades processuais (se houver)
   - Cerceamento de defesa (se houver)

4. MÉRITO
   - Análise das provas produzidas
   - Fragilidade do conjunto probatório
   - Contradições nos depoimentos
   - Ausência de materialidade ou autoria
   - Excludentes de ilicitude ou culpabilidade

5. TESES DEFENSIVAS
   - Absolvição por insuficiência de provas (art. 386, VII, CPP)
   - Desclassificação para crime menos grave
   - Reconhecimento de privilégio (art. 155, § 2º, CP)
   - Aplicação do princípio da insignificância

6. DOSIMETRIA DA PENA (caso condenação)
   - Circunstâncias judiciais favoráveis
   - Atenuantes aplicáveis
   - Causas de diminuição de pena
   - Regime inicial mais brando
   - Substituição por penas restritivas de direitos

7. PEDIDOS
   - Absolvição
   - Pedidos subsidiários (desclassificação, etc.)

8. JURISPRUDÊNCIA DE APOIO
   - Precedentes favoráveis do STF, STJ e tribunais locais`,
  },
  {
    id: "resposta-acusacao",
    name: "Resposta à Acusação",
    description: "Modelo completo com preliminares",
    content: `Modelo de Resposta à Acusação com preliminares:

1. QUALIFICAÇÃO DO ACUSADO
   - Nome completo, nacionalidade, estado civil, profissão

2. PRELIMINARES
   - Inépcia da denúncia (art. 395, I, CPP)
   - Falta de justa causa (art. 395, III, CPP)
   - Incompetência do juízo
   - Ilicitude das provas obtidas

3. MÉRITO
   - Negativa de autoria
   - Atipicidade da conduta
   - Excludentes de ilicitude
   - Excludentes de culpabilidade
   - Erro de tipo ou proibição

4. DILIGÊNCIAS
   - Perícias necessárias
   - Requisição de documentos
   - Outras diligências probatórias

5. ROL DE TESTEMUNHAS
   - Nome completo
   - Qualificação
   - Endereço

6. PEDIDOS
   - Rejeição da denúncia
   - Absolvição sumária
   - Produção de provas
   - Oitiva das testemunhas arroladas

7. JURISPRUDÊNCIA DE APOIO
   - Precedentes favoráveis do STF, STJ e tribunais locais`,
  },
  {
    id: "recurso-sentido-estrito",
    name: "Recurso em Sentido Estrito",
    description: "Contra decisão de pronúncia",
    content: `Modelo de Recurso em Sentido Estrito contra decisão de pronúncia:

1. QUALIFICAÇÃO DO RECORRENTE
   - Nome completo, nacionalidade, estado civil, profissão

2. TEMPESTIVIDADE
   - Demonstração do prazo legal e tempestividade do recurso

3. SÍNTESE PROCESSUAL
   - Breve histórico do processo
   - Resumo da decisão de pronúncia

4. PRELIMINARES
   - Nulidades processuais (se houver)
   - Cerceamento de defesa (se houver)

5. RAZÕES RECURSAIS
   - Ausência de materialidade delitiva
   - Ausência de indícios suficientes de autoria
   - Existência de excludentes de ilicitude
   - Desclassificação para crime diverso da competência do júri

6. QUALIFICADORAS
   - Impugnação das qualificadoras reconhecidas
   - Ausência de indícios para manutenção das qualificadoras

7. JURISPRUDÊNCIA DE APOIO
   - Precedentes do STF e STJ sobre pronúncia
   - Precedentes sobre desclassificação

8. PEDIDOS
   - Impronúncia (art. 414, CPP)
   - Desclassificação (art. 419, CPP)
   - Absolvição sumária (art. 415, CPP)
   - Exclusão de qualificadoras`,
  },
];

// Sugestões para o assistente penal
const penalSuggestions = [
  "Analisar estratégia de defesa para caso de furto qualificado",
  "Verificar jurisprudência recente sobre legítima defesa",
  "Elaborar quesitos para perícia criminal",
  "Analisar possibilidades de habeas corpus",
  "Verificar nulidades processuais em inquérito policial",
  "Estratégias para audiência de custódia",
];

export default function PenalAssistant() {
  const router = useRouter();
  const { toast } = useToast();

  // 1) Chama o hook useChat com (chatId = undefined, assistantId = "penal", assistantName = "Especialista Penal")
  // Ele deve criar/carregar o chat automaticamente
  const { chat, messages, isLoading, error } = useChat(undefined, "penal", "Especialista Penal");

  // 2) Estados para modelo e especialidades
  const [selectedModel, setSelectedModel] = useState(aiModels[0].id);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [specialtyContent, setSpecialtyContent] = useState<string | null>(null);

  // 3) Enquanto o chat está carregando ou não existe, exibe um spinner
  if (isLoading || !chat) {
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
          <span>Inicializando conversa penal...</span>
        </div>
      </div>
    );
  }

  // 4) Funções para lidar com o modelo e especialidades
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    toast({
      title: "Modelo alterado",
      description: `O modelo foi alterado para ${
        aiModels.find((m) => m.id === modelId)?.name
      }.`,
    });
  };

  const handleSpecialtyChange = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    const found = penalSpecialties.find((s) => s.id === specialtyId);
    setSpecialtyContent(found?.content || null);
  };

  const handleUseSpecialty = () => {
    if (specialtyContent) {
      toast({
        title: "Especialidade aplicada",
        description: "O modelo de especialidade foi aplicado ao chat.",
      });
      // Aqui você poderia enviar specialtyContent como mensagem no chat, se desejar
    }
  };

  // 5) Renderização final do componente
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Gavel className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Especialista Penal</h1>
            <p className="text-gray-400 text-sm">Análise de casos criminais e estratégias de defesa</p>
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

          <Button
            variant="outline"
            size="icon"
            className="border-gray-700 text-gray-400 hover:text-white"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="self-start bg-slate-800/50 border border-gray-700 mb-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
        </TabsList>

        {/* Aba de Chat */}
        <TabsContent value="chat" className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <ChatInterface
            chatId={chat.id}                 // ID do chat retornado pelo useChat
            assistantType="penal"            // Tipo do assistente
            initialMessages={messages}       // Mensagens vindas do hook
            suggestions={penalSuggestions}   // Sugestões específicas
            modelTemplates={aiModels}        // Lista de modelos
          />
        </TabsContent>

        {/* Aba de Especialidades */}
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
                    {penalSpecialties.map((specialty) => (
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
                      {penalSpecialties.find((s) => s.id === selectedSpecialty)?.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {penalSpecialties.find((s) => s.id === selectedSpecialty)?.description}
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
                  {penalSpecialties.map((specialty) => (
                    <Card
                      key={specialty.id}
                      className="bg-slate-800/70 border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
                      onClick={() => handleSpecialtyChange(specialty.id)}
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
  );
}
