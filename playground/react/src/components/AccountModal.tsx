import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

interface AccountModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (newUsername: string, newEmail: string, newAvatarUrl: string) => void
    currentUsername: string
    currentEmail: string
    currentAvatarUrl: string
}

export function AccountModal({
    isOpen,
    onClose,
    onSave,
    currentUsername,
    currentEmail,
    currentAvatarUrl
}: AccountModalProps) {
    const [username, setUsername] = useState(currentUsername)
    const [email, setEmail] = useState(currentEmail)
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl)

    const handleSave = () => {
        onSave(username, email, avatarUrl)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage Account</DialogTitle>
                    <DialogDescription>
                        Make changes to your account here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-center">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={avatarUrl} alt={username} />
                            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="avatar-url" className="text-right">
                            Avatar URL
                        </Label>
                        <Input
                            id="avatar-url"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}