// This file creates a global authentication context for your app, so that any component 
// can access - user, login, logout, loading, sidebarExpanded, toggleSidebar

// API called - /login

// useAuth

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

//Creates a new context object
const AuthContext = createContext({});

// API Setup
const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

export function AuthProvider({ children }) {
  // State Variables
  const [user, setUser] = useState(null); // Holds the current logged-in user's info
  const [loading, setLoading] = useState(true); // Tells if we're still checking the login status
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Controls whether the sidebar is expanded or collapsed

  const router = useRouter();

  // Check if user is logged in (client-side only)
  // sets - user,loading
  useEffect(() => {
    const loggedInUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null; 
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  // Login Function - Calls your backend /login API
  // sets - user, cookies, localStorage
  // redirects to configuration page
  const login = async (email, password) => {
    try {
      const response = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const user = { email, isLoggedIn: true }; // user object to store locally
        localStorage.setItem("user", JSON.stringify(user)); // saves the user data in browser's localStorage
        Cookies.set("user", JSON.stringify(user), { expires: 7 }); // Set cookie to expire in 7 days
        setUser(user);
        router.push("/configurations"); 
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      throw error;
    }
  };

  // Logout Function - Clears localStorage and cookies
  // redirects to login page
  const logout = () => {
    localStorage.removeItem("user");
    Cookies.remove("user");
    setUser(null);
    router.push("/auth/login");
  };

  // Sidebar Toggle
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, sidebarExpanded, toggleSidebar }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// A shortcut (custom hook) to easily access the context from other components
export const useAuth = () => useContext(AuthContext); 
