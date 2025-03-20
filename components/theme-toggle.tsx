"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // Check if document is available (client-side)
    if (typeof document !== "undefined") {
      // Initialize based on class presence
      setIsDarkMode(document.documentElement.classList.contains("dark"))
    }
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add("dark")
      setIsDarkMode(true)
    }
  }

  // Add dark class to html on initial load
  useEffect(() => {
    if (typeof document !== "undefined" && isDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="border-gray-700 text-gray-400 hover:text-white"
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}

