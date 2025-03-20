import { OpenAI } from "openai"
import prisma from "./prisma"

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not defined")
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Função para gerar resposta de chat
export async function generateChatResponse(messages: any[], assistantType = "general", userId?: number) {
  // Buscar instruções do assistente no banco de dados
  let systemMessage = "Você é um assistente jurídico especializado em direito brasileiro."
  let model = "gpt-4o"
  let temperature = 0.7

  try {
    // Se assistantType for um ID, buscar o assistente no banco
    if (
      assistantType &&
      assistantType !== "general" &&
      !["penal", "trabalhista", "civil", "resumidor", "avaliador", "conversor"].includes(assistantType)
    ) {
      const assistant = await prisma.assistant_lex.findUnique({
        where: { id: assistantType },
      })

      if (assistant) {
        systemMessage = assistant.instructions || systemMessage
        model = assistant.model
        temperature = assistant.temperature
      }
    } else {
      // Usar instruções padrão com base no tipo de assistente
      switch (assistantType) {
        case "penal":
          systemMessage =
            "Você é um especialista em direito penal brasileiro. Forneça análises precisas sobre casos criminais, jurisprudência atualizada e estratégias de defesa baseadas em precedentes."
          break
        case "trabalhista":
          systemMessage =
            "Você é um especialista em direito trabalhista brasileiro. Forneça avaliações detalhadas de processos trabalhistas, cálculos de indenizações e análise de conformidade com a CLT."
          break
        case "civil":
          systemMessage =
            "Você é um especialista em direito civil brasileiro. Forneça análises sobre contratos, responsabilidade civil e estratégias para litígios."
          break
        case "resumidor":
          systemMessage =
            "Você é um especialista em resumir documentos jurídicos. Forneça resumos concisos e precisos de petições, contratos e documentos jurídicos complexos."
          break
        case "avaliador":
          systemMessage =
            "Você é um especialista em avaliar petições jurídicas. Forneça análises críticas com sugestões de melhorias e verificação de precedentes."
          break
        case "conversor":
          systemMessage =
            "Você é um especialista em converter clientes potenciais. Ajude a elaborar propostas personalizadas e argumentos persuasivos para prospecção de clientes."
          break
        default:
          systemMessage =
            "Você é um assistente jurídico especializado em direito brasileiro. Forneça informações precisas e úteis sobre questões jurídicas."
      }
    }

    // Se o usuário estiver autenticado, buscar suas configurações
    if (userId) {
      const userSettings = await prisma.userSettings_lex.findUnique({
        where: { user_id: userId },
      })

      if (userSettings) {
        model = userSettings.default_model
        temperature = userSettings.temperature
      }
    }

    // Adicionar a mensagem do sistema ao início do array
    const formattedMessages = [
      { role: "system", content: systemMessage },
      ...messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      })),
    ]

    // Registrar tokens usados (estimativa)
    const tokensEstimate = formattedMessages.reduce((acc, msg) => acc + msg.content.length / 4, 0)

    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: formattedMessages,
        temperature: temperature,
        max_tokens: 2000,
      })

      // Atualizar uso do assistente se o usuário estiver autenticado
      if (userId && assistantType && assistantType !== "general") {
        await updateAssistantUsage(userId, assistantType, tokensEstimate + (response.usage?.total_tokens || 0))
      }

      return response.choices[0].message.content
    } catch (error) {
      console.error("Error generating chat response:", error)
      throw new Error("Falha ao gerar resposta. Por favor, tente novamente.")
    }
  } catch (error) {
    console.error("Error in generateChatResponse:", error)
    throw new Error("Falha ao processar a solicitação. Por favor, tente novamente.")
  }
}

// Função para atualizar o uso do assistente
async function updateAssistantUsage(userId: number, assistantId: string, tokensUsed: number) {
  try {
    // Verificar se já existe um registro de uso
    const existingUsage = await prisma.assistantUsage_lex.findUnique({
      where: {
        user_id_assistant_id: {
          user_id: userId,
          assistant_id: assistantId,
        },
      },
    })

    if (existingUsage) {
      // Atualizar registro existente
      await prisma.assistantUsage_lex.update({
        where: {
          id: existingUsage.id,
        },
        data: {
          tokens_used: existingUsage.tokens_used + tokensUsed,
          last_used: new Date(),
        },
      })
    } else {
      // Criar novo registro
      await prisma.assistantUsage_lex.create({
        data: {
          user_id: userId,
          assistant_id: assistantId,
          tokens_used: tokensUsed,
          last_used: new Date(),
        },
      })
    }
  } catch (error) {
    console.error("Error updating assistant usage:", error)
    // Não lançar erro para não interromper o fluxo principal
  }
}

// Função para analisar documentos
export async function analyzeDocument(documentContent: string, query?: string) {
  const prompt = query
    ? `Analise o seguinte documento e responda à pergunta: ${query}\n\nDocumento: ${documentContent}`
    : `Analise o seguinte documento e forneça um resumo dos pontos principais:\n\nDocumento: ${documentContent}`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Você é um assistente jurídico especializado em análise de documentos." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 2000,
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error("Error analyzing document:", error)
    throw new Error("Falha ao analisar o documento. Por favor, tente novamente.")
  }
}

// Função para extrair texto de documentos
export async function extractTextFromDocument(documentContent: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente especializado em extrair texto de documentos. Extraia apenas o texto, sem formatação ou análise.",
        },
        { role: "user", content: documentContent },
      ],
      temperature: 0.0,
      max_tokens: 4000,
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error("Error extracting text from document:", error)
    throw new Error("Falha ao extrair texto do documento. Por favor, tente novamente.")
  }
}

