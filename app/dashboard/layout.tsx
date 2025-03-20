"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Scale, Menu, X, Home, Settings, MessageSquare, Brain, BookOpen, Clock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useChat } from "@/hooks/use-chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { PlanBadge } from "@/components/plan-badge"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [recentChats, setRecentChats] = useState([])
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { getRecentChats } = useChat()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Carregar chats recentes
    const loadRecentChats = async () => {
      const chats = await getRecentChats(5)
      setRecentChats(chats)
    }

    loadRecentChats()
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Assistentes", href: "/dashboard/assistants", icon: <Brain className="h-5 w-5" /> },
    { name: "Histórico", href: "/dashboard/history", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Biblioteca", href: "/dashboard/library", icon: <BookOpen className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
      {/* Sidebar toggle - mobile and desktop */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-slate-800 text-gray-300"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-800/90 backdrop-blur-sm border-r border-gray-700 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center justify-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Scale className="h-7 w-7 text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
                LexIA
              </span>
            </Link>
          </div>

          <ScrollArea className="flex-1 py-4 px-3">
            <nav className="space-y-6">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      pathname === item.href
                        ? "bg-purple-500/20 text-purple-400"
                        : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {recentChats.length > 0 && (
                <div>
                  <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Conversas Recentes
                  </h3>
                  <div className="mt-2 space-y-1">
                    {recentChats.map((chat) => (
                      <Link
                        key={chat.id}
                        href={`/dashboard/chat/${chat.id}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          pathname === `/dashboard/chat/${chat.id}`
                            ? "bg-purple-500/20 text-purple-400"
                            : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                        }`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="truncate">{chat.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  pathname === "/dashboard/settings"
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Configurações</span>
              </Link>
            </div>
            <Link href="/dashboard/profile">
              <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-700/50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                  {user?.name?.substring(0, 2) || "AD"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{user?.name || "Advogado Demo"}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || "advogado@exemplo.com"}</p>
                </div>
              </div>
            </Link>
            <Button
              onClick={handleLogout}
              className="w-full mt-4 text-left px-3 py-2 rounded-md text-red-400 hover:bg-slate-700/50 hover:text-red-300 transition-colors"
              variant="ghost"
            >
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-0 lg:ml-64" : "ml-0"}`}>
        <div className="min-h-screen p-4 md:p-8">
          <div className="flex justify-end items-center mb-6 gap-4">
            <PlanBadge />
            <ThemeToggle />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}

