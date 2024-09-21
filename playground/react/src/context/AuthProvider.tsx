import React, { createContext, useState, useContext, ReactNode } from 'react'

interface AuthContextType {
    isAuthenticated: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    register: (username: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const login = async (username: string, password: string) => {
        // Implement your login logic here
        console.log('Logging in Logic :', username)
        setIsAuthenticated(true)
    }

    const logout = () => {
        // Implement your logout logic here
        console.log('Logging out')
        setIsAuthenticated(false)
    }

    const register = async (username: string, password: string) => {
        // Implement your registration logic here
        console.log('Registering logic for ', username)
        setIsAuthenticated(true)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}