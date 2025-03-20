"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function PlanBadge() {
  const [userPlan, setUserPlan] = useState<string>("free")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const plan = localStorage.getItem("userPlan") || "free"
    setUserPlan(plan)
  }, [])

  if (!isClient) return null

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "pro":
        return "Profissional"
      case "enterprise":
        return "Empresarial"
      default:
        return "Gratuito"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "pro":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50"
      case "enterprise":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  return (
    <Link href="/pricing">
      <Badge variant="outline" className={`cursor-pointer hover:opacity-80 ${getPlanColor(userPlan)}`}>
        Plano {getPlanName(userPlan)}
      </Badge>
    </Link>
  )
}

