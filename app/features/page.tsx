import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Scale, MessageSquare, FileText, Brain, ArrowRight, Check, Shield, Zap, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <MainNav />
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Criar Conta</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 md:py-32 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white mb-6">
                Recursos Poderosos para Advogados
              </h1>
              <p className="text-xl text-gray-400">
                Conheça as ferramentas que estão transformando a prática jurídica e aumentando a produtividade de
                advogados em todo o Brasil.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-slate-800/70 border-gray-700">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle className="text-white">Assistentes Especializados</CardTitle>
                  <CardDescription className="text-gray-400">
                    Assistentes de IA treinados em diferentes áreas do direito
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Especialista em Direito Penal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Especialista em Direito Trabalhista</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Especialista em Direito Civil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Especialista em Direito Tributário</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 border-gray-700">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-indigo-500" />
                  </div>
                  <CardTitle className="text-white">Análise de Documentos</CardTitle>
                  <CardDescription className="text-gray-400">
                    Processamento inteligente de documentos jurídicos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Resumo automático de documentos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Extração de informações-chave</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Análise de contratos e petições</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Biblioteca de documentos organizada</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 border-gray-700">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle className="text-white">Chat Inteligente</CardTitle>
                  <CardDescription className="text-gray-400">
                    Interação natural com assistentes jurídicos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Respostas contextualizadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Histórico de conversas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Compartilhamento de documentos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Sugestões inteligentes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 border-gray-700">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle className="text-white">Pesquisa Jurídica</CardTitle>
                  <CardDescription className="text-gray-400">
                    Acesso rápido a informações jurídicas relevantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Busca em jurisprudência</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Legislação atualizada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Precedentes relevantes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Doutrinas e artigos</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 border-gray-700">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-amber-500/20 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-amber-500" />
                  </div>
                  <CardTitle className="text-white">Produtividade</CardTitle>
                  <CardDescription className="text-gray-400">
                    Ferramentas para otimizar seu fluxo de trabalho
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Modelos de documentos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Sugestões de estratégias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Análise de prazos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Estatísticas de uso</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 border-gray-700">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-red-500" />
                  </div>
                  <CardTitle className="text-white">Segurança e Privacidade</CardTitle>
                  <CardDescription className="text-gray-400">
                    Proteção de dados e informações confidenciais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Criptografia de ponta a ponta</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Conformidade com LGPD</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Controle de acesso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">Backups automáticos</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-16 text-center">
              <Link href="/pricing">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                >
                  Ver Planos e Preços
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-700 bg-slate-900">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-purple-500" />
              <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
                LexIA
              </span>
            </div>
            <p className="text-gray-400 max-w-xs">
              Assistentes de IA jurídica para advogados e profissionais do direito.
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Produto</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-sm text-gray-400 hover:text-white">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-gray-400 hover:text-white">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-gray-400 hover:text-white">
                    Sobre
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Suporte</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-sm text-gray-400 hover:text-white">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                    Termos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container py-6 text-center text-sm text-gray-400">
          <p>© 2023 LexIA. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

