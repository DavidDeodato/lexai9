"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChatInterface } from "@/components/chat/chat-interface"
import { useChat } from "@/hooks/use-chat"
import { ArrowLeft, MessageSquare, Trash2, RefreshCw } from "lucide-react"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = Number.parseInt(params.id as string)
  const [chat, setChat] = useState<any>(null)
  const { getChat, deleteChat, isLoading, error } = useChat()

  useEffect(() => {
    const fetchChat = async () => {
      if (chatId) {
        const chatData = await getChat(chatId)
        setChat(chatData)
      }
    }

    fetchChat()
  }, [chatId])

  const handleDeleteChat = async () => {
    if (confirm("Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.")) {
      await deleteChat(chatId)
    }
  }

  if (isLoading || !chat) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin text-purple-400" />
          <span>Carregando conversa...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Conversa não encontrada</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => router.push("/dashboard")} className="bg-purple-500 hover:bg-purple-600">
            Voltar para o Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="border-gray-700 text-gray-400 hover:text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{chat.title}</h1>
            <p className="text-gray-400 text-sm">
              {new Date(chat.messages[0]?.timestamp || chat.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="border-gray-700 text-red-400 hover:text-red-300 hover:border-red-500/50"
          onClick={handleDeleteChat}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
        <ChatInterface chatId={chatId} assistantType="general" initialMessages={chat.messages} />
      </div>
    </div>
  )
}

