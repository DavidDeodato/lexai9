"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useChat } from "@/hooks/use-chat"
import { Send, Paperclip, RefreshCw, ThumbsUp, ThumbsDown, Copy, Lightbulb, FileUp, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
  feedback?: string | null
  documents?: Array<{
    document: {
      id: number
      name: string
      file_type: string
      file_url: string
    }
  }>
}

interface ChatInterfaceProps {
  chatId: number
  assistantType: string
  initialMessages?: Message[]
  suggestions?: string[]
  modelTemplates?: Array<{
    id: string
    name: string
    description: string
  }>
}

export function ChatInterface({
  chatId,
  assistantType,
  initialMessages = [],
  suggestions = [],
  modelTemplates = [],
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [typingIndex, setTypingIndex] = useState(0)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const { sendMessage, isLoading, error } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, typingText])

  useEffect(() => {
    // Mostrar a primeira mensagem com efeito de digitação
    if (initialMessages.length > 0 && initialMessages[0].sender === "ai" && messages.length === 0) {
      const aiMessage = initialMessages[0]
      setIsTyping(true)
      setMessages([])

      let i = 0
      const typingInterval = setInterval(() => {
        if (i < aiMessage.content.length) {
          setTypingText(aiMessage.content.substring(0, i + 1))
          i++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
          setTypingText("")
          setMessages([aiMessage])
        }
      }, 10) // Velocidade de digitação

      return () => clearInterval(typingInterval)
    } else {
      setMessages(initialMessages)
    }
  }, [initialMessages])

  const handleSendMessage = async () => {
    if (!input.trim() && uploadingFiles.length === 0) return

    // Esconder sugestões após a primeira mensagem
    setShowSuggestions(false)

    // Adicionar mensagem do usuário localmente para feedback imediato
    const userMessage: Message = {
      id: Date.now(), // ID temporário
      sender: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      // Upload de arquivos, se houver
      const documentIds: number[] = []

      if (uploadingFiles.length > 0) {
        for (const file of uploadingFiles) {
          const formData = new FormData()
          formData.append("file", file)

          try {
            // Simular progresso de upload
            const uploadTimer = setInterval(() => {
              setUploadProgress((prev) => {
                const currentProgress = prev[file.name] || 0
                if (currentProgress >= 100) {
                  clearInterval(uploadTimer)
                  return prev
                }
                return {
                  ...prev,
                  [file.name]: Math.min(currentProgress + 10, 100),
                }
              })
            }, 200)

            const response = await fetch("/api/documents", {
              method: "POST",
              body: formData,
            })

            clearInterval(uploadTimer)

            if (response.ok) {
              const document = await response.json()
              documentIds.push(document.id)
            }
          } catch (error) {
            console.error(`Erro ao fazer upload do arquivo ${file.name}:`, error)
          }
        }

        setUploadingFiles([])
        setUploadProgress({})
      }

      // Enviar mensagem para o backend
      const response = await sendMessage(chatId, input, assistantType, documentIds, selectedModel || undefined)

      if (response) {
        // Mostrar resposta da IA com efeito de digitação
        const aiContent = response.aiMessage.content
        setIsTyping(true)

        // Atualizar mensagens com a mensagem do usuário do backend
        setMessages((prev) => [...prev.filter((msg) => msg.id !== userMessage.id), response.userMessage])

        let i = 0
        const typingInterval = setInterval(() => {
          if (i < aiContent.length) {
            setTypingText(aiContent.substring(0, i + 1))
            i++
          } else {
            clearInterval(typingInterval)
            setIsTyping(false)
            setTypingText("")

            // Adicionar mensagem da IA completa
            setMessages((prev) => [...prev, response.aiMessage])
          }
        }, 10) // Velocidade de digitação
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      setIsTyping(false)
      setTypingText("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    handleSendMessage()
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setUploadingFiles((prev) => [...prev, ...newFiles])

      // Inicializar progresso para cada arquivo
      const newProgress = { ...uploadProgress }
      newFiles.forEach((file) => {
        newProgress[file.name] = 0
      })
      setUploadProgress(newProgress)

      // Limpar input para permitir selecionar o mesmo arquivo novamente
      e.target.value = ""
    }
  }

  const removeUploadingFile = (fileName: string) => {
    setUploadingFiles((prev) => prev.filter((file) => file.name !== fileName))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
  }

  const handleFeedback = async (messageId: number, feedback: "positive" | "negative") => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages/${messageId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback }),
      })

      if (response.ok) {
        // Atualizar mensagem localmente
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)))
      }
    } catch (error) {
      console.error("Erro ao enviar feedback:", error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 bg-slate-800/50 border-gray-700 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 relative">
          {/* Sugestões no meio da tela quando não há mensagens */}
          {messages.length === 0 && showSuggestions && suggestions.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl w-full p-4">
                {suggestions.map((suggestion, index) => (
                  <Card
                    key={index}
                    className="bg-slate-800/70 border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-purple-500 mt-0.5" />
                      <span className="text-gray-300">{suggestion}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Mensagens */}
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === "user" ? "bg-purple-500/20 text-white" : "bg-slate-700/50 text-gray-200"
                }`}
              >
                <div className="whitespace-pre-line">{message.content}</div>

                {/* Documentos anexados */}
                {message.documents && message.documents.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-400">Documentos anexados:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.documents.map((doc) => (
                        <a
                          key={doc.document.id}
                          href={doc.document.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 bg-slate-800 rounded text-xs text-gray-300 hover:bg-slate-700"
                        >
                          <FileUp className="h-3 w-3" />
                          {doc.document.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {message.sender === "ai" && (
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-slate-700/50"
                              onClick={() => navigator.clipboard.writeText(message.content)}
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copiar</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={`p-1 rounded-full hover:bg-slate-700/50 ${
                                message.feedback === "positive"
                                  ? "text-green-400"
                                  : "text-gray-400 hover:text-green-400"
                              }`}
                              onClick={() => handleFeedback(message.id, "positive")}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Útil</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={`p-1 rounded-full hover:bg-slate-700/50 ${
                                message.feedback === "negative" ? "text-red-400" : "text-gray-400 hover:text-red-400"
                              }`}
                              onClick={() => handleFeedback(message.id, "negative")}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Não útil</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Mensagem sendo digitada */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-slate-700/50 text-gray-200">
                <div className="whitespace-pre-line">{typingText}</div>
              </div>
            </div>
          )}

          {/* Indicador de carregamento */}
          {isLoading && !isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-slate-700/50 text-gray-200">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
                  <span>Gerando resposta...</span>
                </div>
              </div>
            </div>
          )}

          {/* Mensagem de erro */}
          {error && (
            <div className="flex justify-center">
              <div className="max-w-[80%] rounded-lg p-4 bg-red-500/20 text-red-300">
                <div className="flex items-center gap-2">
                  <span>{error}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      {/* Arquivos sendo enviados */}
      {uploadingFiles.length > 0 && (
        <div className="mt-2 mb-2 space-y-2">
          {uploadingFiles.map((file) => (
            <div key={file.name} className="bg-slate-800/70 rounded-md p-2">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <FileUp className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300 truncate max-w-[200px]">{file.name}</span>
                </div>
                <button className="text-gray-400 hover:text-white" onClick={() => removeUploadingFile(file.name)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Progress value={uploadProgress[file.name] || 0} className="h-1" />
            </div>
          ))}
        </div>
      )}

      {/* Área de input */}
      <div className="flex gap-2 mt-4">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-700 text-gray-400 hover:text-white"
                onClick={handleFileUpload}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Anexar arquivo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="min-h-[60px] max-h-[200px] bg-slate-800/50 border-gray-700 resize-none pr-12"
            disabled={isLoading || isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={(!input.trim() && uploadingFiles.length === 0) || isLoading || isTyping}
            className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-purple-500 hover:bg-purple-600"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

