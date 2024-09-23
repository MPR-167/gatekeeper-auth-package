import axios from 'axios'
import { createContext, useState, useContext, ReactNode } from 'react'

type AuthContextType = {
    isAuthenticated: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    register: (email: string, username: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

type AuthProviderProps = {
    tenantId: number
    projectId: number
    customRoleId: number
    children: ReactNode
}

export function AuthProvider({ children, tenantId, projectId, customRoleId }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const login = async (email: string, password: string) => {
        // Implement your login logic here
        // console.log('Logging in Logic :', email)
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password,
            });
            if (response.status === 200) {
                setIsAuthenticated(true);
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setIsAuthenticated(false);
        }
    }

    const logout = () => {
        // Implement your logout logic here
        console.log('Logging out')
        setIsAuthenticated(false)
    }

    const register = async (email: string, username: string, password: string) => {
        // Implement your registration logic here
        // console.log('Registering logic for ', email)

        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', {
                email,
                username,
                password,
                tenantId,
                projectId,
                customRoleId
            });
            if (response.status === 201) {
                setIsAuthenticated(true);
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setIsAuthenticated(false);
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}