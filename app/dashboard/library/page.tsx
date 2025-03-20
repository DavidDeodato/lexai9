"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileUp,
  Search,
  Plus,
  MoreHorizontal,
  File,
  FileText,
  FileImage,
  FileArchive,
  Download,
  Eye,
  Trash,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

interface Document {
  id: number
  name: string
  file_type: string
  file_url: string
  file_size: number
  created_at: string
  tags: string[]
}

export default function LibraryPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/documents")
        if (response.ok) {
          const data = await response.json()
          setDocuments(data)
        } else {
          throw new Error("Falha ao carregar documentos")
        }
      } catch (error) {
        console.error("Erro ao carregar documentos:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os documentos. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [toast])

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <FileImage className="h-6 w-6 text-blue-400" />
    } else if (fileType === "application/pdf") {
      return <FileText className="h-6 w-6 text-red-400" />
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <FileText className="h-6 w-6 text-blue-400" />
    } else if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
      return <FileText className="h-6 w-6 text-green-400" />
    } else if (fileType.includes("zip") || fileType.includes("compressed")) {
      return <FileArchive className="h-6 w-6 text-yellow-400" />
    } else {
      return <File className="h-6 w-6 text-gray-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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

  const handleUpload = async () => {
    if (uploadingFiles.length === 0) return

    setIsUploading(true)
    const uploadedDocuments: Document[] = []

    try {
      for (const file of uploadingFiles) {
        const formData = new FormData()
        formData.append("file", file)

        // Simular progresso de upload
        let progress = 0
        const uploadTimer = setInterval(() => {
          progress += 5
          if (progress <= 95) {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: progress,
            }))
          }
        }, 100)

        try {
          const response = await fetch("/api/documents", {
            method: "POST",
            body: formData,
          })

          clearInterval(uploadTimer)

          if (response.ok) {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: 100,
            }))

            const document = await response.json()
            uploadedDocuments.push(document)
          } else {
            throw new Error(`Falha ao fazer upload de ${file.name}`)
          }
        } catch (error) {
          console.error(`Erro ao fazer upload do arquivo ${file.name}:`, error)
          toast({
            title: "Erro no upload",
            description: `Não foi possível fazer upload de ${file.name}. Tente novamente.`,
            variant: "destructive",
          })
        }
      }

      if (uploadedDocuments.length > 0) {
        setDocuments((prev) => [...uploadedDocuments, ...prev])
        toast({
          title: "Upload concluído",
          description: `${uploadedDocuments.length} documento(s) enviado(s) com sucesso.`,
        })

        // Limpar arquivos após upload bem-sucedido
        setUploadingFiles([])
        setUploadProgress({})
        setIsUploadDialogOpen(false)
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante o upload. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm("Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.")) {
      return
    }

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))

        toast({
          title: "Documento excluído",
          description: "O documento foi excluído com sucesso.",
        })
      } else {
        throw new Error("Falha ao excluir documento")
      }
    } catch (error) {
      console.error("Erro ao excluir documento:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o documento. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const handlePreviewDocument = (document: Document) => {
    setPreviewDocument(document)
  }

  const filteredDocuments = documents.filter((document) => {
    // Filtrar por pesquisa
    const matchesSearch = document.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtrar por tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pdfs" && document.file_type === "application/pdf") ||
      (activeTab === "images" && document.file_type.startsWith("image/")) ||
      (activeTab === "documents" &&
        (document.file_type.includes("word") ||
          document.file_type.includes("document") ||
          document.file_type.includes("spreadsheet") ||
          document.file_type.includes("excel")))

    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Biblioteca</h1>
          <p className="text-gray-400">Gerencie seus documentos e arquivos</p>
        </div>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Fazer Upload
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Fazer Upload de Documentos</DialogTitle>
              <DialogDescription className="text-gray-400">
                Selecione os arquivos que deseja enviar para a biblioteca.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-purple-500/50 transition-colors">
                <FileUp className="h-10 w-10 text-gray-400 mb-4" />
                <p className="text-gray-300 mb-2">Arraste e solte arquivos aqui ou clique para selecionar</p>
                <p className="text-gray-400 text-sm">Suporta PDF, Word, Excel, imagens e outros formatos</p>
                <input type="file" id="file-upload" className="hidden" multiple onChange={handleFileChange} />
                <Button
                  variant="outline"
                  className="mt-4 border-gray-700"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Selecionar Arquivos
                </Button>
              </div>

              {uploadingFiles.length > 0 && (
                <div className="space-y-3">
                  <Label>Arquivos selecionados</Label>
                  {uploadingFiles.map((file) => (
                    <div key={file.name} className="bg-slate-900/50 rounded-md p-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="text-sm text-gray-300 truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          className="text-gray-400 hover:text-white"
                          onClick={() => removeUploadingFile(file.name)}
                          disabled={isUploading}
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                      <Progress value={uploadProgress[file.name] || 0} className="h-1" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)} disabled={isUploading}>
                Cancelar
              </Button>
              <Button onClick={handleUpload} disabled={uploadingFiles.length === 0 || isUploading}>
                {isUploading ? "Enviando..." : "Fazer Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Pesquisar documentos..."
          className="pl-10 bg-slate-800/50 border-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-gray-700">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pdfs">PDFs</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="images">Imagens</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <Card key={index} className="bg-slate-800/70 border-gray-700 animate-pulse">
                  <CardContent className="p-6 h-[100px]"></CardContent>
                </Card>
              ))}
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((document) => (
                <Card
                  key={document.id}
                  className="bg-slate-800/70 border-gray-700 hover:border-purple-500/50 transition-all relative group"
                >
                  <CardContent className="p-4">
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-800 border-gray-700">
                          <DropdownMenuItem
                            className="text-gray-300 focus:text-white focus:bg-slate-700 cursor-pointer"
                            onClick={() => window.open(document.file_url, "_blank")}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-gray-300 focus:text-white focus:bg-slate-700 cursor-pointer"
                            onClick={() => handlePreviewDocument(document)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-400 focus:text-red-300 focus:bg-slate-700 cursor-pointer"
                            onClick={() => handleDeleteDocument(document.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-start gap-3">
                      {getFileIcon(document.file_type)}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{document.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <span>{formatFileSize(document.file_size)}</span>
                          <span>•</span>
                          <span>{new Date(document.created_at).toLocaleDateString()}</span>
                        </div>

                        {document.tags && document.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {document.tags.map((tag, index) => (
                              <span key={index} className="px-1.5 py-0.5 bg-slate-700 text-gray-300 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Nenhum documento encontrado</h3>
              <p className="text-gray-400 text-center max-w-md">
                {searchQuery
                  ? `Não encontramos documentos correspondentes a "${searchQuery}". Tente outra pesquisa.`
                  : "Não há documentos disponíveis nesta categoria."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Diálogo de visualização de documento */}
      <Dialog open={!!previewDocument} onOpenChange={(open) => !open && setPreviewDocument(null)}>
        <DialogContent className="bg-slate-800 border-gray-700 text-white max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewDocument?.name}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden rounded-md bg-slate-900 h-full">
            {previewDocument && (
              <iframe src={previewDocument.file_url} className="w-full h-full" title={previewDocument.name} />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDocument(null)}>
              Fechar
            </Button>
            <Button onClick={() => previewDocument && window.open(previewDocument.file_url, "_blank")}>
              Abrir em Nova Aba
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

