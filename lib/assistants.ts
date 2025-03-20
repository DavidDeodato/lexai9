import prisma from "./prisma"

// Assistentes padrão
const defaultAssistants = [
  {
    id: "penal",
    name: "Especialista Penal",
    description: "Análise de casos criminais e estratégias de defesa",
    icon: "gavel",
    category: "juridico",
    instructions:
      "Você é um especialista em direito penal brasileiro. Forneça análises precisas sobre casos criminais, jurisprudência atualizada e estratégias de defesa baseadas em precedentes.",
    is_default: true,
  },
  {
    id: "trabalhista",
    name: "Especialista Trabalhista",
    description: "Avaliação de processos trabalhistas e cálculos",
    icon: "fileText",
    category: "juridico",
    instructions:
      "Você é um especialista em direito trabalhista brasileiro. Forneça avaliações detalhadas de processos trabalhistas, cálculos de indenizações e análise de conformidade com a CLT.",
    is_default: true,
  },
  {
    id: "civil",
    name: "Especialista Civil",
    description: "Elaboração de contratos e análise de responsabilidade",
    icon: "users",
    category: "juridico",
    instructions:
      "Você é um especialista em direito civil brasileiro. Forneça análises sobre contratos, responsabilidade civil e estratégias para litígios.",
    is_default: true,
  },
  {
    id: "resumidor",
    name: "Resumidor de Documentos",
    description: "Resumo inteligente de petições e documentos",
    icon: "brain",
    category: "documentos",
    instructions:
      "Você é um especialista em resumir documentos jurídicos. Forneça resumos concisos e precisos de petições, contratos e documentos jurídicos complexos.",
    is_default: true,
  },
  {
    id: "avaliador",
    name: "Avaliador de Petições",
    description: "Análise crítica de petições com sugestões",
    icon: "scale",
    category: "documentos",
    instructions:
      "Você é um especialista em avaliar petições jurídicas. Forneça análises críticas com sugestões de melhorias e verificação de precedentes.",
    is_default: true,
  },
  {
    id: "conversor",
    name: "Conversor de Clientes",
    description: "Elaboração de propostas personalizadas",
    icon: "users",
    category: "negocios",
    instructions:
      "Você é um especialista em converter clientes potenciais. Ajude a elaborar propostas personalizadas e argumentos persuasivos para prospecção de clientes.",
    is_default: true,
  },
]

// Função para inicializar assistentes padrão no banco de dados
export async function initializeDefaultAssistants() {
  try {
    for (const assistant of defaultAssistants) {
      // Verificar se o assistente já existe
      const existingAssistant = await prisma.assistant_lex.findUnique({
        where: { id: assistant.id },
      })

      if (!existingAssistant) {
        // Criar assistente
        await prisma.assistant_lex.create({
          data: {
            id: assistant.id,
            name: assistant.name,
            description: assistant.description,
            icon: assistant.icon,
            category: assistant.category,
            instructions: assistant.instructions,
            is_default: assistant.is_default,
          },
        })
      }
    }

    console.log("Assistentes padrão inicializados com sucesso.")
  } catch (error) {
    console.error("Erro ao inicializar assistentes padrão:", error)
  }
}

// Função para obter todos os assistentes
export async function getAllAssistants() {
  try {
    // Buscar assistentes do banco de dados
    const dbAssistants = await prisma.assistant_lex.findMany({
      orderBy: [{ is_default: "desc" }, { name: "asc" }],
    })

    return dbAssistants
  } catch (error) {
    console.error("Erro ao obter assistentes:", error)
    throw new Error("Falha ao obter assistentes. Por favor, tente novamente.")
  }
}

// Função para obter um assistente específico
export async function getAssistant(assistantId: string) {
  try {
    // Buscar assistente do banco de dados
    const assistant = await prisma.assistant_lex.findUnique({
      where: { id: assistantId },
      include: {
        documents: {
          include: {
            document: true,
          },
        },
      },
    })

    if (!assistant) {
      throw new Error("Assistente não encontrado.")
    }

    return assistant
  } catch (error) {
    console.error("Erro ao obter assistente:", error)
    throw new Error("Falha ao obter assistente. Por favor, tente novamente.")
  }
}

// Função para criar um assistente personalizado
export async function createAssistant(data: {
  name: string
  description: string
  icon: string
  category: string
  instructions?: string
  model?: string
  temperature?: number
  documents?: number[]
}) {
  try {
    // Criar assistente no banco de dados
    const assistant = await prisma.assistant_lex.create({
      data: {
        id: `custom-${Date.now()}`,
        name: data.name,
        description: data.description,
        icon: data.icon,
        category: data.category,
        instructions: data.instructions || "",
        model: data.model || "gpt-4o",
        temperature: data.temperature || 0.7,
        is_default: false,
      },
    })

    // Associar documentos, se fornecidos
    if (data.documents && data.documents.length > 0) {
      for (const documentId of data.documents) {
        await prisma.assistantDocument_lex.create({
          data: {
            assistant_id: assistant.id,
            document_id: documentId,
          },
        })
      }
    }

    return assistant
  } catch (error) {
    console.error("Erro ao criar assistente:", error)
    throw new Error("Falha ao criar assistente. Por favor, tente novamente.")
  }
}

// Função para atualizar um assistente
export async function updateAssistant(
  assistantId: string,
  data: {
    name?: string
    description?: string
    icon?: string
    category?: string
    instructions?: string
    model?: string
    temperature?: number
    documents?: number[]
  },
) {
  try {
    // Verificar se o assistente existe e não é padrão
    const assistant = await prisma.assistant_lex.findUnique({
      where: { id: assistantId },
    })

    if (!assistant) {
      throw new Error("Assistente não encontrado.")
    }

    if (assistant.is_default) {
      throw new Error("Assistentes padrão não podem ser modificados.")
    }

    // Atualizar assistente
    const updatedAssistant = await prisma.assistant_lex.update({
      where: { id: assistantId },
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        category: data.category,
        instructions: data.instructions,
        model: data.model,
        temperature: data.temperature,
      },
    })

    // Atualizar documentos associados, se fornecidos
    if (data.documents) {
      // Remover associações existentes
      await prisma.assistantDocument_lex.deleteMany({
        where: { assistant_id: assistantId },
      })

      // Adicionar novas associações
      for (const documentId of data.documents) {
        await prisma.assistantDocument_lex.create({
          data: {
            assistant_id: assistantId,
            document_id: documentId,
          },
        })
      }
    }

    return updatedAssistant
  } catch (error) {
    console.error("Erro ao atualizar assistente:", error)
    throw new Error("Falha ao atualizar assistente. Por favor, tente novamente.")
  }
}

// Função para excluir um assistente
export async function deleteAssistant(assistantId: string) {
  try {
    // Verificar se o assistente existe e não é padrão
    const assistant = await prisma.assistant_lex.findUnique({
      where: { id: assistantId },
    })

    if (!assistant) {
      throw new Error("Assistente não encontrado.")
    }

    if (assistant.is_default) {
      throw new Error("Assistentes padrão não podem ser excluídos.")
    }

    // Excluir assistente
    await prisma.assistant_lex.delete({
      where: { id: assistantId },
    })

    return true
  } catch (error) {
    console.error("Erro ao excluir assistente:", error)
    throw new Error("Falha ao excluir assistente. Por favor, tente novamente.")
  }
}

