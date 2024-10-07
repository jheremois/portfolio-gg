"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Share, Copy } from "lucide-react"

interface ShareModalProps {
    username: string
}

export default function ShareModal({ username }: ShareModalProps) {
    const [open, setOpen] = useState(false)
    const profileUrl = `https://www.portfoliogg.com/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
            .then(() => {
                toast.success("URL copied to clipboard", {
                    duration: 2000,
                })
            })
            .catch((error) => {
                console.error("Error copying URL to clipboard: ", error)
                toast.error("Error copying URL to clipboard", {
                    duration: 2000,
                })
            })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="px-4 py-3 border-2 border-border rounded-xl font-semibold bg-buttonsSecondary w-full text-base">
                    Share
                </button>
            </DialogTrigger>
            <DialogContent className="bg-card text-title border-border sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share profile</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4 py-4">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="profile-url" className="text-sm font-medium">
                            Profile URL
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                id="profile-url"
                                defaultValue={profileUrl}
                                readOnly
                                className="flex-1 min-w-0 block w-full px-3 py-3 rounded-lg bg-input border-2 border-gray-300/20 text-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <button 
                                className="bg-text border-2 border-white/30 text-gray-950 font-semibol w-fit rounded-lg px-4 py-3" 
                                onClick={copyToClipboard}
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}