"use client"

import { createContext, useState, useEffect } from "react"
import { getUserInfo } from "../services/userService"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 const token = localStorage.getItem("token")
  useEffect(() => {
   
    if (token) {
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [])
console.log(token)
  const fetchUserData = async () => {
    try {
      const userData = await getUserInfo(token)
      console.log("User data:", userData)
      setUser(userData)
    } catch (err) {
      console.error("Failed to fetch user data:", err)
      setError("Failed to authenticate user")
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  const login = (token) => {
  localStorage.setItem("token", token)
  fetchUserData() // this will set user properly
}


  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading, error, token}}>
      {children}
    </AuthContext.Provider>
  )
}
