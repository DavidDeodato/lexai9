"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Scale } from "lucide-react"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <Scale className="h-6 w-6 text-purple-500" />
        <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
          LexIA
        </span>
      </Link>
      <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
        <Link
          href="/"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/" ? "text-purple-500" : "text-muted-foreground",
          )}
        >
          Início
        </Link>
        <Link
          href="/features"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/features" ? "text-purple-500" : "text-muted-foreground",
          )}
        >
          Recursos
        </Link>
        <Link
          href="/pricing"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/pricing" ? "text-purple-500" : "text-muted-foreground",
          )}
        >
          Preços
        </Link>
        <Link
          href="/about"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/about" ? "text-purple-500" : "text-muted-foreground",
          )}
        >
          Sobre
        </Link>
      </nav>
    </div>
  )
}

