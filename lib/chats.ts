import prisma from "@/lib/prisma";
import { generateChatResponse } from "./openai";

// Função para obter todos os chats (conversas) de um usuário
export async function getUserChats(userId: string) {
  try {
    return await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (error) {
    console.error("Erro ao obter chats do usuário:", error);
    throw new Error("Falha ao obter chats. Por favor, tente novamente.");
  }
}

// Função para obter um chat específico
export async function getChat(chatId: string, userId: string) {
  try {
    const chat = await prisma.conversation.findFirst({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      throw new Error("Chat não encontrado ou não pertence ao usuário.");
    }

    return chat;
  } catch (error) {
    console.error("Erro ao obter chat:", error);
    throw new Error("Falha ao obter chat. Por favor, tente novamente.");
  }
}

// Função para criar um novo chat (conversa)
export async function createChat(userId: string, title: string, assistantId: string) {
  try {
    // Criar a conversa
    const chat = await prisma.conversation.create({
      data: {
        title,
        userId,
        assistantId,
      },
    });

    // Buscar o assistente para obter a mensagem inicial
    const assistant = await prisma.assistant.findUnique({
      where: { id: assistantId },
    });

    // Mensagem inicial padrão
    let initialMessage = "Olá, como posso ajudar você hoje?";

    // Personaliza a mensagem inicial de acordo com o assistente
    if (assistant) {
      switch (assistantId) {
        case "penal":
          initialMessage =
            "Olá, sou o Especialista em Direito Penal. Como posso ajudar você hoje? Posso auxiliar com análise de casos criminais, jurisprudência atualizada e estratégias de defesa baseadas em precedentes.";
          break;
        case "trabalhista":
          initialMessage =
            "Olá, sou o Especialista em Direito Trabalhista. Como posso ajudar você hoje? Posso auxiliar com avaliação de processos trabalhistas, cálculos de indenizações e análise de conformidade com a CLT.";
          break;
        case "civil":
          initialMessage =
            "Olá, sou o Especialista em Direito Civil. Como posso ajudar você hoje? Posso auxiliar com elaboração de contratos, análise de responsabilidade civil e estratégias para litígios.";
          break;
        case "resumidor":
          initialMessage =
            "Olá, sou o Resumidor de Documentos. Como posso ajudar você hoje? Posso auxiliar com resumo inteligente de petições, contratos e documentos jurídicos complexos.";
          break;
        case "avaliador":
          initialMessage =
            "Olá, sou o Avaliador de Petições. Como posso ajudar você hoje? Posso auxiliar com análise crítica de petições, sugestões de melhorias e verificação de precedentes.";
          break;
        case "conversor":
          initialMessage =
            "Olá, sou o Conversor de Clientes. Como posso ajudar você hoje? Posso auxiliar com elaboração de propostas personalizadas e argumentos persuasivos para prospecção de clientes.";
          break;
        default:
          initialMessage = `Olá, sou o assistente ${assistant.name}. ${
            assistant.instructions ? "Posso ajudar com " + assistant.instructions : "Como posso ajudar você hoje?"
          }`;
      }
    }

    // Criar a mensagem inicial do assistente
    await prisma.message.create({
      data: {
        conversationId: chat.id,
        role: "assistant",
        content: initialMessage,
      },
    });

    // Retornar o chat com a mensagem inicial embutida
    return {
      ...chat,
      messages: [
        {
          id: "0",
          conversationId: chat.id,
          role: "assistant",
          content: initialMessage,
          createdAt: new Date(),
        },
      ],
    };
  } catch (error) {
    console.error("Erro ao criar chat:", error);
    throw new Error("Falha ao criar chat. Por favor, tente novamente.");
  }
}

// Função para atualizar o título do chat
export async function updateChatTitle(chatId: string, userId: string, title: string) {
  try {
    // Verificar se o chat pertence ao usuário
    const chat = await prisma.conversation.findFirst({
      where: {
        id: chatId,
        userId,
      },
    });

    if (!chat) {
      throw new Error("Chat não encontrado ou não pertence ao usuário.");
    }

    // Atualizar o título
    return await prisma.conversation.update({
      where: { id: chatId },
      data: { title },
    });
  } catch (error) {
    console.error("Erro ao atualizar título do chat:", error);
    throw new Error("Falha ao atualizar título do chat. Por favor, tente novamente.");
  }
}

// Função para excluir um chat
export async function deleteChat(chatId: string, userId: string) {
  try {
    // Verificar se o chat pertence ao usuário
    const chat = await prisma.conversation.findFirst({
      where: {
        id: chatId,
        userId,
      },
    });

    if (!chat) {
      throw new Error("Chat não encontrado ou não pertence ao usuário.");
    }

    // Excluir a conversa (as mensagens serão excluídas automaticamente devido ao onDelete: Cascade)
    await prisma.conversation.delete({
      where: { id: chatId },
    });

    return true;
  } catch (error) {
    console.error("Erro ao excluir chat:", error);
    throw new Error("Falha ao excluir chat. Por favor, tente novamente.");
  }
}

// Função para adicionar mensagem ao chat
export async function addMessage(chatId: string, userId: string, content: string) {
  try {
    // Verificar se o chat pertence ao usuário e obter as mensagens existentes
    const chat = await prisma.conversation.findFirst({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      throw new Error("Chat não encontrado ou não pertence ao usuário.");
    }

    // Adicionar a mensagem do usuário
    const userMessage = await prisma.message.create({
      data: {
        conversationId: chatId,
        role: "user",
        content,
      },
    });

    // Atualizar o timestamp do chat
    await prisma.conversation.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    // Gerar resposta da IA usando as mensagens existentes mais a nova
    const aiResponse = await generateChatResponse([...chat.messages, userMessage], chat.assistantId, userId);

    // Adicionar a resposta da IA
    const aiMessage = await prisma.message.create({
      data: {
        conversationId: chatId,
        role: "assistant",
        content: aiResponse || "Desculpe, não consegui gerar uma resposta. Por favor, tente novamente.",
      },
    });

    return { userMessage, aiMessage };
  } catch (error) {
    console.error("Erro ao adicionar mensagem:", error);
    throw new Error("Falha ao adicionar mensagem. Por favor, tente novamente.");
  }
}

// Função para dar feedback a uma mensagem
export async function giveMessageFeedback(messageId: string, userId: string, feedback: "positive" | "negative") {
  try {
    // Verificar se a mensagem pertence ao usuário
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message || message.conversation.userId !== userId) {
      throw new Error("Mensagem não encontrada ou não pertence ao usuário.");
    }

    // Atualizar o feedback
    return await prisma.message.update({
      where: { id: messageId },
      data: { feedback },
    });
  } catch (error) {
    console.error("Erro ao dar feedback à mensagem:", error);
    throw new Error("Falha ao dar feedback à mensagem. Por favor, tente novamente.");
  }
}
