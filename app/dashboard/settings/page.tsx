"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Settings, Moon, Sun, BellRing, Lock, Shield, Database, Cpu, Zap, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark")
  const [model, setModel] = useState("gpt-4o")
  const [temperature, setTemperature] = useState(0.7)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-purple-500" />
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-gray-700">
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="ai">Modelos de IA</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-slate-800/70 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Tema</CardTitle>
              <CardDescription className="text-gray-400">Personalize a aparência da plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-gray-400" />
                  <div>
                    <Label htmlFor="dark-mode" className="text-white">
                      Modo Escuro
                    </Label>
                    <p className="text-sm text-gray-400">Ative o tema escuro para reduzir o cansaço visual</p>
                  </div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    theme === "dark"
                      ? "border-purple-500 bg-slate-700/50"
                      : "border-gray-700 bg-slate-800/30 hover:border-gray-600"
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-medium">Escuro</span>
                    <Moon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="h-24 bg-slate-900 rounded-md border border-gray-700"></div>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    theme === "light"
                      ? "border-purple-500 bg-slate-700/50"
                      : "border-gray-700 bg-slate-800/30 hover:border-gray-600"
                  }`}
                  onClick={() => setTheme("light")}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-medium">Claro</span>
                    <Sun className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="h-24 bg-gray-100 rounded-md border border-gray-300"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card className="bg-slate-800/70 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Modelos de IA</CardTitle>
              <CardDescription className="text-gray-400">
                Configure os modelos de IA utilizados pelos assistentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="model" className="text-white mb-2 block">
                    Modelo Principal
                  </Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger id="model" className="bg-slate-900/50 border-gray-700">
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-gray-700">
                      <SelectItem value="gpt-4o">GPT-4o (Recomendado)</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="temperature" className="text-white">
                      Temperatura: {temperature.toFixed(1)}
                    </Label>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[temperature]}
                    onValueChange={(value) => setTemperature(value[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Mais preciso</span>
                    <span>Mais criativo</span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Cpu className="h-5 w-5 text-gray-400" />
                      <div>
                        <Label htmlFor="context-window" className="text-white">
                          Janela de Contexto Estendida
                        </Label>
                        <p className="text-sm text-gray-400">
                          Permite que o assistente lembre de mais detalhes da conversa
                        </p>
                      </div>
                    </div>
                    <Switch id="context-window" defaultChecked />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-gray-400" />
                      <div>
                        <Label htmlFor="tools" className="text-white">
                          Ferramentas Avançadas
                        </Label>
                        <p className="text-sm text-gray-400">
                          Permite que o assistente use ferramentas como pesquisa na web e análise de documentos
                        </p>
                      </div>
                    </div>
                    <Switch id="tools" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-800/70 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Notificações</CardTitle>
              <CardDescription className="text-gray-400">
                Configure como e quando deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BellRing className="h-5 w-5 text-gray-400" />
                    <div>
                      <Label htmlFor="email-notifications" className="text-white">
                        Notificações por Email
                      </Label>
                      <p className="text-sm text-gray-400">Receba atualizações importantes por email</p>
                    </div>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BellRing className="h-5 w-5 text-gray-400" />
                    <div>
                      <Label htmlFor="browser-notifications" className="text-white">
                        Notificações no Navegador
                      </Label>
                      <p className="text-sm text-gray-400">Receba notificações em tempo real no navegador</p>
                    </div>
                  </div>
                  <Switch id="browser-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BellRing className="h-5 w-5 text-gray-400" />
                    <div>
                      <Label htmlFor="update-notifications" className="text-white">
                        Atualizações de Produto
                      </Label>
                      <p className="text-sm text-gray-400">Seja informado sobre novos recursos e melhorias</p>
                    </div>
                  </div>
                  <Switch id="update-notifications" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-slate-800/70 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Privacidade e Segurança</CardTitle>
              <CardDescription className="text-gray-400">
                Gerencie suas configurações de privacidade e segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-gray-400" />
                    <div>
                      <Label htmlFor="data-retention" className="text-white">
                        Retenção de Dados
                      </Label>
                      <p className="text-sm text-gray-400">
                        Armazenar histórico de conversas para melhorar os assistentes
                      </p>
                    </div>
                  </div>
                  <Switch id="data-retention" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <Label htmlFor="2fa" className="text-white">
                        Autenticação de Dois Fatores
                      </Label>
                      <p className="text-sm text-gray-400">Adicione uma camada extra de segurança à sua conta</p>
                    </div>
                  </div>
                  <Switch id="2fa" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <div>
                      <Label htmlFor="session-timeout" className="text-white">
                        Tempo Limite de Sessão
                      </Label>
                      <p className="text-sm text-gray-400">Encerrar sessão após período de inatividade</p>
                    </div>
                  </div>
                  <Switch id="session-timeout" defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Todos os Dados
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

