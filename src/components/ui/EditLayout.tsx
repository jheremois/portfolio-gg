import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { User, FileText, Briefcase, PlusCircle, ArrowLeft, Menu, X } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

export default function EditLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [activeTab, setActiveTab] = useState(pathname)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { user, isLoading, error } = useUser()
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

    const tabs = [
        { name: 'Profile', path: '/profile/edit', icon: User },
        { name: 'Details', path: '/profile/edit-details', icon: FileText },
        { name: 'Projects', path: '/profile/edit-portfolio-item/list', icon: Briefcase },
    ]

    const handleTabClick = (path: string) => {
        setActiveTab(path)
        router.push(path)
        setIsSidebarOpen(false)
    }

    const handleLogout = async () => {
        setIsLogoutDialogOpen(false)
        await signOut({ callbackUrl: '/' })
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true)
            } else {
                setIsSidebarOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="flex min-h-screen">
            {/* Mobile menu button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-background border-2 border-white/10 rounded-md shadow-md"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X className="h-8 w-8 text-white" /> : <Menu className="h-8 w-8 text-white" />}
            </button>

            {/* Side Navigation */}
            <nav className={`
                fixed md:static inset-y-0 left-0 z-40 w-80 bg-card p-6 text-text shadow-md transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 border-r-2 border-white/20
            `}>
                <div className="pt-20 lg:pt-12">
                    {isLoading ? (
                        <div className="animate-pulse">
                            <div className="h-16 w-16 bg-gray-300 rounded-lg mb-2"></div>
                            <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                        </div>
                    ) : error ? (
                        <p className="text-red-500">Error: {error}</p>
                    ) : user ? (
                        <div className="">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.profile_image || '/placeholder-user.jpg'}
                                        alt={user.name}
                                        width={55}
                                        height={55}
                                        className="rounded-lg h-full"
                                    />
                                    <div className="">
                                        <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                                            <DialogTrigger asChild>
                                                <button
                                                    className='
                                                        flex items-center gap-1 bg-gray-900/30 p-3 
                                                        py-2 rounded-xl border-2 border-white/20
                                                    '
                                                >
                                                    Log out
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                                                    </svg>
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className='bg-card text-title border-gray-200/20'>
                                                <DialogHeader>
                                                    <DialogTitle >Are you sure you want to log out?</DialogTitle>
                                                    <DialogDescription className='text-text'>
                                                        You will be redirected to the home page after logging out.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter className='pt-5 gap-4 lg:gap-2'>
                                                    <button
                                                        className='
                                                            bg-secondary border-2 border-gray-300/20 
                                                            py-2 px-4 rounded-xl text-title font-semibold
                                                        '
                                                        onClick={() => setIsLogoutDialogOpen(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button className='
                                                            bg-red-600 border-2 border-gray-300/20 
                                                            py-2 px-4 rounded-xl text-title font-semibold
                                                        '
                                                        onClick={handleLogout}
                                                    >
                                                        Log out
                                                    </button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                <div className="">
                                    <h2 className="text-lg font-bold text-gray-200">{user.name}</h2>
                                    {user.email && (
                                        <p className="text-gray-400 text-xs mt-1">{user.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-300">User not found</p>
                    )}
                </div>
                <hr className='my-8 border-t-2 border-gray-200/40' />
                <nav>
                    <ul className="space-y-2">
                        {tabs.map((tab) => (
                            <li key={tab.path}>
                                <Link href={tab.path}>
                                    <span
                                        className={`flex items-center py-5 px-4 rounded-2xl text-xl font-semibold transition duration-200 ${activeTab === tab.path
                                            ? 'bg-gray-100/15 text-white'
                                            : 'text-text hover:bg-gray-300/20'
                                            }`}
                                        onClick={() => handleTabClick(tab.path)}
                                    >
                                        <tab.icon className="mr-3 h-5 w-5" />
                                        {tab.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link href={"/profile/edit-new-project"}>
                        <button className="mt-6 flex items-center py-5 w-full px-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-800 transition duration-200">
                            <PlusCircle className="mr-3 h-5 w-5" />
                            Add new Project
                        </button>
                    </Link>
                </nav>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 px-4 md:px-8 pt-20 overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    )
}