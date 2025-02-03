"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount (client-side only)
    const loggedInUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.status === 200) {
        const data = await response.json()
        const user = { email, isLoggedIn: true }
        localStorage.setItem("user", JSON.stringify(user))
        Cookies.set("user", JSON.stringify(user), { expires: 7 }) // Set cookie to expire in 7 days
        setUser(user)
        router.push("/") // Redirect to homepage after successful login
        return data
      } else {
        throw new Error("Login failed")
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    Cookies.remove("user")
    setUser(null)
    router.push("/login")
  }

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, sidebarExpanded, toggleSidebar }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

