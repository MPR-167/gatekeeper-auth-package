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
        >
            <LogOut className="mr-2 h-4 w-4" /> Logout
        </button>
    )
}