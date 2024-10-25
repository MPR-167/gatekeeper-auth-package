import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
    className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
    const { logout } = useAuth()
    
    return (
        <button
            onClick={logout}
            className={`inline-flex items-center rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors ${className}`}
        >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </button>
    )
}

export default LogoutButton