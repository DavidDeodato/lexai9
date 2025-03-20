import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Scale, MessageSquare, FileText, Brain, ArrowRight, Check } from "lucide-react"

export default function Home() {
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
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                    Assistentes de IA Jurídica para Advogados
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    Aumente sua produtividade com assistentes de IA especializados em direito. Análise de documentos,
                    pesquisa jurídica e redação de peças em segundos.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="px-8">
                      Começar Gratuitamente
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className="px-8">
                      Ver Planos
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl border bg-slate-800/50 border-gray-700 p-4">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Scale className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white">Assistente Jurídico</h3>
                        <p className="text-xs text-gray-400">Especialista em direito civil</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-lg p-3 bg-purple-500/20 text-white">
                          <p className="text-sm">
                            Preciso analisar um contrato de locação comercial. Quais são as cláusulas mais importantes?
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-slate-700/50 text-gray-200">
                          <p className="text-sm">
                            Em contratos de locação comercial, as cláusulas mais importantes incluem:
                          </p>
                          <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                            <li>Prazo e condições de renovação</li>
                            <li>Valor do aluguel e critérios de reajuste</li>
                            <li>Responsabilidade por benfeitorias</li>
                            <li>Multas por rescisão antecipada</li>
                            <li>Garantias (fiança, caução, seguro)</li>
                          </ul>
                          <p className="text-sm mt-2">
                            Posso ajudar a analisar seu contrato específico se você compartilhá-lo comigo.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-slate-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Recursos Poderosos
                </h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed">
                  Tudo o que você precisa para otimizar seu trabalho jurídico
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="h-16 w-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                  <Brain className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Assistentes Especializados</h3>
                <p className="text-center text-gray-400">
                  Assistentes de IA treinados em diferentes áreas do direito para atender suas necessidades específicas.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2">
                  <FileText className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Análise de Documentos</h3>
                <p className="text-center text-gray-400">
                  Faça upload de contratos, petições e outros documentos para análise rápida e precisa.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Chat Inteligente</h3>
                <p className="text-center text-gray-400">
                  Converse com assistentes jurídicos que entendem o contexto e fornecem respostas precisas.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                    Planos para Todos os Tamanhos
                  </h2>
                  <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed">
                    Escolha o plano ideal para suas necessidades, desde advogados autônomos até grandes escritórios.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-gray-300">Acesso a assistentes especializados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-gray-300">Análise de documentos jurídicos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-gray-300">Histórico de conversas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-gray-300">Biblioteca de documentos</span>
                  </li>
                </ul>
                <div>
                  <Link href="/pricing">
                    <Button className="flex items-center gap-2">
                      Ver Todos os Planos
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="rounded-xl border bg-slate-800/50 border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Gratuito</h3>
                    <p className="text-3xl font-bold text-white mb-4">
                      R$0<span className="text-lg text-gray-400">/mês</span>
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-300">2 assistentes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-300">50 mensagens/mês</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-300">5 documentos/mês</span>
                      </li>
                    </ul>
                    <Link href="/register">
                      <Button variant="outline" className="w-full">
                        Começar Grátis
                      </Button>
                    </Link>
                  </div>
                  <div className="rounded-xl border bg-purple-900/20 border-purple-500/30 p-6 relative">
                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                      <span className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Popular
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Profissional</h3>
                    <p className="text-3xl font-bold text-white mb-4">
                      R$49,90<span className="text-lg text-gray-400">/mês</span>
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-300">Todos os assistentes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-300">Mensagens ilimitadas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-300">100 documentos/mês</span>
                      </li>
                    </ul>
                    <Link href="/register">
                      <Button className="w-full">Assinar Agora</Button>
                    </Link>
                  </div>
                </div>
              </div>
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

