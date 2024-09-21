import { useAuth } from '../context/AuthProvider'
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
    className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
    const { logout } = useAuth()

    return (
        <Button
            variant="outline"
            className={className}
            onClick={logout}
        >
            <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
    )
}