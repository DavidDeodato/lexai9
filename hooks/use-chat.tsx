"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./use-auth"

export type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  feedback?: "positive" | "negative" | null
}

export type Chat = {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  assistantId: string | null
  assistantName: string | null
  isFavorite: boolean
}

export function useChat(chatId?: string, assistantId?: string, assistantName?: string) {
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  // Carregar chat existente ou criar um novo
  useEffect(() => {
    const loadOrCreateChat = async () => {
      if (!user) return

      setIsLoading(true)
      setError(null)

      try {
        if (chatId) {
          // Carregar chat existente
          const response = await fetch(`/api/chats/${chatId}`)

          if (!response.ok) {
            throw new Error(`Erro ao carregar chat: ${response.status}`)
          }

          const chatData = await response.json()
          setChat(chatData)
          setMessages(chatData.messages || [])
        } else if (assistantId) {
          // Criar novo chat com assistente específico
          const response = await fetch("/api/chats", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              assistantId,
              title: `Conversa com ${assistantName || "Assistente"}`,
            }),
          })

          if (!response.ok) {
            throw new Error(`Erro ao criar chat: ${response.status}`)
          }

          const newChat = await response.json()
          setChat(newChat)

          // Redirecionar para o novo chat
          router.push(`/dashboard/chat/${newChat.id}`)
        }
      } catch (error) {
        console.error("Erro:", error)
        setError(error instanceof Error ? error.message : "Erro ao carregar chat")
      } finally {
        setIsLoading(false)
      }
    }

    loadOrCreateChat()
  }, [chatId, assistantId, assistantName, router, user])

  // Enviar mensagem
  const sendMessage = useCallback(
    async (content: string) => {
      if (!chat || !content.trim() || isSending) return

      setIsSending(true)
      setError(null)

      // Adicionar mensagem do usuário localmente para UI imediata
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])

      try {
        // Enviar mensagem para API
        const response = await fetch(`/api/chats/${chat.id}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        })

        if (!response.ok) {
          throw new Error(`Erro ao enviar mensagem: ${response.status}`)
        }

        const data = await response.json()

        // Atualizar mensagens com as respostas do servidor
        setMessages(data.messages)
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error)
        setError(error instanceof Error ? error.message : "Erro ao enviar mensagem")

        // Remover mensagem temporária em caso de erro
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id))
      } finally {
        setIsSending(false)
      }
    },
    [chat, isSending],
  )

  // Dar feedback em uma mensagem
  const giveFeedback = useCallback(
    async (messageId: string, feedback: "positive" | "negative") => {
      if (!chat) return

      try {
        const response = await fetch(`/api/chats/${chat.id}/messages/${messageId}/feedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ feedback }),
        })

        if (!response.ok) {
          throw new Error("Erro ao enviar feedback")
        }

        // Atualizar mensagem localmente
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)))
      } catch (error) {
        console.error("Erro ao dar feedback:", error)
      }
    },
    [chat],
  )

  // Atualizar título do chat
  const updateChatTitle = useCallback(
    async (title: string) => {
      if (!chat) return

      try {
        const response = await fetch(`/api/chats/${chat.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        })

        if (!response.ok) {
          throw new Error("Erro ao atualizar título")
        }

        const updatedChat = await response.json()
        setChat(updatedChat)
      } catch (error) {
        console.error("Erro ao atualizar título:", error)
      }
    },
    [chat],
  )

  // Alternar favorito
  const toggleFavorite = useCallback(async () => {
    if (!chat) return

    try {
      const response = await fetch(`/api/chats/${chat.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toggleFavorite: true }),
      })

      if (!response.ok) {
        throw new Error("Erro ao alternar favorito")
      }

      const updatedChat = await response.json()
      setChat(updatedChat)
    } catch (error) {
      console.error("Erro ao alternar favorito:", error)
    }
  }, [chat])

  return {
    chat,
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    giveFeedback,
    updateChatTitle,
    toggleFavorite,
  }
}

