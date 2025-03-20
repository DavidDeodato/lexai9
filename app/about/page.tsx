import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Scale, Users, Building, Award, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
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
                Sobre a LexIA
              </h1>
              <p className="text-xl text-gray-400">
                Transformando a prática jurídica com inteligência artificial avançada e assistentes especializados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Nossa Missão</h2>
                <p className="text-gray-300 mb-4">
                  Na LexIA, nossa missão é democratizar o acesso a ferramentas de inteligência artificial para
                  profissionais do direito, permitindo que advogados de todos os portes possam se beneficiar da
                  tecnologia mais avançada.
                </p>
                <p className="text-gray-300 mb-4">
                  Acreditamos que a IA não deve substituir advogados, mas sim potencializar suas capacidades, permitindo
                  que foquem no que realmente importa: a estratégia jurídica e o atendimento ao cliente.
                </p>
                <p className="text-gray-300">
                  Nossos assistentes especializados são treinados com conhecimento jurídico brasileiro atualizado,
                  oferecendo suporte em diversas áreas do direito e ajudando a aumentar a produtividade e a qualidade do
                  trabalho.
                </p>
              </div>
              <div className="bg-slate-800/70 border border-gray-700 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Scale className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">LexIA</h3>
                    <p className="text-gray-400">Assistentes de IA Jurídica</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-300">Fundada em 2023</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-300">+5.000 advogados atendidos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-300">+500 escritórios parceiros</span>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white text-center mb-12">Nossa Equipe</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  name: "Ana Silva",
                  role: "CEO & Fundadora",
                  bio: "Advogada com mais de 15 anos de experiência e especialista em tecnologia jurídica.",
                },
                {
                  name: "Carlos Mendes",
                  role: "CTO",
                  bio: "Engenheiro de IA com foco em processamento de linguagem natural e sistemas jurídicos.",
                },
                {
                  name: "Juliana Costa",
                  role: "Diretora Jurídica",
                  bio: "Mestre em Direito Digital e especialista em proteção de dados e propriedade intelectual.",
                },
                {
                  name: "Roberto Almeida",
                  role: "Diretor de Produto",
                  bio: "Especialista em UX/UI com experiência em desenvolvimento de produtos para o setor jurídico.",
                },
                {
                  name: "Fernanda Santos",
                  role: "Diretora de Operações",
                  bio: "MBA em Gestão de Negócios e experiência em scaling de startups de tecnologia.",
                },
                {
                  name: "Marcelo Lima",
                  role: "Diretor Comercial",
                  bio: "Especialista em vendas B2B para o setor jurídico e parcerias estratégicas.",
                },
              ].map((member, index) => (
                <Card key={index} className="bg-slate-800/70 border-gray-700">
                  <CardContent className="p-6">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mb-4">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-purple-400 text-sm mb-3">{member.role}</p>
                    <p className="text-gray-400">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-slate-800/70 border border-gray-700 rounded-xl p-8 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Junte-se a nós</h2>
              <p className="text-gray-300 mb-6">
                Estamos sempre em busca de talentos apaixonados por tecnologia e direito. Se você quer fazer parte da
                revolução da IA jurídica, entre em contato conosco.
              </p>
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                  Fale Conosco
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

