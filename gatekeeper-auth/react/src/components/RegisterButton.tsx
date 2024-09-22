import { useAuth } from '../context/AuthProvider'
import { Button } from "@/components/ui/button"
import { UserPlus } from 'lucide-react'

interface RegisterButtonProps {
    className?: string
}

export function RegisterButton({ className }: RegisterButtonProps) {
    const { register } = useAuth()

    const handleRegister = () => {
        // In a real application, you'd typically open a registration modal or navigate to a registration page
        register('anees@an.com', 'username', 'password')
    }

    return (
        <Button
            variant="secondary"
            className={className}
            onClick={handleRegister}
        >
            <UserPlus className="mr-2 h-4 w-4" /> Register
        </Button>
    )
}