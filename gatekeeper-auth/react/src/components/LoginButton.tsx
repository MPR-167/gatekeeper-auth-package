import { useAuth } from '../context/AuthProvider'
import { Button } from "../components/ui/button"
import { LogIn } from 'lucide-react'

interface LoginButtonProps {
    className?: string
}

export function LoginButton({ className }: LoginButtonProps) {
    const { login } = useAuth()

    const handleLogin = () => {
        // In a real application, you'd typically open a login modal or navigate to a login page
        login('demo', 'password')
    }

    return (
        <Button
            variant="default"
            className={className}
            onClick={handleLogin}
        >
            <LogIn className="mr-2 h-4 w-4" /> Login
        </Button>
    )
}