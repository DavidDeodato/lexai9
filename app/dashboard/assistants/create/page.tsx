"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, ArrowLeft, Plus, X, Save, FileUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Modelos de IA disponíveis
const aiModels = [
  { id: "gpt-4o", name: "GPT-4o", description: "Modelo mais avançado da OpenAI" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", description: "Modelo avançado da Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", description: "Modelo avançado do Google" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Modelo rápido e econômico da OpenAI" },
]

export default function CreateAssistant() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "brain",
    iconColor: "purple",
    model: "gpt-4o",
    systemPrompt: "",
    isPublic: false,
    tags: [] as string[],
    documents: [] as File[],
    knowledgeBase: [] as string[],
  })

  const [newTag, setNewTag] = useState("")
  const [newKnowledgeBase, setNewKnowledgeBase] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  const handleAddKnowledgeBase = () => {
    if (newKnowledgeBase.trim() && !formData.knowledgeBase.includes(newKnowledgeBase.trim())) {
      setFormData((prev) => ({ ...prev, knowledgeBase: [...prev.knowledgeBase, newKnowledgeBase.trim()] }))
      setNewKnowledgeBase("")
    }
  }

  const handleRemoveKnowledgeBase = (kb: string) => {
    setFormData((prev) => ({ ...prev, knowledgeBase: prev.knowledgeBase.filter((k) => k !== kb) }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFormData((prev) => ({ ...prev, documents: [...prev.documents, ...newFiles] }))

      // Limpar input para permitir selecionar o mesmo arquivo novamente
      e.target.value = ""
    }
  }

  const handleRemoveFile = (fileName: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((file) => file.name !== fileName),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Primeiro, fazer upload dos documentos
      const documentIds: number[] = []

      if (formData.documents.length > 0) {
        for (const file of formData.documents) {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/documents", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const document = await response.json()
            documentIds.push(document.id)
          }
        }
      }

      // Criar o assistente
      const response = await fetch("/api/assistants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          documentIds,
        }),
      })

      if (response.ok) {
        const assistant = await response.json()
        toast({
          title: "Assistente criado com sucesso!",
          description: `O assistente ${assistant.name} foi criado e está pronto para uso.`,
        })
        router.push("/dashboard/assistants")
      } else {
        const error = await response.json()
        throw new Error(error.message || "Erro ao criar assistente")
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar assistente",
        description: error.message || "Ocorreu um erro ao criar o assistente. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="border-gray-700 text-gray-400 hover:text-white"
            onClick={() => router.push("/dashboard/assistants")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Criar Assistente</h1>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.name || !formData.description || !formData.systemPrompt}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>Criando...</>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Assistente
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-gray-700">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="advanced">Configurações Avançadas</TabsTrigger>
            <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card className="bg-slate-800/70 border-gray-700">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Assistente</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Especialista em Direito Tributário"
                    className="bg-slate-900/50 border-gray-700"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descreva o que este assistente faz e como ele pode ajudar"
                    className="bg-slate-900/50 border-gray-700 min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Ícone</Label>
                    <Select value={formData.icon} onValueChange={(value) => handleSelectChange("icon", value)}>
                      <SelectTrigger className="bg-slate-900/50 border-gray-700">
                        <SelectValue placeholder="Selecione um ícone" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-gray-700">
                        <SelectItem value="brain">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            <span>Cérebro</span>
                          </div>
                        </SelectItem>
                        {/* Adicionar mais ícones aqui */}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="iconColor">Cor do Ícone</Label>
                    <Select
                      value={formData.iconColor}
                      onValueChange={(value) => handleSelectChange("iconColor", value)}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-gray-700">
                        <SelectValue placeholder="Selecione uma cor" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-gray-700">
                        <SelectItem value="purple">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-purple-500" />
                            <span>Roxo</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="indigo">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-indigo-500" />
                            <span>Índigo</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="blue">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-blue-500" />
                            <span>Azul</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="green">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-green-500" />
                            <span>Verde</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modelo de IA</Label>
                  <Select value={formData.model} onValueChange={(value) => handleSelectChange("model", value)}>
                    <SelectTrigger className="bg-slate-900/50 border-gray-700">
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-gray-700">
                      {aiModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex flex-col">
                            <span>{model.name}</span>
                            <span className="text-xs text-gray-400">{model.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">Prompt do Sistema</Label>
                  <Textarea
                    id="systemPrompt"
                    name="systemPrompt"
                    value={formData.systemPrompt}
                    onChange={handleInputChange}
                    placeholder="Instruções detalhadas para o assistente sobre como ele deve se comportar e responder"
                    className="bg-slate-900/50 border-gray-700 min-h-[200px]"
                    required
                  />
                  <p className="text-xs text-gray-400">
                    Estas instruções definem como o assistente irá se comportar. Seja específico sobre o conhecimento,
                    tom, limitações e formato das respostas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-slate-800/70 border-gray-700">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="isPublic">Tornar Público</Label>
                    <p className="text-sm text-gray-400">
                      Se ativado, este assistente estará disponível para todos os usuários da plataforma.
                    </p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleSwitchChange("isPublic", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 bg-slate-700 text-gray-300 px-2 py-1 rounded-md text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Adicionar tag"
                      className="bg-slate-900/50 border-gray-700"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddTag}
                      className="border-gray-700 text-gray-400 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Tags ajudam a categorizar e encontrar seu assistente mais facilmente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <Card className="bg-slate-800/70 border-gray-700">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Documentos</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.documents.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center gap-1 bg-slate-700 text-gray-300 px-2 py-1 rounded-md text-sm"
                      >
                        <FileUp className="h-3 w-3 text-gray-400" />
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file.name)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="file" id="documents" className="hidden" multiple onChange={handleFileChange} />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("documents")?.click()}
                      className="border-gray-700 text-gray-400 hover:text-white w-full"
                    >
                      <FileUp className="h-4 w-4 mr-2" />
                      Fazer upload de documentos
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Faça upload de documentos para que o assistente possa usar como referência.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Base de Conhecimento</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.knowledgeBase.map((kb) => (
                      <div
                        key={kb}
                        className="flex items-center gap-1 bg-slate-700 text-gray-300 px-2 py-1 rounded-md text-sm"
                        className="flex items-center gap-1 bg-slate-700 text-gray-300 px-2 py-1 rounded-md text-sm"
                      >
                        <span>{kb}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKnowledgeBase(kb)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newKnowledgeBase}
                      onChange={(e) => setNewKnowledgeBase(e.target.value)}
                      placeholder="Adicionar URL ou referência"
                      className="bg-slate-900/50 border-gray-700"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddKnowledgeBase()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddKnowledgeBase}
                      className="border-gray-700 text-gray-400 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Adicione URLs ou referências para fontes de conhecimento que o assistente deve consultar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}

